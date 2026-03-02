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
     * @returns {string} - QuickChart Image URL
     */
    generateTrendChartUrl(symbol, candles) {
        if (!candles || candles.length === 0) {
            throw new Error('No candle data available to generate chart');
        }

        // Sort ascending by time
        const sortedCandles = [...candles].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

        // Serialize and URL encode for QuickChart
        const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
        return `https://quickchart.io/chart?w=800&h=400&c=${encodedConfig}`;
    }
}

export default new ChartService();
