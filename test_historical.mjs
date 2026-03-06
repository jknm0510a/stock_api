import fugleService from './src/services/fugleService.js';
import dotenv from 'dotenv';
dotenv.config();

// FugleService uses fetch which is global in Node 18+
// But let's check if the service needs a polyfill if running in older node.
// However, the error was about ESM. 

const test = async () => {
    const symbol = '0050';
    const from = '2026-01-01';
    const to = '2026-01-10';
    const apiKey = process.env.FUGLE_API_KEY;

    console.log(`Testing /historical/candles/ for ${symbol} from ${from} to ${to}...`);

    try {
        const data = await fugleService.getHistoricalCandles(symbol, apiKey, from, to);
        console.log('Success!');
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Failed to fetch historical candles:');
        console.error(error.message);
    }
};

test();
