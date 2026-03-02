const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const stockRoutes = require('./routes/stockRoutes');
const lineBotRoutes = require('./routes/lineBotRoutes');

// Use routes
app.use('/api/stock', stockRoutes);
app.use('/webhook', lineBotRoutes);
if (lineBotRoutes.imageRouter) {
    app.use('/webhook', lineBotRoutes.imageRouter);
}

// General Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
