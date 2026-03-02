class FugleService {
    constructor() {
        this.baseUrl = 'https://api.fugle.tw/marketdata/v1.0/stock';
    }

    /**
     * 取得股票價格 K 線（依代碼查詢）
     * @param {string} symbol - 股票代碼 (e.g. '2330')
     * @param {string} apiKey - 來自 Cloudflare Environment 的 API 金鑰
     * @param {number} timeframe - 取樣頻率，1、5、10、15、30、60 (預設 1 分 K)
     * @returns {Promise<Object>}
     */
    async getIntradayCandles(symbol, apiKey, timeframe = 1) {
        if (!apiKey) {
            console.warn('FUGLE_API_KEY is not provided');
            throw new Error('API Key missing');
        }

        try {
            const url = `${this.baseUrl}/intraday/candles/${symbol}?timeframe=${timeframe}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-API-KEY': apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Fugle API responded with status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching intraday candles for ${symbol}:`, error.message);
            throw error;
        }
    }

    /**
     * 取得股票基本資料（依代碼查詢，內含昨日收盤價 previousClose）
     * @param {string} symbol - 股票代碼 (e.g. '2330')
     * @param {string} apiKey - API 金鑰
     * @returns {Promise<Object>}
     */
    async getIntradayTicker(symbol, apiKey) {
        if (!apiKey) {
            throw new Error('API Key missing');
        }
        try {
            const url = `${this.baseUrl}/intraday/ticker/${symbol}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-API-KEY': apiKey
                }
            });
            if (!response.ok) {
                throw new Error(`Fugle API responded with status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching intraday ticker for ${symbol}:`, error.message);
            throw error;
        }
    }
}

export default new FugleService();
