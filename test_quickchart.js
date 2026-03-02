const fetch = require('node-fetch'); // we'll use dynamic fetch in node 18+
async function test() {
    const config = {
        type: 'line',
        data: { labels: ['A', 'B'], datasets: [{ data: [1, 2] }] }
    };
    try {
        const res = await fetch('https://quickchart.io/chart/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chart: config, format: 'png' })
        });
        const json = await res.json();
        console.log("Response:", json);
    } catch (e) { console.error(e); }
}
test();
