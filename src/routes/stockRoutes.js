const express = require('express');
const router = express.Router();
const fugleService = require('../services/fugleService');

/**
 * @route GET /api/stock/:symbol/candles
 * @desc Get intraday 1-min candles for a specific stock
 */
router.get('/:symbol/candles', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { timeframe } = req.query; // optional timeframe

        const data = await fugleService.getIntradayCandles(symbol, timeframe || 1);
        res.json({ success: true, symbol, data: data.data || [] });
    } catch (error) {
        console.error(`Error in /api/stock/${req.params.symbol}/candles:`, error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stock data',
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;
