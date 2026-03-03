const apiKey = "Y2QzMzAyNzYtMjYzNy00NzhhLTk4MTYtYWZhMDdkYjgzNzQxIDNlMGI4M2NhLTEzMGMtNDk1OS04ZGZiLThkMmNjZDI0ZjI0ZA==";
fetch(`https://api.fugle.tw/marketdata/v1.0/stock/intraday/tickers?type=EQUITY&exchange=TWSE&market=TSE`, {
    headers: { 'X-API-KEY': apiKey }
}).then(res => res.json()).then(data => console.log(data.data[0]));
