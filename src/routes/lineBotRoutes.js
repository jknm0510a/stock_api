import { Hono } from 'hono';
import fugleService from '../services/fugleService';
import chartService from '../services/chartService';

// Helper for Background API Logging
function logSystemAction(c, userId, actionType, symbol = null, name = null, apiEndpoint = null) {
    try {
        const stmt = c.env.DB.prepare(
            'INSERT INTO system_logs (user_id, action_type, target_symbol, target_name, api_endpoint) VALUES (?, ?, ?, ?, ?)'
        );
        const promise = stmt.bind(userId, actionType, symbol, name, apiEndpoint).run().catch(console.error);
        c.executionCtx.waitUntil(promise);
    } catch (e) {
        console.error('Failed to dispatch log event', e);
    }
}

const app = new Hono();

// Helper to verify LINE Webhook Signature using Web Crypto API (available in Cloudflare Workers)
async function verifySignature(channelSecret, body, signature) {
    const enc = new TextEncoder();

    // Import the secret key
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(channelSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    // Sign the body
    const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        enc.encode(body)
    );

    // Convert to base64
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

    return base64Signature === signature;
}

// Minimal LINE Bot API client using standard fetch
async function replyMessage(replyToken, messages, channelAccessToken) {
    const res = await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${channelAccessToken}`
        },
        body: JSON.stringify({
            replyToken: replyToken,
            messages: messages
        })
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error('LINE Reply API Error:', res.status, errorText);
        throw new Error(`LINE Reply Failed: ${res.status}`);
    }
    return res;
}

async function pushMessage(to, messages, channelAccessToken) {
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${channelAccessToken}`
        },
        body: JSON.stringify({
            to: to,
            messages: messages
        })
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error('LINE Push API Error:', res.status, errorText);
        throw new Error(`LINE Push Failed: ${res.status}`);
    }
    return res;
}

app.post('/', async (c) => {
    const signature = c.req.header('x-line-signature');
    const bodyText = await c.req.text(); // Get raw body text for signature verification

    const channelSecret = c.env.LINE_CHANNEL_SECRET;
    const channelAccessToken = c.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (!signature || !channelSecret || !channelAccessToken) {
        return c.json({ error: 'Missing configurations or signature' }, 401);
    }

    // Verify signature
    const isValid = await verifySignature(channelSecret, bodyText, signature);
    if (!isValid) {
        return c.json({ error: 'Invalid signature' }, 401);
    }

    let body;
    try {
        body = JSON.parse(bodyText);
    } catch (e) {
        return c.json({ error: 'Invalid JSON body' }, 400);
    }

    const events = body.events;
    if (!events || !Array.isArray(events)) {
        return c.json({ success: true });
    }

    // Process events in parallel but don't block the response.
    // In Cloudflare Workers, we use c.executionCtx.waitUntil to keep processing after response.
    c.executionCtx.waitUntil(Promise.all(events.map(event => handleEvent(event, c))));

    return c.json({ success: true });
});

// Proxy route for serving images synchronously on-demand with clean POST API
app.get('/image/:id', async (c) => {
    const symbolWithExt = c.req.param('id');
    const symbol = symbolWithExt.replace('.png', '');

    // Grab the query variables injected by our webhook handler
    const env = c.env;
    const prevStr = c.req.query('prev');
    const name = c.req.query('name') || symbol;

    try {
        // Fetch intraday candles right now on the fly
        const candlesRes = await fugleService.getIntradayCandles(symbol, env.FUGLE_API_KEY, 3);
        const candles = candlesRes?.data || [];

        // Build the precise payload JSON string
        const parsedPrev = (prevStr && !isNaN(Number(prevStr))) ? Number(prevStr) : null;
        const chartPayloadStr = chartService.generateTrendChartPayload(symbol, name, candles, parsedPrev);

        // Direct POST to the raw QuickChart binary rendering engine (bypasses ALL Short URL sandbox issues)
        const response = await fetch('https://quickchart.io/chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: chartPayloadStr
        });

        if (!response.ok) {
            return c.text('Quickchart Render Generation Failed', response.status);
        }

        const headers = new Headers();
        headers.set('Content-Type', 'image/png');
        headers.set('Cache-Control', 'public, max-age=60'); // 1 minute local cache

        return new Response(response.body, { status: 200, headers });
    } catch (error) {
        console.error('Proxy Image Error:', error);
        return c.text('Internal Image Proxy Error', 500);
    }
});

// Quick test: can workers POST candlestick to quickchart at all?
app.get('/kline-test', async (c) => {
    const testPayload = {
        version: '3',
        backgroundColor: 'white',
        chart: {
            type: 'candlestick',
            data: {
                labels: ['2025-01-01', '2025-01-02', '2025-01-03'],
                datasets: [{
                    label: 'Test',
                    data: [
                        { x: '2025-01-01', o: 100, h: 110, l: 90, c: 105 },
                        { x: '2025-01-02', o: 105, h: 115, l: 95, c: 100 },
                        { x: '2025-01-03', o: 100, h: 120, l: 95, c: 115 }
                    ]
                }]
            }
        },
        width: 400,
        height: 300,
        format: 'png'
    };

    const res = await fetch('https://quickchart.io/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
    });

    const errText = res.ok ? `OK size=${res.headers.get('content-length')}` : await res.text();
    return c.text(`QC Status: ${res.status} - ${errText}`);
});

// Proxy route for K-Line (Daily Candles + MA)
app.get('/kline/:id', async (c) => {
    const symbolWithExt = c.req.param('id');
    const symbol = symbolWithExt.replace('.png', '');
    const env = c.env;
    const name = c.req.query('name') || symbol;

    try {
        // Calculate date range: from exactly 1 year ago to today
        const today = new Date();
        // Taiwan is UTC+8, doing basic string formatting
        const toDateStr = today.toISOString().split('T')[0];
        const fromDate = new Date();
        fromDate.setDate(today.getDate() - 250); // 抓 250 天，保證一整年內的交易日夠算 60MA
        const fromDateStr = fromDate.toISOString().split('T')[0];

        // Fetch historical daily candles (explicitly request asc to simplify logic)
        // AND fetch the current quote to patch today's candle if missing
        const [candlesRes, quoteRes] = await Promise.all([
            fugleService.getHistoricalCandles(symbol, env.FUGLE_API_KEY, fromDateStr, toDateStr, 'asc'),
            fugleService.getIntradayQuote(symbol, env.FUGLE_API_KEY).catch(() => null)
        ]);

        let candles = candlesRes?.data || [];

        // Patch logic: If historical data doesn't have today, add it from quote
        if (quoteRes && quoteRes.date === toDateStr) {
            const lastHistoricalDate = candles.length > 0 ? candles[candles.length - 1].date : null;
            if (lastHistoricalDate !== toDateStr) {
                // Construct a candle from the quote
                const todayCandle = {
                    date: toDateStr,
                    open: quoteRes.openPrice || quoteRes.previousClose,
                    high: quoteRes.highPrice || quoteRes.previousClose,
                    low: quoteRes.lowPrice || quoteRes.previousClose,
                    close: quoteRes.closePrice || quoteRes.lastPrice || quoteRes.previousClose,
                    volume: quoteRes.total?.tradeVolume || 0
                };
                candles.push(todayCandle);
            }
        }

        // Build Payload (string, matching intraday chart pattern)
        const chartPayloadStr = chartService.generateKLineChart(candles, symbol, name);
        if (!chartPayloadStr) {
            return c.text('Not enough data to generate K-Line', 400);
        }

        // DEBUG: return raw payload for inspection
        if (c.req.query('debug') === '1') {
            return c.text(chartPayloadStr);
        }

        // Post to QuickChart
        const response = await fetch('https://quickchart.io/chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: chartPayloadStr
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('QC Error:', errText);
            return c.text(`Quickchart Error: ${errText}`, response.status);
        }

        const headers = new Headers();
        headers.set('Content-Type', 'image/png');
        headers.set('Cache-Control', 'public, max-age=3600'); // Cache K-lines for 1 hour since they update slowly

        return new Response(response.body, { status: 200, headers });
    } catch (error) {
        console.error('K-Line Proxy Error:', error);
        return c.text('Internal K-Line Proxy Error', 500);
    }
});

async function handleEvent(event, c) {
    const env = c.env;
    const reqUrl = c.req.url;
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    const text = event.message.text.trim();
    const channelAccessToken = env.LINE_CHANNEL_ACCESS_TOKEN;

    const isPrivateChat = event.source.type === 'user';
    const isSearchCommand = text.startsWith('/search ');
    const isKlineCommand = text.startsWith('/kline ');

    // Logic: In 1-on-1 chat, everything is a search query unless it's a specific command.
    // In groups, require '/search ' or the specific commands
    const isWatchlistCommand = text.startsWith('/add ') || text === '/list' || text.startsWith('/remove ') || text === '/help';
    if (!isPrivateChat && !isSearchCommand && !isKlineCommand && !isWatchlistCommand) {
        return; // Ignore regular messages in groups/rooms
    }

    const userId = event.source.userId;
    const extDB = env.DB;

    // Handle /help command
    if (text === '/help') {
        const helpMsg = `🤖 股市機器人使用指南\n\n`
            + `👉【查詢走勢】\n`
            + `直接輸入股票代碼或名稱 (例如: 2330 或 台積電)。\n`
            + `包含大盤走勢 (輸入: 大盤 或 加權指數)。\n`
            + `※ 群組內請使用: /search 2330\n\n`
            + `👉【日 K 線圖】\n`
            + `📊 /kline [股票]：查看日 K 線圖 (含 MA 均線)\n\n`
            + `👉【個人追蹤清單】\n`
            + `➕ /add [股票]：加入追蹤清單\n`
            + `➖ /remove [股票]：移除追蹤清單\n`
            + `📋 /list：查看你的專屬清單\n\n`
            + `💡 小提示：大盤1分K支援成交量與即時漲跌色標喔！`;

        // Log /help action
        logSystemAction(c, userId, 'HELP');

        return await replyMessage(event.replyToken, [{
            type: 'text',
            text: helpMsg
        }], channelAccessToken);
    }

    // Handle /list command
    if (text === '/list') {
        const stmt = extDB.prepare('SELECT symbol, name FROM user_watchlists WHERE user_id = ? ORDER BY created_at DESC LIMIT 50');
        const { results } = await stmt.bind(userId).all();

        if (!results || results.length === 0) {
            return await replyMessage(event.replyToken, [{
                type: 'text',
                text: '📝 目前追蹤清單為空。\n請使用「/add 股票代碼或名稱」來新增。'
            }], channelAccessToken);
        }

        // Fetch quotes in parallel
        const quotePromises = results.map(r =>
            fugleService.getIntradayQuote(r.symbol, env.FUGLE_API_KEY).catch(() => null)
        );
        const quotes = await Promise.all(quotePromises);
        const flexContents = [
            // Header Row
            {
                type: 'box',
                layout: 'horizontal',
                paddingAll: '10px',
                spacing: 'md',
                contents: [
                    {
                        type: 'box',
                        layout: 'vertical',
                        flex: 1,
                        contents: [
                            {
                                type: 'text',
                                text: '名稱/代號',
                                weight: 'bold',
                                size: 'xs',
                                color: '#888888'
                            },
                            {
                                type: 'text',
                                text: '成交量',
                                weight: 'bold',
                                size: 'xs',
                                color: '#888888',
                                margin: 'sm'
                            }
                        ]
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        flex: 1,
                        contents: [
                            {
                                type: 'text',
                                text: '現價',
                                weight: 'bold',
                                size: 'xs',
                                color: '#888888',
                                align: 'end'
                            },
                            {
                                type: 'text',
                                text: '差價 (+-%)',
                                weight: 'bold',
                                size: 'xs',
                                color: '#888888',
                                align: 'end',
                                margin: 'sm'
                            }
                        ]
                    }
                ]
            },
            {
                type: 'separator',
                margin: 'sm'
            }
        ];

        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            const quote = quotes[i];

            let priceStr = '--';
            let diffStr = '--';
            let volStr = '-- 張';
            let color = '#777777';
            let arrow = '';

            if (quote) {
                const price = quote.lastPrice || quote.closePrice || quote.referencePrice;
                const change = quote.change || 0;
                const changePct = quote.changePercent || 0;

                priceStr = price.toString();

                // Compute trading volume
                if (quote.total && quote.total.tradeVolume !== undefined) {
                    const vols = quote.total.tradeVolume;
                    if (vols >= 1000) {
                        volStr = (vols / 1000).toFixed(1) + 'k';
                    } else {
                        volStr = vols.toString(); // display raw number if under 1k
                    }
                }

                if (change > 0) {
                    color = '#ff3333'; // Red for up
                    arrow = '▲ ';
                    diffStr = `+${change} (+${changePct}%)`;
                } else if (change < 0) {
                    color = '#33cc33'; // Green for down
                    arrow = '▼ ';
                    diffStr = `${change} (${changePct}%)`;
                } else {
                    color = '#666666'; // Gray for flat
                    diffStr = `0 (0%)`;
                }
            }

            flexContents.push({
                type: 'box',
                layout: 'horizontal',
                paddingAll: '10px',
                spacing: 'md',
                action: {
                    type: 'message',
                    label: '查走勢',
                    text: item.symbol
                },
                contents: [
                    // Left Column (Name & Volume)
                    {
                        type: 'box',
                        layout: 'vertical',
                        flex: 1,
                        contents: [
                            {
                                type: 'text',
                                text: `${item.symbol} ${item.name}`,
                                weight: 'bold',
                                size: 'sm',
                                color: '#333333',
                                wrap: true
                            },
                            {
                                type: 'text',
                                text: volStr,
                                size: 'xs',
                                color: '#666666',
                                margin: 'sm',
                                wrap: true
                            }
                        ]
                    },
                    // Right Column (Price & Diff)
                    {
                        type: 'box',
                        layout: 'vertical',
                        flex: 1,
                        contents: [
                            {
                                type: 'text',
                                text: `${arrow}${priceStr}`,
                                weight: 'bold',
                                size: 'sm',
                                color: color,
                                align: 'end',
                                wrap: true
                            },
                            {
                                type: 'text',
                                text: diffStr,
                                size: 'xs',
                                color: color,
                                align: 'end',
                                margin: 'sm',
                                wrap: true
                            }
                        ]
                    }
                ]
            });

            // Add separator (except last item)
            if (i < results.length - 1) {
                flexContents.push({
                    type: 'separator',
                    margin: 'xs'
                });
            }
        }

        const bubble = {
            type: 'bubble',
            size: 'giga',
            header: {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#f5f5f5',
                contents: [
                    {
                        type: 'text',
                        text: '📋 我的追蹤清單',
                        weight: 'bold',
                        size: 'md'
                    },
                    {
                        type: 'text',
                        text: '點擊任一項目查看即時走勢圖',
                        size: 'xs',
                        color: '#888888',
                        margin: 'sm'
                    }
                ]
            },
            body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: flexContents,
                paddingAll: '0px'
            }
        };

        // Log /list action and API Usage
        logSystemAction(c, userId, 'VIEW_LIST', null, null, 'getIntradayQuote (batch)');

        return await replyMessage(event.replyToken, [{
            type: 'flex',
            altText: '📋 你的專屬追蹤清單',
            contents: bubble
        }], channelAccessToken);
    }

    let queryTerm = text;
    let isAdd = false;
    let isRemove = false;
    let isKline = false;

    if (isSearchCommand) {
        queryTerm = text.replace('/search ', '').trim();
    } else if (isKlineCommand) {
        queryTerm = text.replace('/kline ', '').trim();
        isKline = true;
    } else if (text.startsWith('/add ')) {
        queryTerm = text.replace('/add ', '').trim();
        isAdd = true;
    } else if (text.startsWith('/remove ')) {
        queryTerm = text.replace('/remove ', '').trim();
        isRemove = true;
    } else {
        queryTerm = text.trim();
    }

    if (!queryTerm) {
        return; // Empty queries
    }

    try {
        // 0. Query D1 database to resolve symbol and name
        const extDB = env.DB;
        let realSymbol = queryTerm;
        let realName = queryTerm;

        // Fast-path aliases for common names (e.g. Taiwan Weighted Index)
        if (queryTerm === '大盤' || queryTerm === '加權' || queryTerm === '加權指數') {
            queryTerm = 'IX0001';
            realSymbol = 'IX0001';
        }

        // Try explicit symbol or EXACT name search first
        let stmt = extDB.prepare('SELECT symbol, name FROM tickers WHERE symbol = ? OR name = ? LIMIT 1');
        let match = await stmt.bind(queryTerm, queryTerm).first();

        // Fallback to fuzzy name search if no exact match is found
        if (!match) {
            stmt = extDB.prepare('SELECT symbol, name FROM tickers WHERE name LIKE ? LIMIT 1');
            match = await stmt.bind(`%${queryTerm}%`).first();
        }

        if (match) {
            realSymbol = match.symbol;
            realName = match.name;
        } else {
            // Not found in database
            return await replyMessage(event.replyToken, [{
                type: 'text',
                text: `找不到與「${queryTerm}」相關的股票，請確認名稱或代碼是否正確。`
            }], channelAccessToken);
        }

        const displayName = `${realSymbol} ${realName}`;

        // Handle addition
        if (isAdd) {
            const insertStmt = extDB.prepare('INSERT OR REPLACE INTO user_watchlists (user_id, symbol, name) VALUES (?, ?, ?)');
            await insertStmt.bind(userId, realSymbol, realName).run();

            logSystemAction(c, userId, 'ADD_WATCHLIST', realSymbol, realName);

            return await replyMessage(event.replyToken, [{
                type: 'text',
                text: `✅ 已將 ${displayName} 加入追蹤清單`
            }], channelAccessToken);
        }

        // Handle removal
        if (isRemove) {
            const deleteStmt = extDB.prepare('DELETE FROM user_watchlists WHERE user_id = ? AND symbol = ?');
            await deleteStmt.bind(userId, realSymbol).run();

            logSystemAction(c, userId, 'REMOVE_WATCHLIST', realSymbol, realName);

            return await replyMessage(event.replyToken, [{
                type: 'text',
                text: `🗑️ 已將 ${displayName} 從追蹤清單移除`
            }], channelAccessToken);
        }

        // -- BRANCH FOR KLINE --
        if (isKline) {
            logSystemAction(c, userId, 'KLINE', realSymbol, realName, 'getHistoricalCandles');

            const urlObj = new URL(reqUrl);
            const ts = Date.now();
            const imageUrl = `${urlObj.origin}/webhook/kline/${realSymbol}.png?name=${encodeURIComponent(realName)}&t=${ts}`;

            return await replyMessage(event.replyToken, [{
                type: 'flex',
                altText: `查閱 ${displayName} 日K線圖`,
                contents: {
                    type: 'bubble',
                    size: 'giga',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        paddingAll: '0px',
                        action: {
                            type: 'uri',
                            label: '查看K線圖',
                            uri: imageUrl
                        },
                        contents: [
                            {
                                type: 'image',
                                url: imageUrl,
                                size: 'full',
                                aspectRatio: '1.4:1',
                                aspectMode: 'cover'
                            }
                        ]
                    },
                    footer: {
                        type: 'box',
                        layout: 'horizontal',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                color: '#0369a1',
                                action: {
                                    type: 'message',
                                    label: '◀ 返回盤中走勢',
                                    text: `/search ${realSymbol}`
                                }
                            }
                        ]
                    }
                }
            }], channelAccessToken);
        }

        // -- REGULAR INTRADAY SEARCH --
        // 2. Fetch data from Fugle (timeframe=1 as requested by user)
        const [candlesRes, tickerRes] = await Promise.all([
            fugleService.getIntradayCandles(realSymbol, env.FUGLE_API_KEY, 1),
            fugleService.getIntradayTicker(realSymbol, env.FUGLE_API_KEY).catch(() => null) // Fallback if ticker fails
        ]);

        // Log chart search action
        logSystemAction(c, userId, 'SEARCH', realSymbol, realName, 'getIntradayCandles/Ticker');

        const candles = candlesRes?.data || [];
        const previousClose = tickerRes?.previousClose;

        // 3. Construct proxy URL ensuring it's HTTPS and native .png
        // The image GET handler will do ALL the heavy lifting dynamically! 
        const urlObj = new URL(reqUrl);
        const ts = Date.now();
        const imageUrl = `${urlObj.origin}/webhook/image/${realSymbol}.png?prev=${previousClose || ''}&name=${encodeURIComponent(realName)}&t=${ts}`;

        // 5. Send Image via Reply Message (Avoid Push Quota issues)
        return await replyMessage(event.replyToken, [{
            type: 'flex',
            altText: `查閱 ${displayName} 最新走勢圖`,
            contents: {
                type: 'bubble',
                size: 'giga',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    paddingAll: '0px',
                    action: {
                        type: 'uri',
                        label: '查看走勢圖',
                        uri: imageUrl
                    },
                    contents: [
                        {
                            type: 'image',
                            url: imageUrl,
                            size: 'full',
                            aspectRatio: '1.4:1',
                            aspectMode: 'cover'
                        }
                    ]
                },
                footer: {
                    type: 'box',
                    layout: 'horizontal',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'button',
                            style: 'primary',
                            height: 'sm',
                            color: '#0369a1',
                            action: {
                                type: 'message',
                                label: '📊 查看日 K 線圖',
                                text: `/kline ${realSymbol}`
                            }
                        }
                    ]
                }
            }
        }], channelAccessToken);

    } catch (error) {
        console.error('Error handling search:', error);
        if (event.source.userId) { // Still try to push error if possible
            return await pushMessage(event.source.userId, [{
                type: 'text',
                text: `查詢股票 ${queryTerm} 失敗: ${error.message}`
            }], channelAccessToken);
        }
    }
}

export default app;
