const axios = require('axios');

class FugleService {
    constructor() {
        this.apiKey = process.env.FUGLE_API_KEY;
        this.baseUrl = 'https://api.fugle.tw/marketdata/v1.0/stock';

        if (!this.apiKey) {
            console.warn('FUGLE_API_KEY is not defined in environment variables');
        }
    }

    /**
     * 取得股票價格 K 線（依代碼查詢）
     * @param {string} symbol - 股票代碼 (e.g. '2330')
     * @param {number} timeframe - 取樣頻率，1、5、10、15、30、60 (預設 1 分 K)
     * @returns {Promise<Object>}
     */
    async getIntradayCandles(symbol, timeframe = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/intraday/candles/${symbol}`, {
                headers: {
                    'X-API-KEY': this.apiKey
                },
                params: {
                    timeframe
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching intraday candles for ${symbol}:`, error.message);
            throw error;
        }
    }
}

module.exports = new FugleService();
