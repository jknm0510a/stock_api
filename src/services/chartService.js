const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const moment = require('moment-timezone');

class ChartService {
    constructor() {
        this.width = 800;
        this.height = 400;
        // Using a simple configuration without custom fonts or callbacks to avoid canvas errors
        this.chartJSNodeCanvas = new ChartJSNodeCanvas({ width: this.width, height: this.height, backgroundColour: 'white' });
    }

    /**
     * Generates a trend chart image buffer from 1-min candle data
     * @param {string} symbol - Stock symbol
     * @param {Array} candles - Array of candle data objects from Fugle API
     * @returns {Promise<Buffer>} - Image buffer in PNG format
     */
    async generateTrendChart(symbol, candles) {
        if (!candles || candles.length === 0) {
            throw new Error('No candle data available to generate chart');
        }

        // Sort ascending by time
        const sortedCandles = [...candles].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const labels = sortedCandles.map(c => moment.tz(c.date, 'Asia/Taipei').format('HH:mm'));
        const data = sortedCandles.map(c => c.close); // Use closing price for trend

        // Get min and max for better Y-axis scaling
        const minPrice = Math.min(...data);
        const maxPrice = Math.max(...data);
        const padding = (maxPrice - minPrice) * 0.1 || 1;

        const configuration = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${symbol} Intraday Trend`,
                    data: data,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    pointRadius: 0, // hide dots for cleaner trend line
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time (UTC+8)'
                        },
                        ticks: {
                            maxTicksLimit: 10 // avoid overlapping
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price'
                        },
                        min: Math.max(0, minPrice - padding),
                        max: maxPrice + padding
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                }
            }
        };

        return await this.chartJSNodeCanvas.renderToBuffer(configuration);
    }
}

module.exports = new ChartService();
