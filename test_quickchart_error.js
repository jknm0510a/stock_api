const fs = require('fs');
const axios = require('axios');

async function test() {
    const chartService = require('./src/services/chartService');
    const mockCandles = [
        { date: '2026-03-04T09:00:00+08:00', close: 1950 },
        { date: '2026-03-04T09:30:00+08:00', close: 1960 },
        { date: '2026-03-04T13:30:00+08:00', close: 1980 }
    ];

    // Override fetch to capture the payload
    const originalFetch = global.fetch;
    let payloadStr = "";
    global.fetch = async (url, options) => {
        payloadStr = options.body;
        return {
            ok: true,
            json: async () => ({ url: "mock", success: true })
        };
    };

    await chartService.generateTrendChartUrl('2330', '台積電', mockCandles, 1880);

    console.log("Captured payload length:", payloadStr.length);

    try {
        const res = await axios.post('https://quickchart.io/chart', payloadStr, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'text', // so we can read JSON errors if they exist
            validateStatus: () => true
        });

        if (typeof res.data === 'string' && res.data.startsWith('{')) {
            console.error("❌ QuickChart Error:", JSON.parse(res.data));
        } else {
            console.log("✅ QuickChart Success! Response length:", res.data.length);
            // write it
            fs.writeFileSync('test_error_chart.png', res.data);
            console.log("Wrote test_error_chart.png");
        }
    } catch (err) {
        console.error("Axios error:", err.message);
    }
}
test();
