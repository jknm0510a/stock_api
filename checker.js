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

    const https = require('https');
    const data = JSON.stringify(payload);

    const options = {
        hostname: 'quickchart.io',
        port: 443,
        path: '/chart',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const req = https.request(options, res => {
        console.log('StatusCode:', res.statusCode);
        console.log('X-QuickChart-Error:', res.headers['x-quickchart-error']);
    });
    req.write(data);
    req.end();

} catch (e) {
    console.error(e);
}
