const axios = require('axios');
const fs = require('fs');

async function test() {
    const chart = {
        type: 'line',
        data: {
            labels: [1, 2, 3],
            datasets: [{ data: [1, 2, 3] }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: ['Line 1 (Black)', 'Line 2 (Red)'],
                    color: ['#000000', '#FF0000'],
                    font: { size: 30 }
                }
            }
        }
    };
    
    try {
        const res = await axios.post('https://quickchart.io/chart', {
            version: '3',
            chart: chart,
            format: 'png'
        }, { responseType: 'arraybuffer' });
        
        fs.writeFileSync('test_v3_title.png', res.data);
        console.log("Wrote test_v3_title.png. Size:", res.data.length);
    } catch(err) {
        console.error("Failed:", err.message);
    }
}
test();
