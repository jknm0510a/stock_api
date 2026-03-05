import fugleService from './src/services/fugleService.js';

async function testFlex() {
    const key = process.env.FUGLE_API_KEY || 'Njc5MTEzOWItZWZjOC00NDhkLTlkODktNDg4NTMzODg4NWUyIDM3MGQwOWYxLTlkOTEtNGY0NC05MGYxLTIxZmMxYThkNDgxNA==';
    // mock list
    const results = [{ symbol: '2330', name: '台積電' }, { symbol: '0050', name: '元大台灣50' }];

    // Fetch quotes
    const quotePromises = results.map(r =>
        fugleService.getIntradayQuote(r.symbol, key).catch(() => null)
    );
    const quotes = await Promise.all(quotePromises);

    const flexContents = [];

    for (let i = 0; i < results.length; i++) {
        const item = results[i];
        const quote = quotes[i];

        let priceStr = '--';
        let diffStr = '--';
        let color = '#777777';
        let arrow = '';

        if (quote) {
            const price = quote.lastPrice || quote.closePrice || quote.referencePrice;
            const change = quote.change || 0;
            const changePct = quote.changePercent || 0;

            priceStr = price.toString();

            if (change > 0) {
                color = '#ff3333';
                arrow = '▲ ';
                diffStr = `+${change} (+${changePct}%)`;
            } else if (change < 0) {
                color = '#33cc33';
                arrow = '▼ ';
                diffStr = `${change} (${changePct}%)`;
            } else {
                color = '#666666';
                diffStr = `0 (0%)`;
            }
        }

        flexContents.push({
            type: 'box',
            layout: 'horizontal',
            paddingAll: '10px',
            spacing: 'sm',
            action: {
                type: 'message',
                label: '查走勢',
                text: item.symbol
            },
            contents: [
                {
                    type: 'text',
                    text: `${item.symbol} ${item.name}`,
                    weight: 'bold',
                    size: 'md',
                    color: '#333333',
                    flex: 3
                },
                {
                    type: 'text',
                    text: `${arrow}${priceStr}`,
                    weight: 'bold',
                    size: 'md',
                    color: color,
                    align: 'end',
                    flex: 2
                },
                {
                    type: 'text',
                    text: diffStr,
                    size: 'sm',
                    color: color,
                    align: 'end',
                    flex: 3
                }
            ]
        });

        // Add separator
        if (i < results.length - 1) {
            flexContents.push({
                type: 'separator',
                margin: 'xs'
            });
        }
    }

    const bubble = {
        type: 'bubble',
        header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#f5f5f5',
            contents: [
                {
                    type: 'text',
                    text: '📋 我的追蹤清單',
                    weight: 'bold',
                    size: 'lg'
                },
                {
                    type: 'text',
                    text: '點擊任一項目查看即時走勢圖',
                    size: 'xs',
                    color: '#888888',
                    margin: 'sm'
                }
            ]
        },
        body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: flexContents
        }
    };

    console.log(JSON.stringify(bubble, null, 2));
}

testFlex();
