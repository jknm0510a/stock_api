import { Hono } from 'hono';
import { logger } from 'hono/logger';

// Import route handlers
import stockRoutes from './routes/stockRoutes';
import lineBotRoutes from './routes/lineBotRoutes';
import fugleService from './services/fugleService';

const app = new Hono();

app.use('*', logger());

// General Error Handler
app.onError((err, c) => {
    console.error(`${err}`);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

// Mount routes
app.route('/api/stock', stockRoutes);
app.route('/webhook', lineBotRoutes);

app.get('/', (c) => c.text('Stock API is running on Cloudflare Workers!'));

// Export for Cloudflare Workers
export default {
    fetch: app.fetch,

    // Cron Trigger Handler
    async scheduled(event, env, ctx) {
        console.log(`Cron trigger fired at ${new Date().toISOString()}`);

        // Use ctx.waitUntil to allow the async task to finish after returning
        ctx.waitUntil((async () => {
            try {
                const tickers = await fugleService.getGlobalTickers(env.FUGLE_API_KEY);
                console.log(`Fetched ${tickers.length} tickers from Fugle.`);

                if (tickers.length === 0) {
                    console.warn('No tickers returned from Fugle, aborting DB sync.');
                    return;
                }

                // Cloudflare D1 doesn't support massive single-statement inserts (like 20k rows) due to size limits.
                // It's best to process them in batches. D1 recommends batching statements.

                // Prepare the statement
                const stmt = env.DB.prepare(
                    `INSERT OR REPLACE INTO tickers (symbol, name, type) VALUES (?, ?, ?)`
                );

                // Batch size of 100 statements per D1 API call
                const BATCH_SIZE = 100;
                let processed = 0;

                for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
                    const chunk = tickers.slice(i, i + BATCH_SIZE);
                    const batchStatements = chunk.map(t =>
                        stmt.bind(t.symbol, t.name, t.type)
                    );

                    await env.DB.batch(batchStatements);
                    processed += chunk.length;
                    console.log(`Processed ${processed}/${tickers.length} tickers...`);
                }

                console.log('Database sync complete!');
            } catch (error) {
                console.error('Error during scheduled ticker sync:', error);
            }
        })());
    }
};
