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
     * @param {string} symbol - Equity symbol
     * @param {string} name - Display name
     * @param {Array} candles - Fugle Intraday Candles
     * @param {number|null} previousClose - The previous day's closing price
     * @returns {string} - The JSON string payload for QuickChart natively
     */
    generateTrendChartPayload(symbol, name, candles, previousClose) {
        if (!candles || candles.length === 0) {
            throw new Error('No candle data available to generate chart');
        }

        // Sort ascending by time
        let sortedCandles = [...candles].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (!sortedCandles || sortedCandles.length === 0) {
            throw new Error('No valid candle data available after processing');
        }

        // QuickChart free tier has a limit of around 300-400 data points per chart
        // If we have more than 400 points, we downsample by taking every Nth candle
        if (sortedCandles.length > 400) {
            const step = Math.ceil(sortedCandles.length / 400);
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

        // Only pad if intervalMs is valid, and keeping labels length under 400 for QuickChart limits
        if (intervalMs >= 60000 && labels.length < 400) {
            while (lastCandleMs + intervalMs <= endMs && labels.length < 400) {
                lastCandleMs += intervalMs;
                labels.push(formatTimeUTC8(new Date(lastCandleMs).toISOString()));
                data.push(null);
            }
            if (labels[labels.length - 1] !== '13:30' && labels.length < 400) {
                labels.push('13:30');
                data.push(null);
            }
            if (labels[0] !== '09:00') {
                labels.unshift('09:00');
                data.unshift(null);
            }
        }

        let yAxisMin, yAxisMax, yAxisStepSize;
        let lineHigh = null, lineLow = null;

        if (validDataValues.length > 0) {
            lineLow = Math.min(...validDataValues);
            lineHigh = Math.max(...validDataValues);
        }

        if (previousClose && validDataValues.length > 0) {
            // 1. 如果目前折線最高價低於昨日收盤則以昨日收盤為頂，否則以折線最高價為頂
            const topPrice = Math.max(lineHigh, previousClose);
            // 2. 如果目前折線最低價高於昨日收盤則已昨日收盤為底，否則已折線最低價為底
            const bottomPrice = Math.min(lineLow, previousClose);

            // 3. 刻度顯示從頂部價格到底部價格五等分
            let diff = topPrice - bottomPrice;
            if (diff === 0) diff = previousClose * 0.01; // fallback

            yAxisStepSize = diff / 5;

            // 4. 上面刻度決定好後頂底各多加一分刻度當作緩衝
            yAxisMax = topPrice + yAxisStepSize;
            yAxisMin = Math.max(0, bottomPrice - yAxisStepSize);
        } else if (validDataValues.length > 0) {
            // Fallback if no previousClose
            let diff = lineHigh - lineLow;
            if (diff === 0) diff = lineLow * 0.02 || 2;

            yAxisStepSize = diff / 5;
            yAxisMax = lineHigh + yAxisStepSize;
            yAxisMin = Math.max(0, lineLow - yAxisStepSize);
        } else {
            yAxisMin = 0; yAxisMax = 100; yAxisStepSize = 20;
        }

        const currentPrice = validDataValues.length > 0 ? validDataValues[validDataValues.length - 1] : null;

        // Annotations Array
        const annotationsArray = [];

        if (previousClose) {
            // 6. 刻度顯示昨日收盤價(文字顏色區分)並在折線圖中貫穿一條橫向虛線表示
            annotationsArray.push({
                type: 'line',
                yMin: previousClose,
                yMax: previousClose,
                borderColor: 'rgba(0,0,0,0.5)',
                borderWidth: 2,
                borderDash: [5, 5]
            });
            annotationsArray.push({
                type: 'label',
                xValue: '09:00', // Anchor to the exact start of the chart
                yValue: previousClose,
                content: `昨收 ${previousClose}`,
                display: true,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                font: { size: 36, weight: 'bold' },
                xAdjust: 110, // Push inward safely from the start
                yAdjust: -30
            });
        }

        if (previousClose && validDataValues.length > 0) {
            // Find the timestamp of the highest and lowest points to anchor the labels
            let highXIndex = data.indexOf(lineHigh);
            let lowXIndex = data.indexOf(lineLow);

            let highTime = labels[highXIndex];
            let lowTime = labels[lowXIndex];

            // Calculate percentage
            const calcPct = (val) => {
                const pct = ((val - previousClose) / previousClose * 100).toFixed(2);
                const sign = pct > 0 ? '+' : '';
                return `(${sign}${parseFloat(pct)}%)`;
            };

            // 8. 折線最高點上方顯示最高點價格(+-幅度%)
            let highXAdj = 0;
            if (highXIndex < 10) highXAdj = 140;
            else if (highXIndex > data.length - 10) highXAdj = -140;

            annotationsArray.push({
                type: 'label',
                xValue: highTime,
                yValue: lineHigh,
                content: `${lineHigh} ${calcPct(lineHigh)}`,
                display: true,
                backgroundColor: 'rgba(255, 99, 132, 0.8)', // Red bubble for High
                color: 'white',
                font: { size: 30, weight: 'bold' },
                yAdjust: -30, // Above the point
                xAdjust: highXAdj
            });

            // 9. 折線最低點下方顯示最低點價格(+-幅度%)
            // If high and low happen to be the exact same time/value, slightly offset low to prevent total overlap
            let bAdjust = 30; // Below the point
            if (highXIndex === lowXIndex) bAdjust = 70;

            let lowXAdj = 0;
            if (lowXIndex < 10) lowXAdj = 140;
            else if (lowXIndex > data.length - 10) lowXAdj = -140;

            annotationsArray.push({
                type: 'label',
                xValue: lowTime,
                yValue: lineLow,
                content: `${lineLow} ${calcPct(lineLow)}`,
                display: true,
                backgroundColor: 'rgba(75, 192, 192, 0.8)', // Green bubble for Low
                color: 'white',
                font: { size: 30, weight: 'bold' },
                yAdjust: bAdjust,
                xAdjust: lowXAdj
            });
        }


        let headerPriceStr = "";
        let headerIsUp = true;
        if (currentPrice !== null && previousClose) {
            const diffVal = currentPrice - previousClose;
            const pctVal = (diffVal / previousClose * 100).toFixed(2);
            headerIsUp = diffVal >= 0;
            const sign = headerIsUp ? '+' : '';
            const arrow = headerIsUp ? '▲' : '▼';

            // Clean up numbers for display
            const displayDiff = parseFloat(diffVal.toFixed(2)).toString();
            const displayPct = parseFloat(pctVal).toString();

            headerPriceStr = `${currentPrice} ${arrow}  ${sign}${displayDiff}  (${sign}${displayPct}%)`;
        } else if (currentPrice !== null) {
            headerPriceStr = `${currentPrice}`;
        }

        const titleStr1 = name ? `${symbol} ${name}` : symbol;
        const titleStr1Color = '#333333';
        const titleStr2 = headerPriceStr;
        const titleStr2Color = headerIsUp ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)';

        // QuickChart Configuration Object (Chart.js v3 syntax)
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
                    fill: false,
                    spanGaps: true,
                    borderWidth: 2,
                    pointRadius: 1, // Show tiny points to let individual colors render
                    segment: {
                        borderColor: previousClose
                            ? function (context) {
                                if (!context.p0.parsed || !context.p1.parsed) return 'rgb(200, 200, 200)';
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
                layout: {
                    padding: { left: 10, right: 10, bottom: 20 }
                },
                scales: {
                    x: {
                        display: true,
                        ticks: {
                            font: { size: 30 },
                            maxRotation: 0, // Keep labels horizontal
                            minRotation: 0,
                            autoSkip: false, // Force check every tick
                            callback: function (val, index) {
                                var labelsArr = __LABELS_ARRAY__;
                                var label = labelsArr[index] || '';
                                if (label.endsWith(':00') || label.endsWith(':30')) {
                                    return label;
                                }
                                return null;
                            }
                        }
                    },
                    y: {
                        display: true,
                        min: yAxisMin,
                        max: yAxisMax,
                        ticks: {
                            stepSize: yAxisStepSize, // Explicit step guarantees no auto-generated overlapping ticks
                            callback: previousClose ? function (value) {
                                if (__PREV_CLOSE__ === 0) return value;
                                /* Clean up JS floating point drift */
                                var cleanVal = Number(value.toFixed(2));
                                var pct = ((cleanVal - __PREV_CLOSE__) / __PREV_CLOSE__ * 100).toFixed(2);
                                var sign = pct > 0 ? '+' : '';
                                return cleanVal + " (" + sign + pct + "%)";
                            } : undefined,
                            font: { size: 30 }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide the default legend
                    },
                    annotation: annotationsArray.length > 0 ? {
                        annotations: annotationsArray
                    } : undefined,
                    title: {
                        display: true,
                        align: 'start', // Align title to the left
                        text: titleStr1,
                        color: titleStr1Color,
                        font: { size: 70, family: 'sans-serif' },
                        padding: { top: 20, bottom: 10, left: 10 }
                    },
                    subtitle: {
                        display: true,
                        align: 'start', // Align subtitle to the left
                        text: titleStr2,
                        color: titleStr2Color,
                        font: { size: 60, family: 'sans-serif', weight: 'bold' },
                        padding: { bottom: 60, left: 10 }
                    }
                }
            }
        };

        // Custom stringifier to preserve functions
        const serializeConfig = (obj) => {
            const str = JSON.stringify(obj, function (key, val) {
                if (typeof val === 'function') {
                    // Minify the function to a single line just to be safe
                    return val.toString().replace(/\n/g, '').replace(/\s{2,}/g, ' ');
                }
                return val;
            });
            // Unquote the functions and replace our placeholder marker
            return str
                .replace(/"(function.*?})"/g, (match, p1) => {
                    return p1.replace(/\\"/g, '"');
                })
                .replace(/'__LABELS_ARRAY__'/g, JSON.stringify(labels))
                .replace(/__LABELS_ARRAY__/g, JSON.stringify(labels))
                .replace(/__PREV_CLOSE__/g, previousClose || 0)
                .replace(/__Y_AXIS_MAX__/g, yAxisMax || 0)
                .replace(/__Y_AXIS_MIN__/g, yAxisMin || 0)
                .replace(/__TITLE_STR_1__/g, titleStr1)
                .replace(/__TITLE_STR_2__/g, titleStr2)
                .replace(/__TITLE_STR_1_COLOR__/g, titleStr1Color)
                .replace(/__TITLE_STR_2_COLOR__/g, titleStr2Color);
        };

        const chartConfigStr = serializeConfig(chartConfig);

        const quickChartPayload = {
            version: '3', // Force Chart.js v3 for native dual colored titles
            backgroundColor: 'white', // Force white background so it's not black in LINE full-screen
            chart: chartConfigStr,
            width: 1400,
            height: 1000, // Make the chart wider vertically vs horizontally
            format: 'png',
            devicePixelRatio: 2.0 // Retain high-DPI crispness
        };

        return JSON.stringify(quickChartPayload);
    }
}

module.exports = new ChartService();
