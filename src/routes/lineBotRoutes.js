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
    return fetch('https://api.line.me/v2/bot/message/reply', {
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
}

async function pushMessage(to, messages, channelAccessToken) {
    return fetch('https://api.line.me/v2/bot/message/push', {
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
    c.executionCtx.waitUntil(Promise.all(events.map(event => handleEvent(event, c.env))));

    return c.json({ success: true });
});

async function handleEvent(event, env) {
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

            // 2. Fetch data from Fugle
            const response = await fugleService.getIntradayCandles(symbol, env.FUGLE_API_KEY, 1);
            const candles = response.data || [];

            if (candles.length === 0) {
                // Send via push since replyToken is already used
                return await pushMessage(event.source.userId, [{
                    type: 'text',
                    text: `查無 ${symbol} 的當日交易紀錄`
                }], channelAccessToken);
            }

            // 3. Generate Chart URL (QuickChart)
            const imageUrl = chartService.generateTrendChartUrl(symbol, candles);

            // 4. Send Image via Push Message
            return await pushMessage(event.source.userId, [{
                type: 'image',
                originalContentUrl: imageUrl,
                previewImageUrl: imageUrl // QuickChart generates fast enough that preview == original
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
