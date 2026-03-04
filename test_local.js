const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const axios = require('axios');

const SYMBOL = '2330';
const API_KEY = process.env.FUGLE_API_KEY;

async function testFetchAndDraw() {
    try {
        if (!API_KEY) {
            throw new Error("FUGLE_API_KEY environment variable is missing in .env layer");
        }

        console.log(`開始測試抓取 ${SYMBOL} 盤中資料...`);
        const url = `https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/${SYMBOL}`;
        const response = await axios.get(url, { headers: { 'X-API-KEY': API_KEY }, params: { timeframe: 3 } });

        let candles = response.data.data;
        const tickerResponse = await axios.get(`https://api.fugle.tw/marketdata/v1.0/stock/intraday/ticker/${SYMBOL}`, { headers: { 'X-API-KEY': API_KEY } });
        let previousClose = tickerResponse.data.previousClose;

        if (!candles || candles.length === 0) {
            console.log("⚠️ No live data found (out of hours), using mock data...");
            candles = [
                { date: new Date().toISOString().split('T')[0] + 'T09:00:00+08:00', close: 1950 },
                { date: new Date().toISOString().split('T')[0] + 'T09:30:00+08:00', close: 1960 },
                { date: new Date().toISOString().split('T')[0] + 'T13:30:00+08:00', close: 1980 },
            ];
            previousClose = 1880;
        }

        const chartService = require('./src/services/chartService');
        const urlId = await chartService.generateTrendChartUrl(SYMBOL, "台積電", candles, previousClose);
        console.log(`\nURL: https://quickchart.io/chart/render/${urlId}\n`);
    } catch (error) {
        console.error('❌', error instanceof Error ? error.message : String(error));
        if (error.response) console.error("API response:", error.response.status, error.response.data);
    }
}
testFetchAndDraw();
