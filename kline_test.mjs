import fs from 'fs';
import chartService from './src/services/chartService.js';
import fugleService from './src/services/fugleService.js';

// Load testing env
import { config } from 'dotenv';
config({ path: '.dev.vars' });

async function testKline() {
    const symbol = '2330';
    const apiKey = process.env.FUGLE_API_KEY;

    try {
        const today = new Date();
        const toDateStr = today.toISOString().split('T')[0];
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);
        const fromDateStr = lastYear.toISOString().split('T')[0];

        // 1. Fetch data
        console.log(`Fetching ${symbol} from ${fromDateStr} to ${toDateStr}...`);
        const res = await fugleService.getHistoricalCandles(symbol, apiKey, fromDateStr, toDateStr);
        const candles = res?.data || [];
        console.log(`Got ${candles.length} days of data`);

        // 2. Generate Payload
        const payloadStr = chartService.generateKLineChart(candles, symbol, 'TSMC');
        fs.writeFileSync('kline_payload.json', payloadStr);
        console.log('Payload written to kline_payload.json for inspection');

        // 3. Test POST to QuickChart
        console.log('Posting to QuickChart...');
        const qcRes = await fetch('https://quickchart.io/chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payloadStr
        });

        if (!qcRes.ok) {
            const err = await qcRes.text();
            console.error('QuickChart Error:', qcRes.status, err);
        } else {
            const buffer = await qcRes.arrayBuffer();
            fs.writeFileSync('test_kline.png', Buffer.from(buffer));
            console.log('Saved image to test_kline.png');
        }

    } catch (e) {
        console.error('Test failed:', e);
    }
}

testKline();
