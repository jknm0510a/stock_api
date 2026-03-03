import { Hono } from 'hono';
import fugleService from '../services/fugleService';

const app = new Hono();

/**
 * @route GET /api/stock/sync-now
 * @desc Manually trigger the global ticker sync and DB update (for testing).
 */
app.get('/sync-now', async (c) => {
    try {
        const apiKey = c.env.FUGLE_API_KEY;
        const tickers = await fugleService.getGlobalTickers(apiKey);

        if (tickers.length === 0) {
            return c.json({ success: false, message: 'No tickers fetched from Fugle' }, 500);
        }

        const stmt = c.env.DB.prepare(
            `INSERT OR REPLACE INTO tickers (symbol, name, type) VALUES (?, ?, ?)`
        );

        const BATCH_SIZE = 100;
        let processed = 0;

        for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
            const chunk = tickers.slice(i, i + BATCH_SIZE);
            const batchStatements = chunk.map(t =>
                stmt.bind(t.symbol, t.name, t.type)
            );

            await c.env.DB.batch(batchStatements);
            processed += chunk.length;
        }

        return c.json({ success: true, message: `Synced ${processed} tickers to D1 database.` });
    } catch (error) {
        console.error('Error during manual sync:', error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

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

        const [candlesRes, tickerRes] = await Promise.all([
            fugleService.getIntradayCandles(symbol, apiKey, timeframe),
            fugleService.getIntradayTicker(symbol, apiKey).catch(() => null)
        ]);

        return c.json({
            success: true,
            symbol,
            previousClose: tickerRes?.previousClose || null,
            data: candlesRes.data || []
        });
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
