/**
 * ChartService specifically modified for Cloudflare Workers
 * Because native chart generation (canvas) is unavailable, we use QuickChart API
 * to generate a chart URL that we can serve instantly.
 */

// If you have `moment` installed, it might be large. For Edge, manual UTC+8 parsing is preferred or a lightweight alternatave.
// We'll write a lightweight formatter to avoid dependencies.
function formatTimeUTC8(isoString) {
    const d = new Date(isoString);
    // Add 8 hours for UTC+8 (Fugle data is already in correct TZ if not Z, but let's be safe)
    // Assuming Fugle date looks like "2023-10-25T09:00:00+08:00"
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

class ChartService {

    /**
     * Generates a QuickChart URL for the trend chart
     * @param {string} symbol - Stock symbol
     * @param {Array} candles - Array of candle data objects from Fugle API
     * @returns {Promise<string>} - QuickChart Image Short URL
     */
    async generateTrendChartUrl(symbol, candles) {
        if (!candles || candles.length === 0) {
            throw new Error('No candle data available to generate chart');
        }

        // Sort ascending by time
        let sortedCandles = [...candles].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // QuickChart free tier has a limit of around 200-266 data points per chart
        // If we have more than 200 points, we downsample by taking every Nth candle
        if (sortedCandles.length > 200) {
            const step = Math.ceil(sortedCandles.length / 200);
            sortedCandles = sortedCandles.filter((_, index) => index % step === 0 || index === sortedCandles.length - 1);
        }

        const labels = sortedCandles.map(c => formatTimeUTC8(c.date));
        const data = sortedCandles.map(c => c.close);

        const minPrice = Math.min(...data);
        const maxPrice = Math.max(...data);
        const padding = (maxPrice - minPrice) * 0.1 || 1;

        // QuickChart Configuration Object (Standard Chart.js v2/v3 syntax supported by QuickChart)
        const chartConfig = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${symbol} Intraday Trend`,
                    data: data,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: { display: true, labelString: 'Time (UTC+8)' },
                        ticks: { maxTicksLimit: 10 }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: { display: true, labelString: 'Price' },
                        ticks: {
                            min: Math.max(0, minPrice - padding),
                            max: maxPrice + padding
                        }
                    }]
                },
                legend: { display: true, position: 'top' }
            }
        };

        try {
            const response = await fetch('https://quickchart.io/chart/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chart: chartConfig,
                    width: 800,
                    height: 400,
                    format: 'png'
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`QuickChart API Error: ${response.status} ${text}`);
            }

            const responseJson = await response.json();
            if (!responseJson.success) {
                throw new Error('QuickChart failed to generate short URL');
            }

            // QuickChart's url looks like: https://quickchart.io/chart/render/zf-xxx 
            // We return just the ID so our own proxy can serve it with a clean .png extension
            return responseJson.url.split('/').pop();
        } catch (error) {
            console.error('Error generating short URL with QuickChart:', error);
            throw error;
        }
    }
}

export default new ChartService();
