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

// Proxy route for serving images directly with a clean .png extension
app.get('/image/:id', async (c) => {
    const idWithExt = c.req.param('id');
    const id = idWithExt.replace('.png', '');
    const quickChartUrl = `https://quickchart.io/chart/render/${id}`;

    const response = await fetch(quickChartUrl);
    if (!response.ok) {
        return c.text('Image not found', 404);
    }

    const headers = new Headers();
    headers.set('Content-Type', 'image/png');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(response.body, { status: 200, headers });
});

async function handleEvent(event, c) {
    const env = c.env;
    const reqUrl = c.req.url;
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    const text = event.message.text.trim();
    const channelAccessToken = env.LINE_CHANNEL_ACCESS_TOKEN;

    // Handle /search {symbol}
    if (text.startsWith('/search ')) {
        const symbol = text.replace('/search ', '').trim();

        try {
            // 1. Acknowledge user first using the reply token
            await replyMessage(event.replyToken, [{
                type: 'text',
                text: `查詢 ${symbol} 盤中資訊中，請稍候...`
            }], channelAccessToken);

            // 2. Fetch data from Fugle (timeframe=3 as requested by user)
            const [candlesRes, tickerRes] = await Promise.all([
                fugleService.getIntradayCandles(symbol, env.FUGLE_API_KEY, 3),
                fugleService.getIntradayTicker(symbol, env.FUGLE_API_KEY).catch(() => null) // Fallback if ticker fails
            ]);

            const candles = candlesRes.data || [];
            const previousClose = tickerRes?.previousClose;

            if (candles.length === 0) {
                // Send via push since replyToken is already used
                return await pushMessage(event.source.userId, [{
                    type: 'text',
                    text: `查無 ${symbol} 的當日交易紀錄`
                }], channelAccessToken);
            }

            // 3. Generate Chart URL (QuickChart)
            const imageId = await chartService.generateTrendChartUrl(symbol, candles, previousClose);

            // 4. Construct proxy URL ensuring it's HTTPS and native .png
            const urlObj = new URL(reqUrl);
            const imageUrl = `${urlObj.origin}/webhook/image/${imageId}.png`;

            // 5. Send Image via Push Message
            return await pushMessage(event.source.userId, [{
                type: 'image',
                originalContentUrl: imageUrl,
                previewImageUrl: imageUrl
            }], channelAccessToken);

        } catch (error) {
            console.error('Error handling search:', error);
            if (event.source.userId) {
                return await pushMessage(event.source.userId, [{
                    type: 'text',
                    text: `查詢股票 ${symbol} 失敗: ${error.message}`
                }], channelAccessToken);
            }
        }
    }
}

export default app;
