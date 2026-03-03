/**
 * ChartService specifically modified for Cloudflare Workers
 * Because native chart generation (canvas) is unavailable, we use QuickChart API
 * to generate a chart URL that we can serve instantly.
 */

// If you have `moment` installed, it might be large. For Edge, manual UTC+8 parsing is preferred or a lightweight alternatave.
// We'll write a lightweight formatter to avoid dependencies.
function formatTimeUTC8(isoString) {
    const d = new Date(isoString);
    // Explicitly grab UTC hours, add 8 for Taiwan timezone, and wrap with %24
    const twHours = ((d.getUTCHours() + 8) % 24).toString().padStart(2, '0');
    const twMins = d.getUTCMinutes().toString().padStart(2, '0');
    return `${twHours}:${twMins}`;
}

class ChartService {

    /**
     * Generates a QuickChart URL for the trend chart
     * @param {string} symbol - Stock symbol
     * @param {Array} candles - Array of candle data objects from Fugle API
     * @param {number} previousClose - Yesterday's closing price
     * @returns {Promise<string>} - QuickChart Image Short URL
     */
    async generateTrendChartUrl(symbol, candles, previousClose) {
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

        // Keep track of valid data to compute symmetric Y scale correctly (excluding padding)
        const validDataValues = [...data];

        // Pad the timeline so the X axis is fixed from 09:00 to 13:30
        const dateStr = sortedCandles[0].date.substring(0, 10);
        const endTimeStr = `${dateStr}T13:30:00+08:00`;
        const endMs = new Date(endTimeStr).getTime();

        let intervalMs = 3 * 60 * 1000;
        if (sortedCandles.length > 1) {
            let diff = new Date(sortedCandles[1].date).getTime() - new Date(sortedCandles[0].date).getTime();
            if (diff > 0 && diff <= 60 * 60 * 1000) {
                intervalMs = diff;
            }
        }

        let lastCandleMs = new Date(sortedCandles[sortedCandles.length - 1].date).getTime();

        // Only pad if intervalMs is valid, and keeping labels length under 200 for QuickChart limits
        if (intervalMs >= 60000 && labels.length < 200) {
            while (lastCandleMs + intervalMs <= endMs && labels.length < 200) {
                lastCandleMs += intervalMs;
                labels.push(formatTimeUTC8(new Date(lastCandleMs).toISOString()));
                data.push(null);
            }
            if (labels[labels.length - 1] !== '13:30' && labels.length < 200) {
                labels.push('13:30');
                data.push(null);
            }
            if (labels[0] !== '09:00') {
                labels.unshift('09:00');
                data.unshift(null);
            }
        }

        let yAxisMin, yAxisMax;
        if (previousClose) {
            const minPrice = Math.min(...validDataValues, previousClose);
            const maxPrice = Math.max(...validDataValues, previousClose);
            // Calculate largest deviation from previousClose to ensure symmetry
            const maxDiff = Math.max(Math.abs(maxPrice - previousClose), Math.abs(previousClose - minPrice));
            // Add a 10% vertical padding so the top/bottom series aren't cut off
            const padding = maxDiff * 0.1 || 1;

            yAxisMin = Math.max(0, previousClose - maxDiff - padding);
            yAxisMax = previousClose + maxDiff + padding;
        } else {
            const minPrice = Math.min(...validDataValues);
            const maxPrice = Math.max(...validDataValues);
            const padding = (maxPrice - minPrice) * 0.1 || 1;

            yAxisMin = Math.max(0, minPrice - padding);
            yAxisMax = maxPrice + padding;
        }

        // QuickChart Configuration Object (Standard Chart.js v2/v3 syntax supported by QuickChart)
        const chartConfig = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${symbol} Intraday Trend`,
                    data: data,
                    // Use a function string evaluated by QuickChart to color points dynamically
                    borderColor: previousClose
                        ? function (context) {
                            var value = context.dataset.data[context.dataIndex];
                            return value >= __PREV_CLOSE__ ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)';
                        }
                        : 'rgb(255, 99, 132)',
                    // We disable the fill so the point colors stand out, or use a neutral background
                    fill: false,
                    spanGaps: true,
                    borderWidth: 2,
                    pointRadius: 1, // Show tiny points to let individual colors render
                    segment: {
                        borderColor: previousClose
                            ? function (context) {
                                var p0 = context.p0.parsed.y;
                                var p1 = context.p1.parsed.y;
                                if (p0 >= __PREV_CLOSE__ && p1 >= __PREV_CLOSE__) return 'rgb(255, 99, 132)';
                                if (p0 < __PREV_CLOSE__ && p1 < __PREV_CLOSE__) return 'rgb(75, 192, 192)';
                                return 'rgb(200, 200, 200)';
                            }
                            : undefined
                    },
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
                            min: yAxisMin,
                            max: yAxisMax
                        }
                    }]
                },
                legend: { display: true, position: 'top' },
                annotation: previousClose ? {
                    annotations: [{
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: previousClose,
                        borderColor: 'rgba(0,0,0,0.5)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            enabled: true,
                            content: `昨收 ${previousClose}`,
                            position: 'right',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white'
                        }
                    }]
                } : undefined
            }
        };

        // Custom stringifier to preserve functions
        const serializeConfig = (obj) => {
            const str = JSON.stringify(obj, function (key, val) {
                if (typeof val === 'function') {
                    return val.toString();
                }
                return val;
            });
            // Unquote the functions and replace our placeholder marker
            return str
                .replace(/"(function.*?})"/g, (match, p1) => {
                    return p1.replace(/\\n/g, '').replace(/\\"/g, '"');
                })
                .replace(/__PREV_CLOSE__/g, previousClose || 0);
        };

        const chartConfigStr = serializeConfig(chartConfig);

        try {
            const response = await fetch('https://quickchart.io/chart/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chart: chartConfigStr,
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
