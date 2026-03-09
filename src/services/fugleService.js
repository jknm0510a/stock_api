// In-memory cache for Cloudflare Workers
// Note: Isolate memory is cleared when the worker restarts or drops out of memory,
// but for high-frequency hits like trending charts, a simple Map cache is extremely effective.
const candlesCache = new Map();
const tickerCache = new Map();

/**
 * 取得當前台北時間的交易日 Session ID
 * 若時間早於早上 9:00，則歸屬於前一天的 Session。
 * @param {number} ms - Timestamp in milliseconds
 * @returns {string} Session ID (e.g. "2023-10-25")
 */
function getTradingSessionId(ms) {
    // 加上 8 小時轉換為 UTC+8
    const d = new Date(ms + 8 * 60 * 60 * 1000);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const date = d.getUTCDate();
    const h = d.getUTCHours();

    // 早上 9 點前，屬於昨日的收盤狀態
    if (h < 9) {
        const prev = new Date(Date.UTC(y, m, date - 1));
        return `${prev.getUTCFullYear()}-${prev.getUTCMonth()}-${prev.getUTCDate()}`;
    }
    // 早上 9 點後，進入今日的交易 Session
    return `${y}-${m}-${date}`;
}

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

        const cacheKey = `${symbol}_${timeframe}`;
        if (candlesCache.has(cacheKey)) {
            const cached = candlesCache.get(cacheKey);
            // 3 minutes (180,000 ms) expiration
            if (Date.now() - cached.timestamp < 3 * 60 * 1000) {
                console.log(`[Cache Hit] Candles for ${symbol}`);
                return cached.data;
            }
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

            const data = await response.json();

            // Save to cache
            candlesCache.set(cacheKey, {
                timestamp: Date.now(),
                data: data
            });

            return data;
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
        const cacheKey = symbol;
        const currentSession = getTradingSessionId(Date.now());

        if (tickerCache.has(cacheKey)) {
            const cached = tickerCache.get(cacheKey);
            // 只要同一個交易日 Session，昨收價就不會變，直接使用快取
            if (cached.session === currentSession) {
                console.log(`[Cache Hit] Ticker for ${symbol} (Session: ${currentSession})`);
                return cached.data;
            }
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

            const data = await response.json();

            // Save to cache
            tickerCache.set(cacheKey, {
                session: currentSession,
                data: data
            });

            return data;
        } catch (error) {
            console.error(`Error fetching intraday ticker for ${symbol}:`, error.message);
            throw error;
        }
    }

    /**
     * 取得股票即時報價（包含現價、漲跌、漲跌幅）
     * @param {string} symbol - 股票代碼
     * @param {string} apiKey - API 金鑰
     * @returns {Promise<Object>}
     */
    /**
     * 取得股票即時報價（包含現價、漲跌、漲跌幅）
     * @param {string} symbol - 股票代碼
     * @param {string} apiKey - API 金鑰
     * @returns {Promise<Object>}
     */
    async getIntradayQuote(symbol, apiKey) {
        if (!apiKey) {
            throw new Error('API Key missing');
        }

        try {
            const url = `${this.baseUrl}/intraday/quote/${symbol}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-API-KEY': apiKey
                }
            });
            if (!response.ok) {
                throw new Error(`Fugle API responded with status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching intraday quote for ${symbol}:`, error.message);
            throw error;
        }
    }

    /**
     * 取得全股號/指數列表
     * @param {string} apiKey - 來自 Cloudflare Environment 的 API 金鑰
     * @returns {Promise<Array>} 包含 symbol, name, type 等資訊的陣列
     */
    async getGlobalTickers(apiKey) {
        if (!apiKey) {
            throw new Error('API Key missing');
        }

        const endpoints = [
            { url: `${this.baseUrl}/intraday/tickers?type=EQUITY&exchange=TWSE&market=TSE`, type: 'EQUITY' },
            { url: `${this.baseUrl}/intraday/tickers?type=INDEX&exchange=TWSE&market=TSE`, type: 'INDEX' },
            { url: `${this.baseUrl}/intraday/tickers?type=EQUITY&exchange=TPEx&market=OTC`, type: 'EQUITY' },
            { url: `${this.baseUrl}/intraday/tickers?type=INDEX&exchange=TPEx&market=OTC`, type: 'INDEX' }
        ];

        let allTickers = [];

        try {
            for (const ep of endpoints) {
                const response = await fetch(ep.url, {
                    method: 'GET',
                    headers: { 'X-API-KEY': apiKey }
                });

                if (!response.ok) {
                    console.error(`Fugle API responded with status: ${response.status} for ${ep.url}`);
                    continue; // Skip failing ones but try the others
                }

                const data = await response.json();
                if (data && data.data) {
                    // Inject the type directly into the item since D1 needs it
                    const itemsWithType = data.data.map(item => ({
                        ...item,
                        type: ep.type
                    }));
                    allTickers = allTickers.concat(itemsWithType);
                }
            }
            return allTickers;
        } catch (error) {
            console.error(`Error fetching global tickers:`, error);
            return []; // Return empty array so the cron job doesn't completely crash
        }
    }
    /**
     * Fetch historical daily candlestick data for K-Line charts.
     * https://developer.fugle.tw/docs/data/core/historical/candles
     * @param {string} symbol
     * @param {string} apiKey
     * @param {string} from YYYY-MM-DD
     * @param {string} to YYYY-MM-DD
     */
    async getHistoricalCandles(symbol, apiKey, from, to, sort = 'asc') {
        if (!apiKey) {
            throw new Error('API Key missing');
        }

        const url = `${this.baseUrl}/historical/candles/${symbol}?from=${from}&to=${to}&timeframe=D&sort=${sort}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-API-KEY': apiKey
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Fugle API error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching historical candles for ${symbol}:`, error);
            throw error;
        }
    }
}

export default new FugleService();
