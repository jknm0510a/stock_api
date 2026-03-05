const fs = require('fs');
const fugleService = require('./src/services/fugleService.js').default;

require('dotenv').config({ path: '.dev.vars' }); // if env var exist

async function run() {
    const key = process.env.FUGLE_API_KEY || 'Njc5MTEzOWItZWZjOC00NDhkLTlkODktNDg4NTMzODg4NWUyIDM3MGQwOWYxLTlkOTEtNGY0NC05MGYxLTIxZmMxYThkNDgxNA==';
    const data = await fugleService.getIntradayQuote('2330', key);
    console.log(JSON.stringify(data, null, 2));
}

run();
