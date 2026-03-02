require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.FUGLE_API_KEY;
const SYMBOL = '2330'; // 台積電

async function testLocal() {
    console.log(`開始測試抓取 ${SYMBOL} 盤中資料...`);

    if (!API_KEY) {
        console.error('⚠️ 請先在 .env 檔案中設定 FUGLE_API_KEY');
        return;
    }

    try {
        const url = `https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/${SYMBOL}`;
        console.log(`\n測試 API URL: ${url}`);
        console.log('使用 timeframe: 3');

        const response = await axios.get(url, {
            headers: { 'X-API-KEY': API_KEY },
            params: { timeframe: 3 }
        });

        const candles = response.data.data;

        if (!candles || candles.length === 0) {
            console.log('目前沒有今天的盤中 K 線資料 (可能還未開盤或週末)。');
            return;
        }

        console.log(`✅ 成功抓取到 ${candles.length} 筆 K 線資料！`);
        console.log('\n最新一筆資料範例:');
        console.dir(candles[candles.length - 1], { depth: null, colors: true });

        // 測試繪圖 (選用)
        try {
            console.log('\n測試繪製趨勢圖...');
            const chartService = require('./src/services/chartService');
            const buffer = await chartService.generateTrendChart(SYMBOL, candles);

            const outputPath = path.join(__dirname, `test_${SYMBOL}_chart.png`);
            fs.writeFileSync(outputPath, buffer);
            console.log(`✅ 成功產生測試圖片，已存至: ${outputPath}`);
            console.log('您可以直接在 Finder 打開該圖片確認。');

        } catch (chartErr) {
            console.error('❌ 繪圖測試失敗:', chartErr.message);
        }

    } catch (error) {
        console.error('❌ API 請求失敗!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testLocal();
