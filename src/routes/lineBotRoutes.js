import { Hono } from 'hono';
import fugleService from '../services/fugleService';
import chartService from '../services/chartService';

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

    // Logic: In 1-on-1 chat, everything is a search query. In groups, require '/search '
    if (!isPrivateChat && !isSearchCommand) {
        return; // Ignore regular messages in groups/rooms
    }

    let queryTerm = text;
    if (isSearchCommand) {
        queryTerm = text.replace('/search ', '').trim();
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

        // 1. Acknowledge user first using the reply token
        const displayName = `${realSymbol} ${realName}`;
        await replyMessage(event.replyToken, [{
            type: 'text',
            text: `查詢 ${displayName} 盤中資訊中，請稍候...`
        }], channelAccessToken);

        // 2. Fetch data from Fugle (timeframe=3 as requested by user)
        const [candlesRes, tickerRes] = await Promise.all([
            fugleService.getIntradayCandles(realSymbol, env.FUGLE_API_KEY, 3),
            fugleService.getIntradayTicker(realSymbol, env.FUGLE_API_KEY).catch(() => null) // Fallback if ticker fails
        ]);

        const candles = candlesRes?.data || [];
        const previousClose = tickerRes?.previousClose;

        if (candles.length === 0) {
            // Send via push since replyToken is already used
            return await pushMessage(event.source.userId, [{
                type: 'text',
                text: `查無 ${displayName} 的當日交易紀錄`
            }], channelAccessToken);
        }

        // 3. Construct proxy URL ensuring it's HTTPS and native .png
        // The image GET handler will do ALL the heavy lifting dynamically! 
        const urlObj = new URL(reqUrl);
        const ts = Date.now();
        const imageUrl = `${urlObj.origin}/webhook/image/${realSymbol}.png?prev=${previousClose || ''}&name=${encodeURIComponent(realName)}&t=${ts}`;

        // 5. Send Image via Push Message (using Flex Message)
        const yahooFinanceUrl = `https://tw.stock.yahoo.com/quote/${realSymbol}`;
        return await pushMessage(event.source.userId, [{
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
                        label: '開啟 Yahoo 股市',
                        uri: yahooFinanceUrl
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
