const fs = require('fs');
const path = require('path');
const chartService = require('./src/services/chartService.js');

const candles = [
    { date: '2023-10-27T01:00:00.000Z', open: 100, high: 105, low: 95, close: 102, volume: 1000 },
    { date: '2023-10-27T01:03:00.000Z', open: 102, high: 106, low: 101, close: 105, volume: 1200 }
];

try {
    const payloadStr = chartService.generateTrendChartPayload('2330', '台積電', candles, 100);
    const payload = JSON.parse(payloadStr);
    const dataStr = JSON.stringify(payload);

    console.log("Data length:", dataStr.length);
    console.log("Surrounding pos 4028:");
    console.log(dataStr.substring(4028 - 30, 4028 + 30));
    console.log("Char at 4028:", dataStr[4028]);
    console.log("Char at 4087:", dataStr[4087]);

} catch (e) {
    console.error(e);
}
