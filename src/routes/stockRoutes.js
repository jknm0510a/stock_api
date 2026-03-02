import { Hono } from 'hono';
import fugleService from '../services/fugleService';

const app = new Hono();

/**
 * @route GET /api/stock/:symbol/candles
 * @desc Get intraday 1-min candles for a specific stock
 */
app.get('/:symbol/candles', async (c) => {
    try {
        const symbol = c.req.param('symbol');
        const timeframe = c.req.query('timeframe') || 3;

        // In Cloudflare Workers, environment variables are in `c.env`
        const apiKey = c.env.FUGLE_API_KEY;

        const data = await fugleService.getIntradayCandles(symbol, apiKey, timeframe);
        return c.json({ success: true, symbol, data: data.data || [] });
    } catch (error) {
        console.error(`Error in /api/stock/${c.req.param('symbol')}/candles:`, error.message);
        return c.json({
            success: false,
            message: 'Failed to fetch stock data',
            error: error.message
        }, 500);
    }
});

export default app;
