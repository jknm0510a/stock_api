import fugleService from './src/services/fugleService.js';
import { config } from 'dotenv';
config({ path: '.dev.vars' });

async function checkData() {
    const symbol = '2330';
    const apiKey = process.env.FUGLE_API_KEY;
    const today = new Date();
    const toDateStr = today.toISOString().split('T')[0];
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 7);
    const fromDateStr = fromDate.toISOString().split('T')[0];

    try {
        console.log(`Checking 2330 from ${fromDateStr} to ${toDateStr}...`);
        const res = await fugleService.getHistoricalCandles(symbol, apiKey, fromDateStr, toDateStr);
        const candles = res?.data || [];
        console.log('Last 3 candles:');
        console.log(JSON.stringify(candles.slice(-3), null, 2));
    } catch (e) {
        console.error(e);
    }
}

checkData();
