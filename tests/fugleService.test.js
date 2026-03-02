const fugleService = require('../src/services/fugleService');
const axios = require('axios');

// Mock axios
jest.mock('axios');

describe('Fugle Service', () => {
    const mockSymbol = '2330';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch intraday candles successfully', async () => {
        const mockData = {
            data: {
                date: '2023-10-25',
                type: 'EQUITY',
                exchange: 'TWSE',
                market: 'TSE',
                symbol: '2330',
                data: [
                    { date: '2023-10-25T09:00:00+08:00', open: 540, high: 545, low: 539, close: 544, volume: 1000 }
                ]
            }
        };

        axios.get.mockResolvedValueOnce(mockData);

        const result = await fugleService.getIntradayCandles(mockSymbol, 1);

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(`https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/${mockSymbol}`, {
            headers: {
                'X-API-KEY': process.env.FUGLE_API_KEY
            },
            params: {
                timeframe: 1
            }
        });
        expect(result).toEqual(mockData.data);
    });

    it('should throw error when api request fails', async () => {
        const mockError = new Error('API Error');
        axios.get.mockRejectedValueOnce(mockError);

        await expect(fugleService.getIntradayCandles(mockSymbol)).rejects.toThrow('API Error');
    });
});
