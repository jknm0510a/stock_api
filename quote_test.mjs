import fugleService from './src/services/fugleService.js';

async function run() {
    // using testing key
    const key = process.env.FUGLE_API_KEY || 'Njc5MTEzOWItZWZjOC00NDhkLTlkODktNDg4NTMzODg4NWUyIDM3MGQwOWYxLTlkOTEtNGY0NC05MGYxLTIxZmMxYThkNDgxNA==';
    try {
        const data = await fugleService.getIntradayQuote('2330', key);
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

run();
