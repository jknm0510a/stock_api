import { Hono } from 'hono';
import { logger } from 'hono/logger';

// Import route handlers
import stockRoutes from './routes/stockRoutes';
import lineBotRoutes from './routes/lineBotRoutes';

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
    fetch: app.fetch
};
