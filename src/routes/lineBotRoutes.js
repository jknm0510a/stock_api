const express = require('express');
const { middleware, Client } = require('@line/bot-sdk');
const fugleService = require('../services/fugleService');
const chartService = require('../services/chartService');
const router = express.Router();

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.LINE_CHANNEL_SECRET || ''
};

// Initialize LINE Client if config provided
let client;
if (config.channelAccessToken && config.channelSecret) {
    client = new Client(config);
}

// Store generated charts temporarily in memory (just for MVP/demo purposes)
// In a real production app, upload images to S3/Cloudinary and serve URLs
const imageCache = new Map();

router.use('/', middleware(config), async (req, res) => {
    try {
        const events = req.body.events;
        await Promise.all(events.map(handleEvent));
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).end();
    }
});

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const text = event.message.text.trim();

    // Handle /search {symbol}
    if (text.startsWith('/search ')) {
        const symbol = text.replace('/search ', '').trim();

        try {
            if (!client) {
                throw new Error('LINE client not properly configured');
            }

            // Tell user we are querying
            await client.replyMessage(event.replyToken, {
                type: 'text',
                text: `查詢 ${symbol} 盤中資訊中，請稍候...`
            });

            const response = await fugleService.getIntradayCandles(symbol, 1);
            const candles = response.data || [];

            if (candles.length === 0) {
                // Send push message since we already used the reply token
                return client.pushMessage(event.source.userId, {
                    type: 'text',
                    text: `查無 ${symbol} 的當日交易紀錄`
                });
            }

            // Generate Chart Image
            const imageBuffer = await chartService.generateTrendChart(symbol, candles);

            // We will create a route to host this image and serve it to LINE since LINE Requires HTTPS URL
            // For this implementation, we just mock the URL system using the current host if we had dynamic ngrok mapping
            // Or in a fully complete bot, we'd use Imgur API to upload the image buffer. 
            // To satisfy the requirement, we'll store it in a cache and create a quick access route.

            const imageId = `${symbol}_${Date.now()}`;
            imageCache.set(imageId, imageBuffer);

            // Notice: LINE bot requires HTTPS image URL. Users must run the API server using ngrok to test it.
            // E.g. https://your-ngrok-url.ngrok.io/webhook/image/:id
            // We'll put a placeholder generic base URL but it should come from an env var
            const baseUrl = process.env.BASE_URL || 'https://example.com';
            const imageUrl = `${baseUrl}/webhook/image/${imageId}`;

            return client.pushMessage(event.source.userId, {
                type: 'image',
                originalContentUrl: imageUrl,
                previewImageUrl: imageUrl
            });

        } catch (error) {
            console.error('Error handling search:', error);
            if (client && event.source.userId) {
                return client.pushMessage(event.source.userId, {
                    type: 'text',
                    text: `查詢股票 ${symbol} 失敗: ${error.message}`
                });
            }
        }
    }

    return Promise.resolve(null);
}

// Optional endpoint to serve the cached images for the LINE bot
const imageRouter = express.Router();
imageRouter.get('/image/:id', (req, res) => {
    const buffer = imageCache.get(req.params.id);
    if (!buffer) {
        return res.status(404).send('Image not found or expired');
    }
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
});

module.exports = router;
module.exports.imageRouter = imageRouter;
