# Fugle Developer Docs

> Fugle Developer Docs

## Docs

### 以 LLM 輔助 API 串接開發

你可以使用大型語言模型（LLMs）來協助建置富果豪情 API 的整合。<br /><!-- -->我們提供了以下應用，協助你在開發過程中使用 LLM。

#### 純文字文件（Plain text docs）[​](#純文字文件plain-text-docs "Direct link to 純文字文件（Plain text docs）")

你可以在任何網址後方加上 `.md`，即可取得該頁面的純文字 Markdown 版本。<br /><!-- -->例如，本頁的純文字版本可於 [build-with-llm.md](https://developer.fugle.tw/docs/data/build-with-llm) 取得。<br /><!-- -->我們提供 [llms.txt](https://developer.fugle.tw/llms.txt) 檔案，用於指引 AI 工具與代理如何取得我們頁面的純文字版本。 `/llms.txt` 是一項新興標準，旨在讓網站與內容更容易被 LLM 存取與使用。

* [llms.txt](https://developer.fugle.tw/llms.txt)
* [llms-full.txt](https://developer.fugle.tw/llms-full.txt)

#### Model Context Protocol（MCP）[​](#model-context-protocolmcp "Direct link to Model Context Protocol（MCP）")

富果 MarketData API 的 `Model Context Protocol（MCP）`定義許多應用，讓 AI Agent 能夠與富果 API 互動，並搜尋我們的 Library. 在你與 Agent 協作的過程中，它可以使用這些工具來回答問題或完成任務。

如果你正在使用 AI Agent 來協助建置富果 MarketData API 整合，請將該 Agent 連接至 MCP 伺服器。

[富果 MarketData API MCP](https://github.com/fugle-dev/fugle-marketdata-mcp-server)


---

### 錯誤代碼

| 錯誤代碼 | 錯誤內容            | 說明                                                                                                                          |
| -------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 401      | Unauthorized        | 您使用的 API key 無法成功驗證，請至 [金鑰申請頁](https://developer.fugle.tw/docs/key.md) 的行情 API 區重新新增 API Key 試試。 |
| 403      | Forbidden           | 您目前使用的權限方案並不支援此功能，欲升級權限方案可參考 [行情方案及價格頁](https://developer.fugle.tw/docs/pricing.md)。     |
| 404      | Resource Not Found  | 您可能輸入了無效或不存在的商品代碼，請更換商品代碼試試。                                                                      |
| 429      | Rate limit exceeded | 您目前的呼叫次數已達上限，請稍後再試，欲升級權限方案可參考 [行情方案及價格頁](https://developer.fugle.tw/docs/pricing.md)。   |


---

### Corporate Actions Capital Changes

取得上市櫃股票及 ETF 之資本變動資料（面額變更、減資、分割）

```text
GET /corporate-actions/capital-changes/

```

info

屬於 **開發者** 及 **進階用戶** 方案的專屬功能！ **基本用戶** 開放體驗至 2026/2/12

#### Parameters[​](#parameters "Direct link to Parameters")

| Name         | Type   | Description                                                  |
| ------------ | ------ | ------------------------------------------------------------ |
| `start_date` | string | 開始日期（格式：`yyyy-MM-dd`）                               |
| `end_date`   | string | 結束日期（格式：`yyyy-MM-dd`）可輸入未來日期取得未來預告資訊 |
| `sort`       | string | 排序方式（`asc`、`desc`）                                    |

#### Response[​](#response "Direct link to Response")

| Name                              | Type      | Description                                                                                                 |
| --------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| `data`\*                          | object\[] | 資本變動資料                                                                                                |
| `data.symbol`                     | string    | 股票代號                                                                                                    |
| `data.name`                       | string    | 股票名稱                                                                                                    |
| `data.actionType`                 | string    | 事件類型：`etf_split_or_merge` ETF 分割或反分割、`par_value_change` 股票面額變更 、`capital_reduction` 減資 |
| `data.effectiveDate`              | string    | 恢復買賣日期 (YYYY-MM-DD)                                                                                   |
| `data.adjustmentFactor`           | number    | 調整係數                                                                                                    |
| `data.haltDate`                   | string    | 停止買賣日期 (YYYY-MM-DD)                                                                                   |
| `data.resumeDate`                 | string    | 恢復買賣日期 (YYYY-MM-DD)                                                                                   |
| `data.raw`                        | object    | 原始資料                                                                                                    |
| `data.raw.reductionRatio`         | number    | 換股比例 (減資時才有值)                                                                                     |
| `data.raw.splitRatio`             | number    | 換股比例 (面額變更時才有值)                                                                                 |
| `data.raw.parValueBefore`         | number    | 變更前面額 (面額變更時才有值)                                                                               |
| `data.raw.parValueAfter`          | number    | 變更後面額 (面額變更時才有值)                                                                               |
| `data.raw.lastClosePrice`         | number    | 停止買賣前收盤價                                                                                            |
| `data.raw.referencePrice`         | number    | 恢復買賣參考價                                                                                              |
| `data.raw.limitUpPrice`           | number    | 漲停價格                                                                                                    |
| `data.raw.limitDownPrice`         | number    | 跌停價格                                                                                                    |
| `data.raw.openingReferencePrice`  | number    | 開盤競價基準                                                                                                |
| `data.raw.splitType`              | string    | 分割類型：`分割`、`反分割`                                                                                  |
| `data.raw.reductionReason`        | string    | 減資原因 (減資時才有值)                                                                                     |
| `data.raw.refundPerShare`         | number    | 每股退還股款 (元) (減資時才有值)                                                                            |
| `data.raw.rightsOfferingRatio`    | number    | 減資後現金增資配股率 (減資時才有值)                                                                         |
| `data.raw.rightsOfferingPrice`    | number    | 現金增資認購價 (元) (減資時才有值)                                                                          |
| `data.raw.exRightsReferencePrice` | number    | 除權參考價 (減資時才有值)                                                                                   |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/corporate-actions/capital-changes?start_date=2025-12-06&end_date=2026-01-08' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client

stock.corporate_actions.capital_changes(**{"start_date": "2025-12-06", "end_date": "2026-01-08"})

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.corporateActions.capitalChanges({ start_date: '2025-12-06', end_date: '2026-01-08' })
  .then(data => console.log(data));

```

Response Body：

```json
{
    "start_date": "2025-01-01",
    "end_date": "2026-01-09",
    "sort": "desc",
    "data": [
        {
            "symbol": "4530",
            "name": "宏易",
            "actionType": "capital_reduction",
            "resumeDate": "2025-12-29",
            "haltDate": "2025-12-18",
            "exchange": "TPEx",
            "raw": {
                "exrightReferencePrice": 0,
                "limitDownPrice": 28.2,
                "limitUpPrice": 34.45,
                "openingReferencePrice": 31.3,
                "previousClose": 12.3,
                "reason": "彌補虧損",
                "referencePrice": 31.32,
                "refundPerShare": 0,
                "sharesPerThousand": 392.72795
            }
        },
        {
            "symbol": "3593",
            "name": "力銘",
            "actionType": "capital_reduction",
            "resumeDate": "2025-12-22",
            "haltDate": "2025-12-11",
            "exchange": "TWSE",
            "raw": {
                "limitDownPrice": 12.15,
                "limitUpPrice": 14.85,
                "openingReferencePrice": 13.5,
                "previousClose": 8.1,
                "reason": "彌補虧損",
                "referencePrice": 13.5,
                "refundPerShare": 0,
                "sharesPerThousand": 599.9999936
            }
        },
        {
            "symbol": "00715L",
            "name": "期街口布蘭特正2",
            "actionType": "etf_split_or_merge",
            "resumeDate": "2025-12-10",
            "haltDate": "2025-12-03",
            "exchange": "TWSE",
            "raw": {
                "limitDownPrice": 0.01,
                "limitUpPrice": 9999.95,
                "openingReferencePrice": 20.86,
                "previousClose": 10.43,
                "referencePrice": 20.86,
                "splitRatio": 0.5,
                "splitType": "反分割"
            }
        },
        {
            "symbol": "8103",
            "name": "瀚荃",
            "actionType": "capital_reduction",
            "resumeDate": "2025-12-08",
            "haltDate": "2025-11-27",
            "exchange": "TWSE",
            "raw": {
                "limitDownPrice": 77.5,
                "limitUpPrice": 94.7,
                "openingReferencePrice": 86.1,
                "previousClose": 74.7,
                "reason": "退還股款",
                "referencePrice": 86.11,
                "refundPerShare": 1.5,
                "sharesPerThousand": 850
            }
        },
        {
            "symbol": "0052",
            "name": "富邦科技",
            "actionType": "etf_split_or_merge",
            "resumeDate": "2025-11-26",
            "exchange": "TWSE",
            "raw": {
                "limitDownPrice": 31.54,
                "limitUpPrice": 38.54,
                "openingReferencePrice": 35.04,
                "previousClose": 245.3,
                "referencePrice": 35.04,
                "splitType": "分割"
            }
        },
        {
            "symbol": "1808",
            "name": "潤隆",
            "actionType": "capital_reduction",
            "resumeDate": "2025-11-24",
            "haltDate": "2025-11-13",
            "exchange": "TWSE",
            "raw": {
                "limitDownPrice": 33.45,
                "limitUpPrice": 40.85,
                "openingReferencePrice": 37.15,
                "previousClose": 34.45,
                "reason": "退還股款",
                "referencePrice": 37.16,
                "refundPerShare": 1,
                "sharesPerThousand": 900
            }
        },
        {
            "symbol": "6465",
            "name": "威潤",
            "actionType": "capital_reduction",
            "resumeDate": "2025-11-24",
            "haltDate": "2025-11-13",
            "exchange": "TPEx",
            "raw": {
                "exrightReferencePrice": 0,
                "limitDownPrice": 15.55,
                "limitUpPrice": 18.95,
                "openingReferencePrice": 17.25,
                "previousClose": 15.65,
                "reason": "彌補虧損",
                "referencePrice": 17.25,
                "refundPerShare": 0,
                "sharesPerThousand": 907.01186
            }
        },
        {
            "symbol": "9927",
            "name": "泰銘",
            "actionType": "capital_reduction",
            "resumeDate": "2025-11-24",
            "haltDate": "2025-11-13",
            "exchange": "TWSE",
            "raw": {
                "limitDownPrice": 62.2,
                "limitUpPrice": 76,
                "openingReferencePrice": 69.1,
                "previousClose": 52.4,
                "reason": "退還股款",
                "referencePrice": 69.11,
                "refundPerShare": 2.82805,
                "sharesPerThousand": 717.194904
            }
        },
        {
            "symbol": "8422",
            "name": "可寧衛",
            "actionType": "par_value_change",
            "resumeDate": "2025-11-17",
            "haltDate": "2025-11-06",
            "exchange": "TWSE",
            "raw": {
                "limitDownPrice": 22.5,
                "limitUpPrice": 27.5,
                "openingReferencePrice": 25,
                "previousClose": 250,
                "referencePrice": 25
            }
        },
        {
            "symbol": "5301",
            "name": "寶得利",
            "actionType": "capital_reduction",
            "resumeDate": "2025-11-12",
            "haltDate": "2025-11-05",
            "exchange": "TPEx",
            "raw": {
                "exrightReferencePrice": 0,
                "limitDownPrice": 12.55,
                "limitUpPrice": 15.25,
                "openingReferencePrice": 13.9,
                "previousClose": 6.41,
                "reason": "彌補虧損",
                "referencePrice": 13.89,
                "refundPerShare": 0,
                "sharesPerThousand": 461.57
            }
        },
        ...
    ]
}

```


---

### Corporate Actions Dividends

取得 上市櫃除權息資料（依日期查詢）

```text
GET /corporate-actions/dividends/

```

info

屬於 **開發者** 及 **進階用戶** 方案的專屬功能！ **基本用戶** 開放體驗至 2026/2/12

#### Parameters[​](#parameters "Direct link to Parameters")

| Name         | Type   | Description                                                  |
| ------------ | ------ | ------------------------------------------------------------ |
| `start_date` | string | 開始日期（格式：`yyyy-MM-dd`）                               |
| `end_date`   | string | 結束日期（格式：`yyyy-MM-dd`）可輸入未來日期取得未來預告資訊 |

#### Response[​](#response "Direct link to Response")

| Name                            | Type      | Description                |
| ------------------------------- | --------- | -------------------------- |
| `data`\*                        | object\[] | 除權息資料                 |
| `data.date`\*                   | string    | 除權息日期                 |
| `data.exchange`                 | string    | 交易所                     |
| `data.symbol`                   | string    | 股票代號                   |
| `data.name`                     | string    | 股票名稱                   |
| `data.previousClose`            | number    | 除權息前收盤價             |
| `data.referencePrice`           | number    | 除權息參考價               |
| `data.dividend`                 | number    | 除權息總金額 (權值 + 息值) |
| `data.dividendType`             | string    | 除權息類別                 |
| `data.limitUpPrice`             | number    | 除權後漲停價               |
| `data.limitDownPrice`           | number    | 除權後跌停價               |
| `data.openingReferencePrice`    | number    | 開盤競價參考價             |
| `data.exdividendReferencePrice` | number    | 減除股利參考價             |
| `data.cashDividend`             | number    | 現金除息                   |
| `data.stockDividendShares`      | number    | 每千股無償配股             |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/corporate-actions/dividends?start_date=2025-08-26&end_date=2026-01-08' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client

stock.corporate_actions.dividends(**{"start_date": "2025-08-26", "end_date": "2026-01-08"})

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.corporateActions.dividends({ start_date: '2025-08-26', end_date: '2026-01-08' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "data": [
    { // 宣告未來的除權息資料不會帶入價格
      "date": "2026-01-08",
      "exchange": "TWSE",
      "symbol": "2247",
      "name": "汎德永業",
      "previousClose": null,
      "referencePrice": null,
      "dividend": 6.5,
      "dividendType": "息",
      "limitUpPrice": null,
      "limitDownPrice": null,
      "openingReferencePrice": null,
      "exdividendReferencePrice": null,
      "cashDividend": 6.5,
      "stockDividendShares": null
    },
    { // 已發生的除權息資料會帶入價格 (僅有息)
      "date": "2026-01-06",
      "exchange": "TWSE",
      "symbol": "00946",
      "name": "群益科技高息成長",
      "previousClose": 9.6,
      "referencePrice": 9.54,
      "dividend": 0.058,
      "dividendType": "息",
      "limitUpPrice": 10.49,
      "limitDownPrice": 8.59,
      "openingReferencePrice": 9.54,
      "exdividendReferencePrice": 9.54,
      "cashDividend": 0.058,
      "stockDividendShares": 0
    },
    { // 增資 ( 前日開盤會等於減除股利參考價或 stockDividendShares = 0 )
      "date": "2026-01-06",
      "exchange": "TWSE",
      "symbol": "2442",
      "name": "新美齊",
      "previousClose": 24.8,
      "referencePrice": 24.12,
      "dividend": 0.671598,
      "dividendType": "權",
      "limitUpPrice": 27.25,
      "limitDownPrice": 21.75,
      "openingReferencePrice": 24.8,
      "exdividendReferencePrice": 24.8,
      "cashDividend": 0,
      "stockDividendShares": 0
    },
    { // 已發生的除權息資料會帶入價格 (僅有權)
      "date": "2025-08-26",
      "exchange": "TPEx",
      "symbol": "6752",
      "name": "叡揚",
      "previousClose": 158.5,
      "referencePrice": 150.95,
      "dividend": 7.548635,
      "dividendType": "權",
      "limitUpPrice": 166,
      "limitDownPrice": 136,
      "openingReferencePrice": 151,
      "exdividendReferencePrice": 150.95,
      "cashDividend": 0,
      "stockDividendShares": 50.00706711
    },
    { // 已發生的除權息資料會帶入價格 (同時包含權息)
      "date": "2025-08-26",
      "exchange": "TPEx",
      "symbol": "4554",
      "name": "橙的",
      "previousClose": 36.95,
      "referencePrice": 32.39,
      "dividend": 4.560619,
      "dividendType": "權息",
      "limitUpPrice": 35.6,
      "limitDownPrice": 29.2,
      "openingReferencePrice": 32.4,
      "exdividendReferencePrice": 32.39,
      "cashDividend": 0.35,
      "stockDividendShares": 129.99998584
    }
  ]
}

```


---

### Corporate Actions Listing Applicants

取得 申請上市櫃公司資料

```text
GET /corporate-actions/listing-applicants/

```

info

屬於 **開發者** 及 **進階用戶** 方案的專屬功能！ **基本用戶** 開放體驗至 2026/2/12

#### Parameters[​](#parameters "Direct link to Parameters")

| Name         | Type   | Description                                                   |
| ------------ | ------ | ------------------------------------------------------------- |
| `start_date` | string | 開始日期（格式：`yyyy-MM-dd`）                                |
| `end_date`   | string | 結束日期（格式：`yyyy-MM-dd`） 可輸入未來日期取得未來預告資訊 |
| `sort`       | string | 排序方式（`asc`、`desc`）                                     |

#### Response[​](#response "Direct link to Response")

| Name                   | Type   | Description                              |
| ---------------------- | ------ | ---------------------------------------- |
| `symbol`               | string | 公司代號                                 |
| `name`                 | string | 公司簡稱                                 |
| `exchange`             | string | 申請類別：`TWSE`（上市）、`TPEx`（上櫃） |
| `applicationDate`      | string | 申請日期                                 |
| `chairman`             | string | 董事長                                   |
| `capitalAtApplication` | number | 申請時股本（仟元）                       |
| `reviewCommitteeDate`  | string | 上市審議委員審議日                       |
| `boardApprovalDate`    | string | 交易所董事會通過日                       |
| `contractFilingDate`   | string | 主管機關核准日期                         |
| `listedDate`           | string | 股票上市、櫃買賣日期                     |
| `underwriter`          | string | 承銷商                                   |
| `underwritingPrice`    | number | 承銷價                                   |
| `remarks`              | string | 備註                                     |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/corporate-actions/listing-applicants?start_date=2025-01-07&end_date=2026-01-07' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client

stock.corporate_actions.listing_applicants(**{"start_date": "2025-01-07", "end_date": "2026-01-07"})

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.corporateActions.listingApplicants({ start_date: '2025-01-07', end_date: '2026-01-07' })
  .then(data => console.log(data));

```

Response Body：

```json
{
    "start_date": "2025-01-07",
    "end_date": "2026-01-07",
    "sort": "desc",
    "data": [
        ...
        {
            "symbol": "7762",
            "name": "吉晟生",
            "exchange": "TWSE",
            "applicationDate": "2025-09-24",
            "chairman": "楊朝堂",
            "capitalAtApplication": 572328,
            "reviewCommitteeDate": null,
            "boardApprovalDate": null,
            "contractFilingDate": null,
            "listedDate": null,
            "underwriter": "宏遠",
            "underwritingPrice": null,
            "remarks": "創新板，114-10-31撤件"
        },
        {
            "symbol": "6961",
            "name": "旅天下",
            "exchange": "TPEx",
            "applicationDate": "2025-09-17",
            "chairman": "李嘉寅",
            "capitalAtApplication": 236340000,
            "reviewCommitteeDate": "2025-11-06",
            "boardApprovalDate": "2025-11-21",
            "contractApprovalDate": "2025-11-25",
            "listedDate": null,
            "underwriter": "福邦",
            "underwritingPrice": null,
            "remarks": ""
        },
        {
            "symbol": "4590",
            "name": "富田",
            "exchange": "TWSE",
            "applicationDate": "2025-09-15",
            "chairman": "張金鋒",
            "capitalAtApplication": 511941,
            "reviewCommitteeDate": "2025-10-23",
            "boardApprovalDate": "2025-11-18",
            "contractFilingDate": "2025-11-26",
            "listedDate": null,
            "underwriter": "中信",
            "underwritingPrice": null,
            "remarks": "創新板"
        },
        {
            "symbol": "6725",
            "name": "矽科宏晟",
            "exchange": "TPEx",
            "applicationDate": "2025-09-11",
            "chairman": "郭錦松",
            "capitalAtApplication": 330000000,
            "reviewCommitteeDate": "2025-10-20",
            "boardApprovalDate": "2025-10-30",
            "contractApprovalDate": "2025-11-04",
            "listedDate": "2025-12-30",
            "underwriter": "台新",
            "underwritingPrice": 188,
            "remarks": ""
        }
    ]
}

```


---

### 開始使用

富果行情 REST API 提供開發者友善的 Web API 服務。您可以查詢台股的日內行情、行情快照與歷史行情等數據。

#### 身份驗證[​](#身份驗證 "Direct link to 身份驗證")

富果行情 API 透過 API 金鑰對用戶進行身份驗證（Authentication）。請在發送 API 請求時請加入以下 HTTP 標頭：

```text
X-API-KEY: <YOUR_API_KEY>

```

#### 速率限制[​](#速率限制 "Direct link to 速率限制")

如果您 API 請求超過了限制，將收到帶有狀態碼 `429` 的回應。

不同的 API 方案有不同的速率限制，關於速率限制，請參考 [行情方案及價格](https://developer.fugle.tw/docs/pricing.md) 的說明。

#### API 端點[​](#api-端點 "Direct link to API 端點")

富果行情 REST API 端點使用以下位置為前綴：

```text
https://api.fugle.tw/marketdata/v1.0/stock/

```

API 端點依資料類型可分為 **盤中行情（intraday）**、**行情快照（snapshot）**、**歷史行情（historical）**。富果行情 REST API 提供的端點如下：

* GET `/intraday/tickers` - [取得股票或指數列表（依條件查詢）](https://developer.fugle.tw/docs/data/http-api/intraday/tickers.md)
* GET `/intraday/ticker/{symbol}` - [取得股票基本資料（依代碼查詢）](https://developer.fugle.tw/docs/data/http-api/intraday/ticker.md)
* GET `/intraday/quote/{symbol}` - [取得股票即時報價（依代碼查詢）](https://developer.fugle.tw/docs/data/http-api/intraday/quote.md)
* GET `/intraday/candles/{symbol}` - [取得股票價格Ｋ線（依代碼查詢）](https://developer.fugle.tw/docs/data/http-api/intraday/candles.md)
* GET `/intraday/trades/{symbol}` - [取得股票成交明細（依代碼查詢）](https://developer.fugle.tw/docs/data/http-api/intraday/trades.md)
* GET `/intraday/volumes/{symbol}` - [取得股票分價量表（依代碼查詢）](https://developer.fugle.tw/docs/data/http-api/intraday/volumes.md)
* GET `/snapshot/quotes/{market}` - [取得股票行情快照（依市場別）](https://developer.fugle.tw/docs/data/http-api/snapshot/quotes.md)
* GET `/snapshot/movers/{market}` - [取得股票漲跌幅排行（依市場別）](https://developer.fugle.tw/docs/data/http-api/snapshot/movers.md)
* GET `/snapshot/actives/{market}` - [取得股票成交量值排行（依市場別）](https://developer.fugle.tw/docs/data/http-api/snapshot/actives.md)
* GET `/historical/candles/{symbol}` - [取得 1 年內歷史股價（依代碼查詢）](https://developer.fugle.tw/docs/data/http-api/historical/candles.md)
* GET `/historical/stats/{symbol}` - [取得近 52 週股價數據（依代碼查詢）](https://developer.fugle.tw/docs/data/http-api/historical/stats.md)
* GET `/technical/sma/{symbol}` - [取得簡單移動平均 (SMA) 數據 (依代碼查詢)](https://developer.fugle.tw/docs/data/http-api/technical/sma.md)
* GET `/technical/rsi/{symbol}` - [取得相對強弱指標 (RSI) 數據 (依代碼查詢)](https://developer.fugle.tw/docs/data/http-api/technical/rsi.md)
* GET `/technical/kdj/{symbol}` - [取得歲機指標 (KDJ) 數據 (依代碼查詢)](https://developer.fugle.tw/docs/data/http-api/technical/kdj.md)
* GET `/technical/macd/{symbol}` - [取得指數平滑異同移動平均線 (MACD) 數據 (依代碼查詢)](https://developer.fugle.tw/docs/data/http-api/technical/macd.md)
* GET `/technical/bb/{symbol}` - [取得布林通道 (BBands) 數據 (依代碼查詢)](https://developer.fugle.tw/docs/data/http-api/technical/bb.md)

#### 使用 SDK[​](#使用-sdk "Direct link to 使用 SDK")

富果行情 REST API 提供 Python 與 Node.js SDK。您可以透過以下方式存取 REST API：

* Python
* Node.js

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
stock = client.stock

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
const stock = client.stock;

```


---

### Historical Candles

取得 1 年內的上市櫃歷史股價（依代碼查詢），個股資料區間最遠可回溯至 2010 年，指數部分最遠可回溯至 2015 年！

```text
GET /historical/candles/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name        | Type   | Description                                                                                                                      |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `symbol`\*  | string | 股票代碼                                                                                                                         |
| `from`      | string | 開始日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `to`        | string | 結束日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `timeframe` | string | Ｋ線週期，可選 `1` 1分Ｋ；`3` 3分Ｋ；`5` 5分Ｋ；`10` 10分Ｋ；`15` 15分Ｋ；`30` 30分Ｋ；`60` 60分Ｋ；`D` 日Ｋ；`W` 週Ｋ；`M` 月Ｋ |
| `adjusted`  | string | 還原股價啟用，可選 `true`、`false`                                                                                               |
| `fields`    | string | 欄位，可選：`open,high,low,close,volume,turnover,change`                                                                         |
| `sort`      | string | 時間排序，預設為 `desc` 降冪 ；可選 `asc` 升冪                                                                                   |

caution

目前分Ｋ無法指定開始日期（from） 與 結束日期（to），一律回傳近 30 日資料，並且無法選擇 turnover 與 change 的欄位。

#### Response[​](#response "Direct link to Response")

| Name            | Type      | Description         |
| --------------- | --------- | ------------------- |
| `date`\*        | string    | 日期                |
| `type`\*        | string    | 證券類型            |
| `exchange`\*    | string    | 交易所              |
| `market`\*      | string    | 市場別              |
| `symbol`\*      | string    | 股票代號            |
| `timeframe`\*   | string    | Ｋ線週期            |
| `data`\*        | object\[] | Ｋ線資料            |
| `data.date`\*   | string    | 日期（分 K 含時間） |
| `data.open`     | number    | Ｋ線開盤價          |
| `data.high`     | number    | Ｋ線最高價          |
| `data.low`      | number    | Ｋ線最低價          |
| `data.close`    | number    | Ｋ線收盤價          |
| `data.volume`   | number    | Ｋ線成交量（股）    |
| `data.turnover` | number    | Ｋ線成交金額（元）  |
| `data.change`   | number    | Ｋ線漲跌            |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/0050?fields=open,high,low,close,volume' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client

stock.historical.candles(**{"symbol": "0050", "from": "2023-02-06", "to": "2023-02-08", "fields": "open,high,low,close,volume,change"})

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.historical.candles({ symbol: '0050', from: '2023-02-06', to: '2023-02-08', fields: 'open,high,low,close,volume,change' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "symbol": "0050",
  "type": "EQUITY",
  "exchange": "TWSE",
  "market": "TSE",
  "timeframe": "D",
  "data": [
    {
      "date": "2023-02-08",
      "open": 120.1,
      "high": 120.95,
      "low": 120,
      "close": 120.85,
      "volume": 9239321,
      "change": 1.85
    },
    {
      "date": "2023-02-07",
      "open": 119.1,
      "high": 119.25,
      "low": 118.55,
      "close": 119,
      "volume": 8787291,
      "change": -0.25
    },
    {
      "date": "2023-02-06",
      "open": 120.1,
      "high": 120.1,
      "low": 119.25,
      "close": 119.25,
      "volume": 14297030,
      "change": -1.75
    }
  ]
}

```


---

### Historical Stats

取得近 52 週股價數據（依代碼查詢）

```text
GET /historical/stats/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description |
| ---------- | ------ | ----------- |
| `symbol`\* | string | 股票代碼    |

#### Response[​](#response "Direct link to Response")

| Name              | Type   | Description        |
| ----------------- | ------ | ------------------ |
| `date`\*          | string | 日期               |
| `type`\*          | string | Ticker 類型        |
| `exchange`\*      | string | 交易所             |
| `market`\*        | string | 市場別             |
| `symbol`\*        | string | 股票代碼           |
| `name`\*          | string | 股票簡稱           |
| `openPrice`\*     | number | 最後交易日開盤價   |
| `highPrice`\*     | number | 最後交易日最高價   |
| `lowPrice`\*      | number | 最後交易日最低價   |
| `closePrice`\*    | number | 最後交易日收盤價   |
| `change`\*        | number | 最後交易日漲跌     |
| `changePercent`\* | number | 最後交易日漲跌幅   |
| `tradeVolume`\*   | number | 最後交易日成交量   |
| `tradeValue`\*    | number | 最後交易日成交金額 |
| `previousClose`\* | number | 前一交易日收盤價   |
| `week52High`\*    | number | 近 52 週高點       |
| `week52Low`\*     | number | 近 52 週低點       |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/historical/stats/0050' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client
stock.historical.stats(symbol = "0050")

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.historical.stats({ symbol: '0050' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "date": "2023-02-09",
  "type": "EQUITY",
  "exchange": "TWSE",
  "market": "TSE",
  "symbol": "0050",
  "name": "元大台灣50",
  "openPrice": 120.5,
  "highPrice": 121,
  "lowPrice": 120.3,
  "closePrice": 120.9,
  "change": 0.05,
  "changePercent": 0.04,
  "tradeVolume": 5032245,
  "tradeValue": 607543546,
  "previousClose": 120.85000000000001,
  "week52High": 145.05,
  "week52Low": 96.5
}

```


---

### Intraday Candles

取得股票價格Ｋ線（依代碼查詢）

```text
GET /intraday/candles/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name        | Type   | Description                                                                                        |
| ----------- | ------ | -------------------------------------------------------------------------------------------------- |
| `symbol`\*  | string | 股票代碼                                                                                           |
| `type`      | string | Ticker 類型，可選 `oddlot` 盤中零股                                                                |
| `timeframe` | string | Ｋ線週期，可選 `1` 1分Ｋ；`3` 3分Ｋ；`5` 5分Ｋ；`10` 10分Ｋ；`15` 15分Ｋ；`30` 30分Ｋ；`60` 60分Ｋ |
| `sort`      | string | 時間排序，預設為 `asc` 升冪 ； 可選 `desc` 降冪                                                    |

#### Response[​](#response "Direct link to Response")

| Name              | Type      | Description                                                                |
| ----------------- | --------- | -------------------------------------------------------------------------- |
| `date`\*          | string    | 日期                                                                       |
| `type`\*          | string    | Ticker 類型                                                                |
| `exchange`\*      | string    | 交易所                                                                     |
| `market`          | string    | 市場別                                                                     |
| `symbol`\*        | string    | 股票代號                                                                   |
| `timeframe`\*     | string    | Ｋ線週期                                                                   |
| `data`\*          | object\[] | Ｋ線資料                                                                   |
| `data[0].date`    | string    | Ｋ線時間                                                                   |
| `data[0].open`    | number    | Ｋ線開盤價                                                                 |
| `data[0].high`    | number    | Ｋ線最高價                                                                 |
| `data[0].low`     | number    | Ｋ線最低價                                                                 |
| `data[0].close`   | number    | Ｋ線收盤價                                                                 |
| `data[0].volume`  | number    | Ｋ線成交量（整股：成交張數；興櫃股票及盤中零股：成交股數；指數：成交金額） |
| `data[0].average` | number    | 成交均價                                                                   |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/2330' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key='YOUR_API_KEY')
stock = client.stock
stock.intraday.candles(symbol='2330')

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.intraday.candles({ symbol: '2330' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "date": "2023-05-29",
  "type": "EQUITY",
  "exchange": "TWSE",
  "market": "TSE",
  "symbol": "2330",
  "data": [
    {
      "date": "2023-05-29T09:00:00.000+08:00",
      "open": 574,
      "high": 574,
      "low": 572,
      "close": 572,
      "volume": 8450,
      "average": 573.82
    },
    {
      "date": "2023-05-29T09:01:00.000+08:00",
      "open": 572,
      "high": 573,
      "low": 571,
      "close": 571,
      "volume": 594,
      "average": 573.68
    },
    {
      "date": "2023-05-29T09:02:00.000+08:00",
      "open": 572,
      "high": 572,
      "low": 569,
      "close": 570,
      "volume": 1372,
      "average": 573.26
    },
    ......
  ]
}

```


---

### Intraday Quote

取得股票即時報價（依代碼查詢）

```text
GET /intraday/quote/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| `symbol`\* | string | 股票代碼                     |
| `type`     | string | 類型，可選 `oddlot` 盤中零股 |

#### Response[​](#response "Direct link to Response")

| Name                     | Type      | Description                         |
| ------------------------ | --------- | ----------------------------------- |
| `date`\*                 | string    | 日期                                |
| `type`\*                 | string    | Ticker 類型                         |
| `exchange`\*             | string    | 交易所                              |
| `market`\*               | string    | 市場別                              |
| `symbol`\*               | string    | 股票代碼                            |
| `name`\*                 | string    | 股票簡稱                            |
| `referencePrice`         | number    | 今日參考價                          |
| `previousClose`          | number    | 昨日收盤價                          |
| `openPrice`              | number    | 開盤價                              |
| `openTime`               | number    | 開盤價成交時間                      |
| `highPrice`              | number    | 最高價                              |
| `highTime`               | number    | 最高價成交時間                      |
| `lowPrice`               | number    | 最低價                              |
| `lowTime`                | number    | 最低價成交時間                      |
| `closePrice`             | number    | 收盤價（最後成交價）                |
| `closeTime`              | number    | 收盤價（最後成交價）成交時間        |
| `avgPrice`               | number    | 當日成交均價                        |
| `change`                 | number    | 最後一筆成交漲跌（含試撮）          |
| `changePercent`          | number    | 最後一筆成交漲跌幅（含試撮）        |
| `amplitude`              | number    | 當日振幅                            |
| `lastPrice`              | number    | 最後一筆成交價（含試撮）            |
| `lastSize`               | number    | 最後一筆成交數量（含試撮）          |
| `bids`                   | object\[] | 最佳五檔委買                        |
| `bids[0].price`          | number    | 最佳五檔委買價格                    |
| `bids[0].size`           | number    | 最佳五檔委買數量                    |
| `asks`                   | object\[] | 最佳五檔委賣                        |
| `asks[0].price`          | number    | 最佳五檔委賣價格                    |
| `asks[0].size`           | number    | 最佳五檔委賣數量                    |
| `total`                  | object    | 統計資訊                            |
| `total.tradeValue`       | number    | 累計成交金額                        |
| `total.tradeVolume`      | number    | 累計成交量                          |
| `total.tradeVolumeAtBid` | number    | 累計內盤成交量                      |
| `total.tradeVolumeAtAsk` | number    | 累計外盤成交量                      |
| `total.transaction`      | number    | 累計成交筆數                        |
| `total.time`             | number    | 統計時間                            |
| `lastTrade`              | object    | 最後一筆成交資訊                    |
| `lastTrade.bid`          | number    | 最後一筆成交買價                    |
| `lastTrade.ask`          | number    | 最後一筆成交賣價                    |
| `lastTrade.price`        | number    | 最後一筆成交價格                    |
| `lastTrade.size`         | number    | 最後一筆成交數量                    |
| `lastTrade.time`         | number    | 最後一筆成交時間                    |
| `lastTrade.serial`       | number    | 最後一筆成交流水號                  |
| `lastTrial`              | object    | 最後一筆試撮資訊                    |
| `lastTrial.bid`          | number    | 最後一筆試撮買價                    |
| `lastTrial.ask`          | number    | 最後一筆試撮賣價                    |
| `lastTrial.price`        | number    | 最後一筆試撮價格                    |
| `lastTrial.size`         | number    | 最後一筆試撮數量                    |
| `lastTrial.time`         | number    | 最後一筆試撮時間                    |
| `lastTrial.serial`       | number    | 最後一筆試撮流水號                  |
| `tradingHalt`            | object    | 暫停交易                            |
| `tradingHalt.isHalted`   | boolean   | 暫停交易：`true`；恢復交易：`false` |
| `tradingHalt.time`       | number    | 暫停交易時間／恢復交易時間          |
| `isLimitDownPrice`       | boolean   | 最後成交價為跌停價：`true`          |
| `isLimitUpPrice`         | boolean   | 最後成交價為漲停價：`true`          |
| `isLimitDownBid`         | boolean   | 最佳一檔委買跌停價：`true`          |
| `isLimitUpBid`           | boolean   | 最佳一檔委買漲停價：`true`          |
| `isLimitDownAsk`         | boolean   | 最佳一檔委賣跌停價：`true`          |
| `isLimitUpAsk`           | boolean   | 最佳一檔委賣漲停價：`true`          |
| `isLimitDownHalt`        | boolean   | 暫緩撮合且瞬間趨跌：`true`          |
| `isLimitUpHalt`          | boolean   | 暫緩撮合且瞬間趨漲：`true`          |
| `isTrial`                | boolean   | 試撮階段：`true`                    |
| `isDelayedOpen`          | boolean   | 延後開盤信號：`true`                |
| `isDelayedClose`         | boolean   | 延後收盤信號：`true`                |
| `isContinuous`           | boolean   | 最後成交為逐筆交易：`true`          |
| `isOpen`                 | boolean   | 開盤信號：`true`                    |
| `isClose`                | boolean   | 收盤信號：`true`                    |
| `lastUpdated`            | number    | 最後更新時間                        |
| `serial`                 | number    | 流水號                              |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/2330' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key='YOUR_API_KEY')
stock = client.stock
stock.intraday.quote(symbol='2330')

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.intraday.quote({ symbol: '2330' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "date": "2023-05-29",
  "type": "EQUITY",
  "exchange": "TWSE",
  "market": "TSE",
  "symbol": "2330",
  "name": "台積電",
  "referencePrice": 566,
  "previousClose": 566,
  "openPrice": 574,
  "openTime": 1685322000049353,
  "highPrice": 574,
  "highTime": 1685322000049353,
  "lowPrice": 564,
  "lowTime": 1685327142152580,
  "closePrice": 568,
  "closeTime": 1685338200000000,
  "avgPrice": 568.77,
  "change": 2,
  "changePercent": 0.35,
  "amplitude": 1.77,
  "lastPrice": 568,
  "lastSize": 4778,
  "bids": [
    {
      "price": 567,
      "size": 87
    },
    {
      "price": 566,
      "size": 2454
    },
    {
      "price": 565,
      "size": 611
    },
    {
      "price": 564,
      "size": 609
    },
    {
      "price": 563,
      "size": 636
    }
  ],
  "asks": [
    {
      "price": 568,
      "size": 800
    },
    {
      "price": 569,
      "size": 806
    },
    {
      "price": 570,
      "size": 3643
    },
    {
      "price": 571,
      "size": 1041
    },
    {
      "price": 572,
      "size": 2052
    }
  ],
  "total": {
    "tradeValue": 31019803000,
    "tradeVolume": 54538,
    "tradeVolumeAtBid": 19853,
    "tradeVolumeAtAsk": 27900,
    "transaction": 9530,
    "time": 1685338200000000
  },
  "lastTrade": {
    "bid": 567,
    "ask": 568,
    "price": 568,
    "size": 4778,
    "time": 1685338200000000,
    "serial": 6652422
  },
  "lastTrial": {
    "bid": 567,
    "ask": 568,
    "price": 568,
    "size": 4772,
    "time": 1685338196400347,
    "serial": 6651941
  },
  "isClose": true,
  "serial": 6652422,
  "lastUpdated": 1685338200000000
}

```


---

### Intraday Ticker

取得股票基本資料（依代碼查詢）

```text
GET /intraday/ticker/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| `symbol`\* | string | 股票代碼                     |
| `type`     | string | 類型，可選 `oddlot` 盤中零股 |

#### Response[​](#response "Direct link to Response")

| Name                          | Type    | Description                                                               |
| ----------------------------- | ------- | ------------------------------------------------------------------------- |
| `date`\*                      | string  | 日期                                                                      |
| `type`\*                      | string  | Ticker 類型                                                               |
| `exchange`\*                  | string  | 交易所                                                                    |
| `market`                      | string  | 市場別                                                                    |
| `symbol`\*                    | string  | 股票代碼                                                                  |
| `name`\*                      | string  | 股票簡稱                                                                  |
| `nameEn`                      | string  | 股票英文簡稱                                                              |
| `industry`                    | string  | 產業別                                                                    |
| `securityType`                | string  | 證券別，參閱 [證券別代碼](#%E8%AD%89%E5%88%B8%E5%88%A5%E4%BB%A3%E7%A2%BC) |
| `previousClose`               | number  | 前一交易日收盤價                                                          |
| `referencePrice`              | number  | 參考價                                                                    |
| `limitUpPrice`                | number  | 漲停價（興櫃股不適用）                                                    |
| `limitDownPrice`              | number  | 跌停價（興櫃股不適用）                                                    |
| `canDayTrade`                 | boolean | 可買賣現沖（興櫃股不適用）                                                |
| `canBuyDayTrade`              | boolean | 可先買現沖（興櫃股不適用）                                                |
| `canBelowFlatMarginShortSell` | boolean | 平盤下得融券賣出（興櫃股不適用）                                          |
| `canBelowFlatSBLShortSell`    | boolean | 平盤下得借券賣出（興櫃股不適用）                                          |
| `isAttention`                 | boolean | 注意股                                                                    |
| `isDisposition`               | boolean | 處置股                                                                    |
| `isUnusuallyRecommended`      | boolean | 投資理財節目異常推介個股（興櫃股不適用）                                  |
| `isSpecificAbnormally`        | boolean | 特殊異常個股（興櫃股不適用）                                              |
| `matchingInterval`            | number  | 撮合循環秒數（興櫃股不適用）                                              |
| `securityStatus`              | string  | 證券狀態，分別有 `NORMAL`, `TERMINATED`, `SUSPENDED` 狀態                 |
| `boardLot`                    | number  | 交易單位                                                                  |
| `tradingCurrency`             | string  | 交易幣別                                                                  |
| `exercisePrice`               | number  | 履約價格（限權證）                                                        |
| `exercisedVolume`             | number  | 前一交易日履約數量（限權證）                                              |
| `cancelledVolume`             | number  | 前一交易日註銷數量（限權證）                                              |
| `remainingVolume`             | number  | 發行餘額量（限權證）                                                      |
| `exerciseRatio`               | number  | 行使比率（限權證）                                                        |
| `knockInPrice`                | number  | 上限價格（限權證）                                                        |
| `knockOutPrice`               | number  | 下限價格（限權證）                                                        |
| `maturityDate`                | string  | 到期日（限權證）                                                          |
| `openTime`                    | string  | 開盤時間（限指數）                                                        |
| `closeTime`                   | string  | 收盤時間（限指數）                                                        |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/intraday/ticker/2330' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key='YOUR_API_KEY')
stock = client.stock
stock.intraday.ticker(symbol='2330')

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.intraday.ticker({ symbol: '2330' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "date": "2023-05-29",
  "type": "EQUITY",
  "exchange": "TWSE",
  "market": "TSE",
  "symbol": "2330",
  "name": "台積電",
  "industry": "24",
  "securityType": "01",
  "previousClose": 566,
  "referencePrice": 566,
  "limitUpPrice": 622,
  "limitDownPrice": 510,
  "canDayTrade": true,
  "canBuyDayTrade": true,
  "canBelowFlatMarginShortSell": true,
  "canBelowFlatSBLShortSell": true,
  "isAttention": false,
  "isDisposition": false,
  "isUnusuallyRecommended": false,
  "isSpecificAbnormally": false,
  "matchingInterval": 0,
  "securityStatus": "NORMAL",
  "boardLot": 1000,
  "tradingCurrency": "TWD"
}

```

#### 證券別代碼[​](#證券別代碼 "Direct link to 證券別代碼")

| 代碼 | 證券別                                     | 代碼 | 證券別                 |
| ---- | ------------------------------------------ | ---- | ---------------------- |
| `01` | 一般股票                                   | `25` | ETF（外幣計價）        |
| `02` | 轉換公司債                                 | `26` | 槓桿型ETF              |
| `03` | 交換公司債或交換金融債                     | `27` | 槓桿型 ETF（外幣計價） |
| `04` | 一般特別股                                 | `28` | 反向型 ETF             |
| `05` | 可交換特別股                               | `29` | 反向型 ETF（外幣計價） |
| `06` | 認股權憑證                                 | `30` | 期信託 ETF             |
| `07` | 附認股權特別股                             | `31` | 期信託 ETF（外幣計價） |
| `08` | 附認股權公司債                             | `32` | 債券 ETF               |
| `09` | 附認股權公司債履約或分拆後之公司債         | `33` | 債券 ETF（外幣計價）   |
| `10` | 國內標的認購權證                           | `34` | 金融資產證券化受益證券 |
| `11` | 國內標的認售權證                           | `35` | 不動產資產信託受益證券 |
| `12` | 外國標的認購權證                           | `36` | 不動產投資信託受益證券 |
| `13` | 外國標的認售權證                           | `37` | ETN                    |
| `14` | 國內標的下限型認購權證                     | `38` | 槓桿型 ETN             |
| `15` | 國內標的上限型認售權證                     | `39` | 反向型 ETN             |
| `16` | 國內標的可展延下限型認購權證               | `40` | 債券型 ETN             |
| `17` | 國內標的可展延上限型認售權證               | `41` | 期權策略型 ETN         |
| `18` | 受益憑證(封閉式基金)                       | `42` | 中央登錄公債           |
| `19` | 存託憑證                                   | `43` | 外國債券               |
| `20` | 存託憑證可轉換公司債                       | `44` | 黃金現貨               |
| `21` | 存託憑證附認股權公司債                     | `45` | 平衡型 ETF             |
| `22` | 存託憑證附認股權公司債履約或分拆後之公司債 | `46` | 主動型 ETF             |
| `23` | 存託憑證認股權憑證                         | `47` | 債券主動式 ETF         |
| `24` | ETF                                        | `00` | 未知或保留代碼         |


---

### Intraday Tickers

取得股票或指數列表（依條件查詢）

```text
GET /intraday/tickers

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name            | Type    | Description                                                                                 |
| --------------- | ------- | ------------------------------------------------------------------------------------------- |
| `type`\*        | string  | Ticker 類型，可選 `EQUITY` 股票；`INDEX` 指數；`WARRANT` 權證；`ODDLOT` 盤中零股            |
| `exchange`      | string  | 交易所，可選 `TWSE` 臺灣證券交易所；`TPEx` 證券櫃檯買賣中心                                 |
| `market`        | string  | 市場別，可選 `TSE` 上市；`OTC` 上櫃；`ESB` 興櫃一般板；`TIB` 臺灣創新板；`PSB` 興櫃戰略新板 |
| `industry`      | string  | 產業別，參閱 [產業別代碼](#%E7%94%A2%E6%A5%AD%E5%88%A5%E4%BB%A3%E7%A2%BC)                   |
| `isNormal`      | boolean | 查詢正常股票（非注意、處置股票）：`true`                                                    |
| `isAttention`   | boolean | 查詢注意股票：`true`                                                                        |
| `isDisposition` | boolean | 查詢處置股票：`true`                                                                        |
| `isHalted`      | boolean | 查詢暫停交易股票：`true`                                                                    |

#### Response[​](#response "Direct link to Response")

| Name             | Type      | Description                      |
| ---------------- | --------- | -------------------------------- |
| `date`\*         | string    | 日期                             |
| `type`\*         | string    | Ticker 類型                      |
| `exchange`\*     | string    | 交易所                           |
| `market`         | string    | 市場別                           |
| `industry`       | string    | 產業別                           |
| `isNormal`       | boolean   | 查詢正常股票（非注意、處置股票） |
| `isAttention`    | boolean   | 查詢注意股票                     |
| `isDisposition`  | boolean   | 查詢處置股票                     |
| `isHalted`       | boolean   | 查詢暫停交易股票                 |
| `data`           | object\[] | 股票列表                         |
| `data[0].symbol` | string    | 股票代碼                         |
| `data[0].name`   | string    | 股票簡稱                         |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/intraday/tickers?type=EQUITY&exchange=TWSE&isNormal=true' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
stock = client.stock
stock.intraday.tickers(type='EQUITY', exchange="TWSE", isNormal=True)

```

```js
const { RestClient } = require("@fugle/marketdata");

const client = new RestClient({ apiKey: "YOUR_API_KEY" });
client.stock.intraday
  .tickers({ type: "EQUITY", exchange: "TWSE", isNormal: true })
  .then((data) => console.log(data));

```

Response Body：

```json
{
  "date": "2023-02-09",
  "type": "EQUITY",
  "exchange": "TWSE",
  "isNormal": true,
  "data": [
    {
      "symbol": "0050",
      "name": "元大台灣50"
    },
    {
      "symbol": "0051",
      "name": "元大中型100"
    },
    {
      "symbol": "0052",
      "name": "富邦科技"
    },
    ......
  ]
}

```

#### 產業別代碼[​](#產業別代碼 "Direct link to 產業別代碼")

| 代碼 | 產業別   | 代碼 | 產業別           | 代碼 | 產業別       |
| ---- | -------- | ---- | ---------------- | ---- | ------------ |
| `01` | 水泥工業 | `16` | 觀光餐旅         | `29` | 電子通路業   |
| `02` | 食品工業 | `17` | 金融保險         | `30` | 資訊服務業   |
| `03` | 塑膠工業 | `18` | ~~貿易百貨~~     | `31` | 其他電子業   |
| `04` | 紡織纖維 | `19` | 綜合             | `32` | 文化創意業   |
| `05` | 電機機械 | `20` | 其他             | `33` | 農業科技業   |
| `06` | 電器電纜 | `21` | 化學工業         | `34` | ~~電子商務~~ |
| `08` | 玻璃陶瓷 | `22` | 生技醫療業       | `35` | 綠能環保     |
| `09` | 造紙工業 | `23` | 油電燃氣業       | `36` | 數位雲端     |
| `10` | 鋼鐵工業 | `24` | 半導體業         | `37` | 運動休閒     |
| `11` | 橡膠工業 | `25` | 電腦及週邊設備業 | `38` | 居家生活     |
| `12` | 汽車工業 | `26` | 光電業           | `80` | 管理股票     |
| `14` | 建材營造 | `27` | 通信網路業       |      |              |
| `15` | 航運業   | `28` | 電子零組件業     |      |              |

info

不具備產業屬性的證券如 ETF、可轉換公司債、附認股權公司債、認購(售)權證等衍生性商品，產業別代碼為 `00`。


---

### Intraday Trades

取得股票成交明細（依代碼查詢）

```text
GET /intraday/trades/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type    | Description                                   |
| ---------- | ------- | --------------------------------------------- |
| `symbol`\* | string  | 股票代碼                                      |
| `type`     | string  | Ticker 類型，可選 `oddlot` 盤中零股           |
| `offset`   | number  | 偏移量                                        |
| `limit`    | number  | 限制量                                        |
| `sort`     | string  | 時間排序，預設為 `desc` 降冪，可選 `asc` 升冪 |
| `isTrial`  | boolean | 查詢試撮明細： `true`                         |

#### Response[​](#response "Direct link to Response")

| Name             | Type      | Description |
| ---------------- | --------- | ----------- |
| `date`\*         | string    | 日期        |
| `type`\*         | string    | Ticker 類型 |
| `exchange`\*     | string    | 交易所      |
| `market`         | string    | 市場別      |
| `symbol`\*       | string    | 股票代號    |
| `data`\*         | object\[] | 成交明細    |
| `data[0].bid`    | number    | 成交買價    |
| `data[0].ask`    | number    | 成交賣價    |
| `data[0].price`  | number    | 成交價格    |
| `data[0].size`   | number    | 成交單量    |
| `data[0].volume` | number    | 成交總量    |
| `data[0].time`   | number    | 成交時間    |
| `data[0].serial` | number    | 流水號      |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/intraday/trades/0050' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key='YOUR_API_KEY')
stock = client.stock
stock.intraday.trades(symbol='2330') 

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.intraday.trades({ symbol: '2330' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "date": "2023-05-29",
  "type": "EQUITY",
  "exchange": "TWSE",
  "market": "TSE",
  "symbol": "2330",
  "data": [
    {
      "price": 568,
      "size": 32,
      "time": 1685341800000000,
      "serial": 99999999
    },
    {
      "bid": 567,
      "ask": 568,
      "price": 568,
      "size": 4778,
      "volume": 54538,
      "time": 1685338200000000,
      "serial": 6652422
    },
    {
      "bid": 565,
      "ask": 566,
      "price": 566,
      "size": 1,
      "volume": 49760,
      "time": 1685337899721587,
      "serial": 6622549
    },
    ......
  ]
}

```


---

### Intraday Volumes

取得股票分價量表（依代碼查詢）

```text
GET /intraday/volumes/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| `symbol`\* | string | 股票代碼                     |
| `type`     | string | 類型，可選 `oddlot` 盤中零股 |

#### Response[​](#response "Direct link to Response")

| Name                  | Type      | Description              |
| --------------------- | --------- | ------------------------ |
| `date`\*              | string    | 日期                     |
| `type`\*              | string    | Ticker 類型              |
| `exchange`\*          | string    | 交易所                   |
| `market`              | string    | 市場別                   |
| `symbol`\*            | string    | 股票代號                 |
| `data`                | object\[] | 分價量表                 |
| `data[0].price`       | number    | 成交價                   |
| `data[0].volume`      | number    | 該成交價之累計成交量     |
| `data[0].volumeAtBid` | number    | 該成交價之內盤累計成交量 |
| `data[0].volumeAtAsk` | number    | 該成交價之外盤累計成交量 |

為什麼 `volumeAtAsk`+`volumeAtBid` 可能不等於 `volume` ?

關於內外盤比的計算方式，我們在計算中扣除了開盤時的第一筆成交量，主要是基於以下考量：

1. 開盤時的第一筆成交是由交易所進行電腦集中撮合，可能未充分反映真實的市場供需狀況
2. 開盤的第一筆成交往往伴隨較大的成交量，這可能對內外盤比產生較大的影響

因此，團隊在計算內外盤比時扣除開盤第一筆成交，以更好地反映真實市場的買賣盤力道！

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/intraday/volumes/2330' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key='YOUR_KEY')
stock = client.stock
stock.intraday.volumes(symbol='2330') 

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.intraday.volumes({ symbol: '2330' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "date": "2023-05-29",
  "type": "EQUITY",
  "exchange": "TWSE",
  "market": "TSE",
  "symbol": "2330",
  "data": [
    {
      "price": 574,
      "volume": 7309,
      "volumeAtBid": 0,
      "volumeAtAsk": 524
    },
    {
      "price": 573,
      "volume": 771,
      "volumeAtBid": 657,
      "volumeAtAsk": 114
    },
    {
      "price": 572,
      "volume": 3364,
      "volumeAtBid": 843,
      "volumeAtAsk": 2521
    },
    {
      "price": 571,
      "volume": 3723,
      "volumeAtBid": 1026,
      "volumeAtAsk": 2697
    },
    {
      "price": 570,
      "volume": 5541,
      "volumeAtBid": 3019,
      "volumeAtAsk": 2522
    },
    {
      "price": 569,
      "volume": 1952,
      "volumeAtBid": 1318,
      "volumeAtAsk": 634
    },
    {
      "price": 568,
      "volume": 7906,
      "volumeAtBid": 1422,
      "volumeAtAsk": 6484
    },
    {
      "price": 567,
      "volume": 10498,
      "volumeAtBid": 2816,
      "volumeAtAsk": 7682
    },
    {
      "price": 566,
      "volume": 8206,
      "volumeAtBid": 5988,
      "volumeAtAsk": 2218
    },
    {
      "price": 565,
      "volume": 4833,
      "volumeAtBid": 2329,
      "volumeAtAsk": 2504
    },
    {
      "price": 564,
      "volume": 435,
      "volumeAtBid": 435,
      "volumeAtAsk": 0
    }
  ]
}

```


---

### Snapshot Actives

info

屬於 **開發者** 及 **進階用戶** 方案的專屬功能！

取得股票成交量值排行（依市場別），系統更新頻率為每五秒更新一次。

```text
GET /snapshot/actives/{market}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description                                                                                 |
| ---------- | ------ | ------------------------------------------------------------------------------------------- |
| `market`\* | string | 市場別，可選 `TSE` 上市；`OTC` 上櫃；`ESB` 興櫃一般板；`TIB` 臺灣創新板；`PSB` 興櫃戰略新板 |
| `trade`\*  | string | 成交量／成交值，可選 `volume` 成交量；`value` 成交值                                        |
| `type`     | string | 標的類型，可選 `ALLBUT0999` 包含一般股票、特別股及 ETF ； `COMMONSTOCK` 為一般股票          |

#### Response[​](#response "Direct link to Response")

| Name                    | Type      | Description    |
| ----------------------- | --------- | -------------- |
| `date`\*                | string    | 日期           |
| `time`\*                | string    | 時間           |
| `market`\*              | string    | 市場別         |
| `trade`\*               | string    | 成交量／成交值 |
| `data`\*                | object\[] | 快照資料       |
| `data[0].type`          | string    | Ticker 類型    |
| `data[0].symbol`        | string    | 股票代碼       |
| `data[0].name`          | string    | 股票簡稱       |
| `data[0].openPrice`     | number    | 開盤價         |
| `data[0].highPrice`     | number    | 最高價         |
| `data[0].lowPrice`      | number    | 最低價         |
| `data[0].closePrice`    | number    | 收盤價         |
| `data[0].change`        | number    | 漲跌           |
| `data[0].changePercent` | number    | 漲跌幅         |
| `data[0].tradeVolume`   | number    | 成交量         |
| `data[0].tradeValue`    | number    | 成交金額       |
| `data[0].lastUpdated`   | number    | 快照時間       |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/actives/TSE?trade=value' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
stock = client.stock
stock.snapshot.actives(market='TSE', trade='value')

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.snapshot.actives({ market: 'TSE', trade: 'value })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "date": "2023-05-29",
  "time": "140000",
  "market": "TSE",
  "trade": "value",
  "data": [
    {
      "type": "EQUITY",
      "symbol": "2330",
      "name": "台積電",
      "openPrice": 574,
      "highPrice": 574,
      "lowPrice": 564,
      "closePrice": 568,
      "change": 2,
      "changePercent": 0.35,
      "tradeVolume": 54538,
      "tradeValue": 31019803000,
      "lastUpdated": 1685338200000000
    },
    {
      "type": "EQUITY",
      "symbol": "3231",
      "name": "緯創",
      "openPrice": 66,
      "highPrice": 69.2,
      "lowPrice": 65.9,
      "closePrice": 68,
      "change": 3,
      "changePercent": 4.62,
      "tradeVolume": 202089,
      "tradeValue": 13763365000,
      "lastUpdated": 1685338200000000
    },
    {
      "type": "EQUITY",
      "symbol": "3661",
      "name": "世芯-KY",
      "openPrice": 1555,
      "highPrice": 1660,
      "lowPrice": 1550,
      "closePrice": 1660,
      "change": 150,
      "changePercent": 9.93,
      "tradeVolume": 6937,
      "tradeValue": 11264055000,
      "lastUpdated": 1685338200000000
    },
    ......
  ]
}

```


---

### Snapshot Movers

info

屬於 **開發者** 及 **進階用戶** 方案的專屬功能！

取得股票漲跌幅排行（依市場別），系統更新頻率為每五秒更新一次。

```text
GET /snapshot/movers/{market}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name          | Type   | Description                                                                        |
| ------------- | ------ | ---------------------------------------------------------------------------------- |
| `market`\*    | string | 市場別                                                                             |
| `direction`\* | string | 上漲／下跌，可選 `up` 上漲；`down` 下跌                                            |
| `change`\*    | string | 漲跌／漲跌幅，可選 `percent` 漲跌幅；`value` 漲跌                                  |
| `type`        | string | 標的類型，可選 `ALLBUT0999` 包含一般股票、特別股及 ETF ； `COMMONSTOCK` 為一般股票 |
| `gt`          | number | 篩選大於漲跌／漲跌幅的股票                                                         |
| `gte`         | number | 篩選大於或等於漲跌／漲跌幅的股票                                                   |
| `lt`          | number | 篩選小於漲跌／漲跌幅的股票                                                         |
| `lte`         | number | 篩選小於或等於漲跌／漲跌幅的股票                                                   |
| `eq`          | number | 篩選等於漲跌／漲跌幅的股票                                                         |

#### Response[​](#response "Direct link to Response")

| Name                    | Type      | Description  |
| ----------------------- | --------- | ------------ |
| `date`\*                | string    | 日期         |
| `time`\*                | string    | 時間         |
| `market`\*              | string    | 市場別       |
| `change`\*              | string    | 漲跌／漲跌幅 |
| `data`\*                | object\[] | 快照資料     |
| `data[0].type`          | string    | Ticker 類型  |
| `data[0].symbol`        | string    | 股票代碼     |
| `data[0].name`          | string    | 股票簡稱     |
| `data[0].openPrice`     | number    | 開盤價       |
| `data[0].highPrice`     | number    | 最高價       |
| `data[0].lowPrice`      | number    | 最低價       |
| `data[0].closePrice`    | number    | 收盤價       |
| `data[0].change`        | number    | 漲跌         |
| `data[0].changePercent` | number    | 漲跌幅       |
| `data[0].tradeVolume`   | number    | 成交量       |
| `data[0].tradeValue`    | number    | 成交金額     |
| `data[0].lastUpdated`   | number    | 快照時間     |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/movers/TSE?direction=up&change=percent' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key='YOUR_API_KEY')
stock = client.stock
stock.snapshot.movers(market='TSE', direction='up', change='percent')

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.snapshot.movers({ market: 'TSE', direction: 'up', change: 'percent' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "date": "2023-05-29",
  "time": "133500",
  "market": "TSE",
  "change": "percent",
  "data": [
    {
      "type": "EQUITY",
      "symbol": "2901",
      "name": "欣欣",
      "openPrice": 27.1,
      "highPrice": 29.7,
      "lowPrice": 27.1,
      "closePrice": 29.7,
      "change": 2.7,
      "changePercent": 10,
      "tradeVolume": 640,
      "tradeValue": 18824300,
      "lastUpdated": 1685338200000000
    },
    {
      "type": "EQUITY",
      "symbol": "2345",
      "name": "智邦",
      "openPrice": 357.5,
      "highPrice": 357.5,
      "lowPrice": 346.5,
      "closePrice": 357.5,
      "change": 32.5,
      "changePercent": 10,
      "tradeVolume": 9350,
      "tradeValue": 3331334500,
      "lastUpdated": 1685338200000000
    },
    {
      "type": "EQUITY",
      "symbol": "3025",
      "name": "星通",
      "openPrice": 42.3,
      "highPrice": 44.65,
      "lowPrice": 41.8,
      "closePrice": 44.65,
      "change": 4.05,
      "changePercent": 9.98,
      "tradeVolume": 25625,
      "tradeValue": 1114127050,
      "lastUpdated": 1685338200000000
    },
    ......
  ]
}

```


---

### Snapshot Quotes

info

屬於 **開發者** 及 **進階用戶** 方案的專屬功能！

取得股票行情快照（依市場別），系統更新頻率為每五秒更新一次。

```text
GET /snapshot/quotes/{market}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description                                                                                 |
| ---------- | ------ | ------------------------------------------------------------------------------------------- |
| `market`\* | string | 市場別，可選 `TSE` 上市；`OTC` 上櫃；`ESB` 興櫃一般板；`TIB` 臺灣創新板；`PSB` 興櫃戰略新板 |
| `type`     | string | 標的類型，可選 `ALLBUT0999` 包含一般股票、特別股及 ETF ； `COMMONSTOCK` 為一般股票          |

#### Response[​](#response "Direct link to Response")

| Name                    | Type      | Description |
| ----------------------- | --------- | ----------- |
| `date`\*                | string    | 日期        |
| `time`\*                | string    | 時間        |
| `market`\*              | string    | 市場別      |
| `data`\*                | object\[] | 快照資料    |
| `data[0].type`          | string    | Ticker 類型 |
| `data[0].symbol`        | string    | 股票代碼    |
| `data[0].name`          | string    | 股票簡稱    |
| `data[0].openPrice`     | number    | 開盤價      |
| `data[0].highPrice`     | number    | 最高價      |
| `data[0].lowPrice`      | number    | 最低價      |
| `data[0].closePrice`    | number    | 收盤價      |
| `data[0].change`        | number    | 漲跌        |
| `data[0].changePercent` | number    | 漲跌幅      |
| `data[0].tradeVolume`   | number    | 成交量      |
| `data[0].tradeValue`    | number    | 成交金額    |
| `data[0].lastUpdated`   | number    | 快照時間    |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/quotes/TSE' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key='YOUR_API_KEY')
stock = client.stock
stock.snapshot.quotes(market='TSE')

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.snapshot.quotes({ market: 'TSE' })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "date": "2023-05-29",
  "time": "133500",
  "market": "TSE",
  "data": [
    {
      "type": "EQUITY",
      "symbol": "0050",
      "name": "元大台灣50",
      "openPrice": 127.45,
      "highPrice": 127.55,
      "lowPrice": 126.5,
      "closePrice": 126.75,
      "change": 0.8,
      "changePercent": 0.64,
      "tradeVolume": 14444,
      "tradeValue": 1832941850,
      "lastUpdated": 1685338200000000
    },
    {
      "type": "EQUITY",
      "symbol": "0051",
      "name": "元大中型100",
      "openPrice": 61,
      "highPrice": 62.2,
      "lowPrice": 61,
      "closePrice": 62,
      "change": 1.3,
      "changePercent": 2.14,
      "tradeVolume": 191,
      "tradeValue": 11816050,
      "lastUpdated": 1685338200000000
    },
    {
      "type": "EQUITY",
      "symbol": "0052",
      "name": "富邦科技",
      "openPrice": 111.8,
      "highPrice": 112.1,
      "lowPrice": 111.1,
      "closePrice": 111.7,
      "change": 1.2,
      "changePercent": 1.09,
      "tradeVolume": 565,
      "tradeValue": 63088400,
      "lastUpdated": 1685338200000000
    },
    ......
  ]
}

```


---

### Technical Bbands BETA

取得特定股票在指定時間範圍內的布林通通 (Bollinger Bands)

```text
GET /technical/bb/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name          | Type   | Description                                                                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `symbol`\*    | string | 股票代碼                                                                                                                         |
| `from`\*      | string | 開始日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `to`\*        | string | 結束日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `timeframe`\* | string | Ｋ線週期，可選 `1` 1分Ｋ；`3` 3分Ｋ；`5` 5分Ｋ；`10` 10分Ｋ；`15` 15分Ｋ；`30` 30分Ｋ；`60` 60分Ｋ；`D` 日Ｋ；`W` 週Ｋ；`M` 月Ｋ |
| `period`\*    | number | 布林通道週期                                                                                                                     |

caution

目前分Ｋ無法指定開始日期（from） 與 結束日期（to），一律回傳近 30 日資料。

#### Response[​](#response "Direct link to Response")

| Name               | Type      | Description  |
| ------------------ | --------- | ------------ |
| `symbol`\*         | string    | 股票代號     |
| `from`\*           | string    | 開始日期     |
| `to`\*             | string    | 結束日期     |
| `timeframe`\*      | string    | Ｋ線週期     |
| `fast`\*           | number    | 快線週期     |
| `slow`\*           | number    | 慢線週期     |
| `signal`\*         | number    | 信號線週期   |
| `data`\*           | object\[] | 布林通道資料 |
| `data[0].date`\*   | string    | 資料時間     |
| `data[0].upper`\*  | number    | 上軌線       |
| `data[0].middle`\* | number    | 中軌線       |
| `data[0].lower`\*  | number    | 下軌線       |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/technical/bb/2330?from=2024-08-01&to=2024-08-10&timeframe=D&period=20' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client

stock.technical.bb(**{"symbol": "2330", "from": "2024-08-01", "to": "2024-08-10","timeframe":"D", "period":20})

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.technical.bb({ symbol: '2330', from: '2024-08-01', to: '2024-08-10', timeframe: 'D', period: 20 })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "symbol": "2330",
  "from": "2024-08-01",
  "to": "2024-08-10",
  "timeframe": "D",
  "period": 20,
  "data": [
    {
      "date": "2024-08-01",
      "upper": 1089.4184184924368,
      "middle": 997.45,
      "lower": 905.4815815075632
    },
    {
      "date": "2024-08-02",
      "upper": 1094.230862990929,
      "middle": 993.65,
      "lower": 893.0691370090711
    },
    {
      "date": "2024-08-05",
      "upper": 1111.086637737101,
      "middle": 984.15,
      "lower": 857.2133622628991
    },
    {
      "date": "2024-08-06",
      "upper": 1112.2099400640175,
      "middle": 977.9,
      "lower": 843.5900599359824
    },
    {
      "date": "2024-08-07",
      "upper": 1106.0354361011682,
      "middle": 972.15,
      "lower": 838.2645638988317
    },
    {
      "date": "2024-08-08",
      "upper": 1098.9536939789348,
      "middle": 964.95,
      "lower": 830.9463060210653
    },
    {
      "date": "2024-08-09",
      "upper": 1088.7976815866498,
      "middle": 959.4,
      "lower": 830.0023184133502
    }
  ]
}

```


---

### Technical KDJ BETA

取得特定股票在指定時間範圍內的隨機指標 (KDJ)

```text
GET /technical/kdj/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name          | Type   | Description                                                                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `symbol`\*    | string | 股票代碼                                                                                                                         |
| `from`\*      | string | 開始日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `to`\*        | string | 結束日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `timeframe`\* | string | Ｋ線週期，可選 `1` 1分Ｋ；`3` 3分Ｋ；`5` 5分Ｋ；`10` 10分Ｋ；`15` 15分Ｋ；`30` 30分Ｋ；`60` 60分Ｋ；`D` 日Ｋ；`W` 週Ｋ；`M` 月Ｋ |
| `rPeriod`\*   | number | KDJ 週期                                                                                                                         |
| `kPeriod`\*   | number | %K 週期                                                                                                                          |
| `dPeriod`\*   | number | %D 週期                                                                                                                          |

caution

目前分Ｋ無法指定開始日期（from） 與 結束日期（to），一律回傳近 30 日資料。

#### Response[​](#response "Direct link to Response")

| Name             | Type      | Description |
| ---------------- | --------- | ----------- |
| `symbol`\*       | string    | 股票代號    |
| `from`\*         | string    | 開始日期    |
| `to`\*           | string    | 結束日期    |
| `timeframe`\*    | string    | Ｋ線週期    |
| `rPeriod`\*      | number    | KDJ 週期    |
| `kPeriod`\*      | number    | %K 週期     |
| `dPeriod`\*      | number    | %D 週期     |
| `data`\*         | object\[] | KDJ 資料    |
| `data[0].date`\* | string    | 資料時間    |
| `data[0].k`\*    | number    | K           |
| `data[0].d`\*    | number    | D           |
| `data[0].j`\*    | number    | J           |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/technical/kdj/2330?from=2024-08-01&to=2024-08-10&timeframe=D&rPeriod=9&kPeriod=3&dPeriod=3' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client

stock.technical.kdj(**{"symbol": "2330", "from": "2024-08-01", "to": "2024-08-10","timeframe":"D", "rPeriod": 9, "kPeriod":3, "dPeriod":3})

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.technical.kdj({ symbol: '2330', from: '2024-08-01', to: '2024-08-10', timeframe: 'D', rPeriod: 9, kPeriod: 3, dPeriod: 3 })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "symbol": "2330",
  "from": "2024-08-01",
  "to": "2024-08-10",
  "timeframe": "D",
  "rPeriod": 9,
  "kPeriod": 3,
  "dPeriod": 3,
  "data": [
    {
      "date": "2024-08-01",
      "k": 32.96296296296297,
      "d": 27.77777777777779,
      "j": 43.333333333333336
    },
    {
      "date": "2024-08-02",
      "k": 23.703703703703713,
      "d": 27.901234567901245,
      "j": 15.308641975308653
    },
    {
      "date": "2024-08-05",
      "k": 17.068273092369484,
      "d": 24.578313253012055,
      "j": 2.048192771084345
    },
    {
      "date": "2024-08-06",
      "k": 13.855421686746999,
      "d": 18.20913282760673,
      "j": 5.147999405027534
    },
    {
      "date": "2024-08-07",
      "k": 36.718669549994864,
      "d": 22.547454776370447,
      "j": 65.0610990972437
    },
    {
      "date": "2024-08-08",
      "k": 54.05210585933478,
      "d": 34.87539903202555,
      "j": 92.40551951395325
    },
    {
      "date": "2024-08-09",
      "k": 66.45299145299147,
      "d": 52.40792228744038,
      "j": 94.54312978409367
    }
  ]
}


```


---

### Technical MACD BETA

取得特定股票在指定時間範圍內的指數平滑異同移動平均線 (MACD)

```text
GET /technical/macd/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name          | Type   | Description                                                                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `symbol`\*    | string | 股票代碼                                                                                                                         |
| `from`\*      | string | 開始日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `to`\*        | string | 結束日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `timeframe`\* | string | Ｋ線週期，可選 `1` 1分Ｋ；`3` 3分Ｋ；`5` 5分Ｋ；`10` 10分Ｋ；`15` 15分Ｋ；`30` 30分Ｋ；`60` 60分Ｋ；`D` 日Ｋ；`W` 週Ｋ；`M` 月Ｋ |
| `fast`\*      | number | 快線週期                                                                                                                         |
| `slow`\*      | number | 慢線週期                                                                                                                         |
| `signal`\*    | number | 信號線週期                                                                                                                       |

caution

目前分Ｋ無法指定開始日期（from） 與 結束日期（to），一律回傳近 30 日資料。

#### Response[​](#response "Direct link to Response")

| Name                   | Type      | Description |
| ---------------------- | --------- | ----------- |
| `symbol`\*             | string    | 股票代號    |
| `from`\*               | string    | 開始日期    |
| `to`\*                 | string    | 結束日期    |
| `timeframe`\*          | string    | Ｋ線週期    |
| `fast`\*               | number    | 快線週期    |
| `slow`\*               | number    | 慢線週期    |
| `signal`\*             | number    | 信號線週期  |
| `data`\*               | object\[] | MACD 資料   |
| `data[0].date`\*       | string    | 資料時間    |
| `data[0].macdLine`\*   | number    | MACD 線     |
| `data[0].signalLine`\* | number    | 信號線      |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/technical/macd/2330?from=2024-08-01&to=2024-08-10&timeframe=D&fast=12&slow=26&signal=9' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client

stock.technical.macd(**{"symbol": "2330", "from": "2024-08-01", "to": "2024-08-10","timeframe":"D", "fast": 12, "slow":26, "signal":9})

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.technical.macd({ symbol: '2330', from: '2024-08-01', to: '2024-08-10', timeframe: 'D', fast: 12, slow: 26, signal: 9, dPeriod: 3 })
  .then(data => console.log(data));

```

Response Body：

```json
{
  "symbol": "2330",
  "from": "2024-08-01",
  "to": "2024-08-10",
  "timeframe": "D",
  "fast": 12,
  "slow": 26,
  "signal": 9,
  "data": [
    {
      "date": "2024-08-01",
      "macdLine": -8.888098865883194,
      "signalLine": 1.1835714956164298
    },
    {
      "date": "2024-08-02",
      "macdLine": -13.342205320023709,
      "signalLine": -1.721583867511598
    },
    {
      "date": "2024-08-05",
      "macdLine": -23.69978495993405,
      "signalLine": -6.117224085996089
    },
    {
      "date": "2024-08-06",
      "macdLine": -26.359429578554114,
      "signalLine": -10.165665184507695
    },
    {
      "date": "2024-08-07",
      "macdLine": -24.951921179141777,
      "signalLine": -13.12291638343451
    },
    {
      "date": "2024-08-08",
      "macdLine": -25.47934996958338,
      "signalLine": -15.594203100664284
    },
    {
      "date": "2024-08-09",
      "macdLine": -22.570875660446973,
      "signalLine": -16.989537612620822
    }
  ]
}

```


---

### Technical RSI BETA

取得特定股票在指定時間範圍內的相對強弱指標 (RSI)

```text
GET  /technical/rsi/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name          | Type   | Description                                                                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `symbol`\*    | string | 股票代碼                                                                                                                         |
| `from`\*      | string | 開始日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `to`\*        | string | 結束日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `timeframe`\* | string | Ｋ線週期，可選 `1` 1分Ｋ；`3` 3分Ｋ；`5` 5分Ｋ；`10` 10分Ｋ；`15` 15分Ｋ；`30` 30分Ｋ；`60` 60分Ｋ；`D` 日Ｋ；`W` 週Ｋ；`M` 月Ｋ |
| `period`\*    | number | RSI 週期                                                                                                                         |

caution

目前分Ｋ無法指定開始日期（from） 與 結束日期（to），一律回傳近 30 日資料。

#### Response[​](#response "Direct link to Response")

| Name             | Type      | Description |
| ---------------- | --------- | ----------- |
| `symbol`\*       | string    | 股票代號    |
| `from`\*         | string    | 開始日期    |
| `to`\*           | string    | 結束日期    |
| `timeframe`\*    | string    | Ｋ線週期    |
| `period`\*       | number    | RSI 週期    |
| `data`\*         | object\[] | RSI 資料    |
| `data[0].date`\* | string    | 資料時間    |
| `data[0].rsi`\*  | number    | RSI         |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/technical/rsi/2330?from=2024-08-01&to=2024-08-10&timeframe=D&period=6' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client

stock.technical.rsi(**{"symbol": "2330", "from": "2024-08-01", "to": "2024-08-10","timeframe":"D", "period": 6})

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.technical.rsi({ symbol: '2330', from: '2024-08-01', to: '2024-08-10', timeframe: 'D', period: 6})
  .then(data => console.log(data));

```

Response Body：

```json
{
  "symbol": "2330",
  "from": "2024-08-01",
  "to": "2024-08-10",
  "timeframe": "D",
  "period": 6,
  "data": [
    {
      "date": "2024-08-01",
      "rsi": 41.44144144144145
    },
    {
      "date": "2024-08-02",
      "rsi": 25.641025641025635
    },
    {
      "date": "2024-08-05",
      "rsi": 15.026786880961723
    },
    {
      "date": "2024-08-06",
      "rsi": 37.83577095879935
    },
    {
      "date": "2024-08-07",
      "rsi": 48.119604933543954
    },
    {
      "date": "2024-08-08",
      "rsi": 42.99811400274545
    },
    {
      "date": "2024-08-09",
      "rsi": 52.58621466649552
    }
  ]
}


```


---

### Technical SMA BETA

取得特定股票在指定時間範圍內的簡單移動平均 (SMA)

```text
GET  /technical/sma/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name          | Type   | Description                                                                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `symbol`\*    | string | 股票代碼                                                                                                                         |
| `from`\*      | string | 開始日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `to`\*        | string | 結束日期（格式：`yyyy-MM-dd`）                                                                                                   |
| `timeframe`\* | string | Ｋ線週期，可選 `1` 1分Ｋ；`3` 3分Ｋ；`5` 5分Ｋ；`10` 10分Ｋ；`15` 15分Ｋ；`30` 30分Ｋ；`60` 60分Ｋ；`D` 日Ｋ；`W` 週Ｋ；`M` 月Ｋ |
| `period`\*    | number | SMA 週期                                                                                                                         |

caution

目前分Ｋ無法指定開始日期（from） 與 結束日期（to），一律回傳近 30 日資料。

#### Response[​](#response "Direct link to Response")

| Name             | Type      | Description |
| ---------------- | --------- | ----------- |
| `symbol`\*       | string    | 股票代號    |
| `from`\*         | string    | 開始日期    |
| `to`\*           | string    | 結束日期    |
| `timeframe`\*    | string    | Ｋ線週期    |
| `period`\*       | number    | SMA 週期    |
| `data`\*         | object\[] | SMA 資料    |
| `data[0].date`\* | string    | 資料時間    |
| `data[0].sma`\*  | number    | SMA         |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/stock/technical/sma/2330?from=2024-08-01&to=2024-08-10&timeframe=D&period=5' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')  # 輸入您的 API key
stock = client.stock  # Stock REST API client

stock.technical.sma(**{"symbol": "2330", "from": "2024-08-01", "to": "2024-08-10","timeframe":"D", "period": 5})

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
client.stock.technical.sma({ symbol: '2330', from: '2024-08-01', to: '2024-08-10', timeframe: 'D', period: 5})
  .then(data => console.log(data));

```

Response Body：

```json
{
  "symbol": "2330",
  "from": "2024-08-01",
  "to": "2024-08-10",
  "timeframe": "D",
  "period": 5,
  "data": [
    {
      "date": "2024-08-01",
      "sma": 940.4
    },
    {
      "date": "2024-08-02",
      "sma": 936.2
    },
    {
      "date": "2024-08-05",
      "sma": 910.4
    },
    {
      "date": "2024-08-06",
      "sma": 898.4
    },
    {
      "date": "2024-08-07",
      "sma": 895.6
    },
    {
      "date": "2024-08-08",
      "sma": 882.8
    },
    {
      "date": "2024-08-09",
      "sma": 889
    }
  ]
}


```


---

### 富果行情 API v1.0

富果行情 API 是由時報資訊與 [Fugle](https://www.fugle.tw/) 技術團隊開發提供。<br /><!-- -->即時行情資料來源為臺灣證券交易所、證券櫃檯買賣中心、臺灣期貨交易所。請您詳閱相關使用[規範與聲明](#statement)。

#### REST API[​](#rest-api "Direct link to REST API")

富果行情 [REST API](https://developer.fugle.tw/docs/data/http-api/getting-started.md) 提供開發者友善的 Web API 服務。您可以查詢台股的日內行情、行情快照與歷史行情等數據。

#### WebSocket API[​](#websocket-api "Direct link to WebSocket API")

富果行情 [WebSocket API](https://developer.fugle.tw/docs/data/websocket-api/getting-started.md) 提供台股即時行情服務。透過 WebSocket API 可以滿足您想要接收即時行情的需求。

#### 官方函式庫[​](#官方函式庫 "Direct link to 官方函式庫")

您可以使用富果提供函式庫，以簡化使用行情 API 的方式。

| Language | URL                                                                             |
| -------- | ------------------------------------------------------------------------------- |
| Node.js  | [fugle-marketdata-node](https://github.com/fugle-dev/fugle-marketdata-node)     |
| Python   | [fugle-marketdata-python](https://github.com/fugle-dev/fugle-marketdata-python) |

#### 使用規範與聲明[​](#statement "Direct link to 使用規範與聲明")

* 為維護服務品質與公平性，每位使用者僅限申請及使用一個帳號。使用者不得以任何方式（包括但不限於註冊多個帳號、使用虛假身份或借用他人身份）規避本服務所設定之任何使用限制，特別是針對免費行情之取得。如經發現使用者有違反本規範之行為，本服務有權不經通知終止其所有相關帳號之使用權限，並保留追究相關責任的權利。
* 透過本服務取得之行情資料僅供參考，成交值及成交量不含零股及鉅額交易，使用者依本資料交易發生交易損失需自行負責。
* 時報資訊與群馥科技對資料內容錯誤、更新延誤或傳輸中斷不負任何責任。您應對您所為之任何金融或投資決策自行負責。
* 使用者應遵守[臺灣證券交易所股份有限公司交易資訊使用管理辦法](http://www.selaw.com.tw/LawArticle.aspx?LawID=G0100124)、[臺灣期貨交易所股份有限公司交易資訊使用管理辦法](http://www.selaw.com.tw/LawArticle.aspx?LawID=G0101422)、[財團法人中華民國證券櫃檯買賣中心有價證券交易資訊使用管理辦法](http://www.selaw.com.tw/LawArticle.aspx?LawID=G0100766)、各資訊來源提供者所定之資訊使用相關規範及智慧財產權相關法令，如有盜接、轉接交易資訊，或以其他方式出售、出租、轉讓、再授權交易資訊，或將交易資訊另行取樣並編製指數、其他衍生性商品或將之傳送予第三人，應負違約及侵權之相關民、刑事責任。
* 使用者須遵守臺灣證券交易所「[交易資訊使用管理辦法](https://www.twse.com.tw/downloads/zh/products/regulation_use.pdf)」等交易資訊管理相關規定，所有資訊以臺灣證券交易所公告資料為準。


---

### 版本遷移指南

本文件將引導您將現有的行情 API v0.3 版本升級至最新的 v1.0 版本。

#### 主要差異[​](#主要差異 "Direct link to 主要差異")

##### 行情 v0.3 API[​](#行情-v03-api "Direct link to 行情 v0.3 API")

API 端點：

* GET `/realtime/v0.3/intraday/meta` - 取得 個股/指數 當日基本資訊
* GET `/realtime/v0.3/intraday/quote` - 取得 個股/指數 逐筆交易金額、狀態、統計資訊
* GET `/realtime/v0.3/intraday/chart` - 個股/指數 線圖時所需的各項即時資訊
* GET `/realtime/v0.3/intraday/dealts` - 取得個股當日所有成交資訊
* GET `/realtime/v0.3/intraday/volumes` - 提供盤中個股即時分價量

其中，**Meta**、**Quote**、**Chart** 提供 WebSocket 介面，使用者可以即時接收行情資料。

##### 行情 v1.0 API[​](#行情-v10-api "Direct link to 行情 v1.0 API")

在 v1.0 版本中，目前提供股票行情，URL 位址如下：

```text
https://api.fugle.tw/marketdata/v1.0/stock/

```

API 端點：

* GET `/intraday/tickers` - 股票或指數列表（依條件查詢）
* GET `/intraday/ticker/{symbol}` - 股票基本資料（依代碼查詢）
* GET `/intraday/quote/{symbol}` - 股票即時報價（依代碼查詢）
* GET `/intraday/candles/{symbol}` - 股票價格Ｋ線（依代碼查詢）
* GET `/intraday/trades/{symbol}` - 股票成交明細（依代碼查詢）
* GET `/intraday/volumes/{symbol}` - 股票分價量表（依代碼查詢）
* GET `/snapshot/quotes/{market}` - 股票行情快照（依市場別）
* GET `/snapshot/movers/{market}` - 股票漲跌幅排行（依市場別）
* GET `/snapshot/actives/{market}` - 股票成交量值排行（依市場別）
* GET `/historical/candles/{symbol}` - 取得 1 年內歷史股價（依代碼查詢）
* GET `/historical/stats/{symbol}` - 取得近 52 週股價數據（依代碼查詢）

在 v1.0 版本中，WebSocket API 採用訂閱頻道機制，您可以現在透過 WebSocket 連線管理訂閱，接收特定股票及指數的行情資訊。WebSocket 連線位址如下：

```text
wss://api.fugle.tw/marketdata/v1.0/stock/streaming

```

WebSocket API v1.0 提供以下頻道類型可供訂閱：

* `trades` - 接收訂閱股票最新成交資訊
* `candles` - 接收訂閱股票最新分鐘Ｋ
* `books` - 接收訂閱股票最新最佳五檔委買委賣資訊
* `aggregates` - 接收訂閱股票聚合數據的行情資訊

#### 遷移流程[​](#遷移流程 "Direct link to 遷移流程")

##### 身份驗證[​](#身份驗證 "Direct link to 身份驗證")

在行情 API v1.0 版本中，我們採用了不同的身份驗證方式，因此 v0.3 的 API 金鑰將無法適用於 v1.0 的 HTTP API 和 WebSocket API。您需要重新申請 API 金鑰以使用最新版本的 API。請前往 [金鑰申請頁面](https://developer.fugle.tw/docs/key/) 進行申請。

富果行情 API v1.0 版本使用 API 金鑰進行用戶身份驗證。請在發送 API 請求時，加入以下的 HTTP 標頭（Header）：

```text
X-API-KEY: <YOUR_API_KEY>

```

若使用 WebSocket API，請在建立 WebSocket 連線後，傳送以下訊息進行 API 金鑰驗證以獲得訂閱各項頻道的授權：

```json
{
  "event": "auth",
  "data": {
    "apikey": "<API_KEY>"
  }
}

```

##### 版本資料對應[​](#版本資料對應 "Direct link to 版本資料對應")

行情 v1.0 版本提供了更豐富的市場資料。根據資料性質，在 v0.3 版本的基礎上，可以做以下對應轉換：

v0.3 的 Meta 對應到 v1.0 的 Ticker v0.3 的 Quote 對應到 v1.0 的 Quote v0.3 的 Chart 對應到 v1.0 的 Candles v0.3 的 Dealts 對應到 v1.0 的 Trades v0.3 的 Volumes 對應到 v1.0 的 Volumes

詳細內容請參考 [資料欄位對照表](https://developer.fugle.tw/docs/data/migration-guide.md#api-%E8%B3%87%E6%96%99%E6%AC%84%E4%BD%8D%E5%B0%8D%E7%85%A7%E8%A1%A8) 。

##### 資料欄位對照表[​](#資料欄位對照表 "Direct link to 資料欄位對照表")

**v0.3 Meta／v1.0 Ticker**

| v0.3 Meta                     | v1.0 Ticker                   | 備註                                                      |
| ----------------------------- | ----------------------------- | --------------------------------------------------------- |
| `info.date`                   | `date`                        |                                                           |
| `info.type`                   | `type`                        |                                                           |
| `info.exchange`               | `exchange`                    |                                                           |
| `info.market`                 | `market`                      |                                                           |
| `info.symbolId`               | `symbol`                      |                                                           |
| `info.countryCode`            | -                             | 移除                                                      |
| `info.timeZone`               | -                             | 移除                                                      |
| `info.lastUpdatedAt`          | -                             | 移除                                                      |
| `meta.market`                 | `market`                      |                                                           |
| `meta.nameZhTw`               | `name`                        |                                                           |
| `meta.industryZhTw`           | `industry`                    | 改為產業代碼                                              |
| `meta.previousClose`          | `previousClose`               |                                                           |
| `meta.priceReference`         | `referencePrice`              |                                                           |
| `meta.priceHighLimit`         | `limitUpPrice`                |                                                           |
| `meta.priceLowLimit`          | `limitDownPrice`              |                                                           |
| `meta.canDayBuySell`          | `canBuyDayTrade`              | 先買現沖                                                  |
| `meta.canDaySellBuy`          | `canDayTrade`                 | 買賣現沖                                                  |
| `meta.canShortMargin`         | `canBelowFlatMarginShortSell` | 平盤下得融券賣出                                          |
| `meta.canShortLend`           | `canBelowFlatSBLShortSell`    | 平盤下得借券賣出                                          |
| `meta.tradingUnit`            | `boardLot`                    |                                                           |
| `meta.currency`               | `tradingCurrency`             |                                                           |
| `meta.isTerminated`           | -                             | 以 `securityStatus` 取代                                  |
| `meta.isSuspended`            | -                             | 以 `securityStatus` 取代                                  |
| `meta.typeZhTw`               | `securityType`                |                                                           |
| `meta.abnormal`               | -                             | 以 `isAttention`, `isDispostion` 取代                     |
| -                             | `isAttention`                 | 注意股                                                    |
| -                             | `isDisposition`               | 處置股                                                    |
| `meta.isUnusuallyRecommended` | `isUnusuallyRecommended`      | 異常推介個股                                              |
| `meta.isNewlyCompiled`        | -                             | 新編指數                                                  |
| -                             | `isSpecificAbnormally`        | 特殊異常個股                                              |
| -                             | `securityStatus`              | 證券狀態，分別有 `NORMAL`, `TERMINATED`, `SUSPENDED` 狀態 |
| -                             | `exercisePrice`               | 權證履約價格                                              |
| -                             | `exercisedVolume`             | 權證前一營業日履約數量                                    |
| -                             | `cancelledVolume`             | 權證前一營業日註銷數量                                    |
| -                             | `remainingVolume`             | 權證發行餘額量                                            |
| -                             | `exerciseRatio`               | 權證行使比率                                              |
| -                             | `knockInPrice`                | 權證上限價格                                              |
| -                             | `knockOutPrice`               | 權證下限價格                                              |
| -                             | `maturityDate`                | 權證到期日                                                |
| `meta.priceReference`         | -                             | 指數參考價，以 `previousClose` 取代                       |
| -                             | `previousClose`               | 指數前次收盤價                                            |
| -                             | `openTime`                    | 指數開盤時間                                              |
| -                             | `closeTime`                   | 指數收盤時間                                              |

**v0.3 Quote／v1.0 Quote**

| v0.3 Quote                     | v1.0 Quote               | 備註                          |
| ------------------------------ | ------------------------ | ----------------------------- |
| `info.date`                    | `date`                   |                               |
| `info.type`                    | `type`                   |                               |
| `info.exchange`                | `exchange`               |                               |
| `info.market`                  | `market`                 |                               |
| `info.symbolId`                | `symbol`                 |                               |
| `info.countryCode`             | -                        | 移除                          |
| `info.timeZone`                | -                        | 移除                          |
| `info.lastUpdatedAt`           | `lastUpdated`            | 改為 timestamp 格式           |
| `quote.isCurbing`              | -                        | 移除                          |
| `quote.isCurbingFall`          | -                        | 以 `isLimitDownHalt` 取代     |
| `quote.isCurbingRise`          | -                        | 以 `isLimitUpHalt` 取代       |
| `quote.isTrial`                | `isTrial`                |                               |
| `quote.isOpenDelayed`          | `isDelayedOpen`          |                               |
| `quote.isCloseDelayed`         | `isDelayedClose`         |                               |
| -                              | `isContinuous`           | 是否為逐筆交易                |
| -                              | `isOpen`                 | 是否為開盤 tick               |
| -                              | `isClose`                | 是否為收盤 tick               |
| `quote.isHalting`              | `tradingHalt.isHalted`   | 暫停交易                      |
| -                              | `tradingHalt.time`       | 暫停/恢復交易時間             |
| `quote.isDealt`                | -                        | `lastTrade.serial === serial` |
| `quote.isClosed`               | -                        | 參照 `isClose`                |
| `quote.total.at`               | `total.time`             | 改為 timestamp 格式           |
| `quote.total.transaction`      | `total.transaction`      |                               |
| `quote.total.tradeValue`       | `total.tradeValue`       |                               |
| `quote.total.tradeVolume`      | `total.tradeVolume`      |                               |
| `quote.total.tradeVolumeAtBid` | `total.tradeVolumeAtBid` |                               |
| `quote.total.tradeVolumeAtAsk` | `total.tradeVolumeAtAsk` |                               |
| `quote.total.bidOrders`        | `total.bidOrders`        | 大盤總委買筆數                |
| `quote.total.askOrders`        | `total.askOrders`        | 大盤總委賣筆數                |
| `quote.total.bidVolume`        | `total.bidVolume`        | 大盤總委買數量                |
| `quote.total.askVolume`        | `total.askVolume`        | 大盤總委賣數量                |
| `quote.total.serial`           | -                        | 移除                          |
| `quote.trial.at`               | `lastTrial.time`         | 改為 timestamp 格式           |
| `quote.trial.bid`              | `lastTrial.bid`          |                               |
| `quote.trial.ask`              | `lastTrial.ask`          |                               |
| `quote.trial.price`            | `lastTrial.price`        |                               |
| `quote.trial.volume`           | `lastTrial.size`         |                               |
| `quote.trial.serial`           | `lastTrial.serial`       |                               |
| `quote.trade.at`               | `lastTrade.time`         | 改為 timestamp 格式           |
| `quote.trade.bid`              | `lastTrade.bid`          |                               |
| `quote.trade.ask`              | `lastTrade.ask`          |                               |
| `quote.trade.price`            | `lastTrade.price`        |                               |
| `quote.trade.volume`           | `lastTrade.size`         |                               |
| `quote.trade.serial`           | `lastTrade.serial`       |                               |
| -                              | `lastPrice`              | 最近成交(試撮)價              |
| -                              | `lastSize`               | 最近成交(試撮)單量            |
| `quote.order.bids`             | `bids`                   | `volume` 改 `size`            |
| `quote.order.asks`             | `asks`                   | `volume` 改 `size`            |
| `quote.order.at`               | -                        | 參照 `lastUpdated`            |
| `quote.priceHigh.price`        | `highPrice`              |                               |
| `quote.priceHigh.at`           | `highTime`               | 改為 timestamp 格式           |
| `quote.priceLow.price`         | `lowPrice`               |                               |
| `quote.priceLow.at`            | `lowTime`                | 改為 timestamp 格式           |
| `quote.priceOpen.price`        | `openPrice`              |                               |
| `quote.priceOpen.at`           | `openTime`               | 改為 timestamp 格式           |
| `quote.priceAvg.price`         | `avgPrice`               |                               |
| `quote.priceAvg.at`            | -                        |                               |
| `quote.change`                 | `change`                 |                               |
| `quote.changePercent`          | `changePercent`          |                               |
| `quote.amplitude`              | `amplitude`              |                               |
| `quote.priceLimit`             | -                        |                               |
| -                              | `isLimitDownPrice`       | 最近成交價為跌停價            |
| -                              | `isLimitUpPrice`         | 最近成交價為漲停價            |
| -                              | `isLimitDownBid`         | 最佳一檔委買跌停價            |
| -                              | `isLimitUpBid`           | 最佳一檔委買漲停價            |
| -                              | `isLimitDownAsk`         | 最佳一檔委賣跌停價            |
| -                              | `isLimitUpAsk`           | 最佳一檔委賣漲停價            |
| -                              | `isLimitDownHalt`        | 暫緩撮合且瞬間趨跌            |
| -                              | `isLimitUpHalt`          | 暫緩撮合且瞬間趨漲            |
| -                              | `serial`                 |                               |

**v0.3 Chart／v1.0 Candles**

caution

v1.0 版本調整了Ｋ線的起迄時間設定。以分鐘Ｋ為例，`09:00:00 ~ 9:00:59` 這段時間的成交價格，在原 v0.3 Chart 計算在 `09:01`；v1.0 Candles 則計入 `09:00`。

| v0.3 Chart           | v1.0 Candles      | 備註               |
| -------------------- | ----------------- | ------------------ |
| `info.date`          | `date`            |                    |
| `info.type`          | `type`            |                    |
| `info.exchange`      | `exchange`        |                    |
| `info.market`        | `market`          |                    |
| `info.symbolId`      | `symbol`          |                    |
| `info.countryCode`   | -                 | 移除               |
| `info.timeZone`      | -                 | 移除               |
| `info.lastUpdatedAt` | -                 | 移除               |
| -                    | `timeframe`       | Ｋ線週期           |
| `chart`              | `data`            |                    |
| `chart.t[0]`         | `data[0].date`    | 改為 ISO 8601 格式 |
| `chart.o[0]`         | `data[0].open`    |                    |
| `chart.h[0]`         | `data[0].high`    |                    |
| `chart.l[0]`         | `data[0].low`     |                    |
| `chart.c[0]`         | `data[0].close`   |                    |
| `chart.a[0]`         | `data[0].average` |                    |
| `chart.v[0]`         | `data[0].volume`  |                    |

**Dealts / Trades**

| v0.3 Dealts        | v1.0 Trades      | Note     |
| ------------------ | ---------------- | -------- |
| `info.date`        | `date`           |          |
| `info.type`        | `type`           |          |
| `info.exchange`    | `exchange`       |          |
| `info.market`      | `market`         |          |
| `info.symbolId`    | `symbol`         |          |
| `info.countryCode` | -                | 移除     |
| `info.timeZone`    | -                | 移除     |
| `dealts[0].at`     | `data[0].time`   |          |
| `dealts[0].bid`    | `data[0].bid`    |          |
| `dealts[0].ask`    | `data[0].ask`    |          |
| `dealts[0].price`  | `data[0].price`  |          |
| `dealts[0].volume` | `data[0].size`   |          |
| `dealts[0].serial` | `data[0].serial` |          |
| -                  | `data[0].volume` | 成交總量 |

**Volumes / Volumes**

| v0.3 Dealts          | v1.0 Trades | 備註 |
| -------------------- | ----------- | ---- |
| `info.date`          | `date`      |      |
| `info.type`          | `type`      |      |
| `info.exchange`      | `exchange`  |      |
| `info.market`        | `market`    |      |
| `info.symbolId`      | `symbol`    |      |
| `info.countryCode`   | -           | 移除 |
| `info.timeZone`      | -           | 移除 |
| `info.lastUpdatedAt` | -           | 移除 |
| `volumes`            | `data`      |      |


---

### 服務狀態

* #### Stock - Intraday Tickers

  URL: <!-- -->/v1.0/stock/intraday/tickers

  unknow

* #### Stock - Intraday Ticker

  URL: <!-- -->/v1.0/stock/intraday/ticker/0050

  unknow

* #### Stock - Intraday Quote

  URL: <!-- -->/v1.0/stock/intraday/quote/0050

  unknow

* #### Stock - Intraday Candles

  URL: <!-- -->/v1.0/stock/intraday/candles/0050

  unknow

* #### Stock - Intraday Trades

  URL: <!-- -->/v1.0/stock/intraday/trades/0050

  unknow

* #### Stock - Intraday Volumes

  URL: <!-- -->/v1.0/stock/intraday/volumes/0050

  unknow

* #### Stock - Snapshot Quotes

  URL: <!-- -->/v1.0/stock/snapshot/quotes/TSE

  unknow

* #### Stock - Snapshot Movers

  URL: <!-- -->/v1.0/stock/snapshot/movers/OTC?direction=up\&change=percent

  unknow

* #### Stock - Snapshot Actives

  URL: <!-- -->/v1.0/stock/snapshot/actives/OTC?trade=volume

  unknow

* #### Stock - Historical Candles

  URL: <!-- -->/v1.0/stock/historical/candles/0050

  unknow

* #### Stock - Historical Stats

  URL: <!-- -->/v1.0/stock/historical/stats/0050

  unknow

- #### Stock - WebSocket

  URL: <!-- -->/v1.0/stock/streaming

  unknow


---

### 開始使用

富果行情 WebSocket API 提供台股即時行情服務。透過 WebSocket API 可以滿足您想要接收即時行情的需求。

#### 建立連線[​](#建立連線 "Direct link to 建立連線")

您可以透過以下位置向富果行情 WebSocket API server 建立連線：

```text
wss://api.fugle.tw/marketdata/v1.0/stock/streaming

```

#### 身份驗證[​](#身份驗證 "Direct link to 身份驗證")

建立 WebSocket 連線後，請使用 API 金鑰進行身份驗證，以獲授權訂閱各項頻道：

```json
{
  "event": "auth",
  "data": {
    "apikey": "<API_KEY>"
  }
}

```

當驗證成功後，會收到以下訊息：

```json
{
  "event": "authenticated",
  "data": {
    "message": "Authenticated successfully"
  }
}

```

若驗證失敗，則收到以下訊息：

```json
{
  "event": "error",
  "data": {
    "message": "Invalid authentication credentials"
  }
}

```

#### Heartbeat[​](#heartbeat "Direct link to Heartbeat")

每隔 30 秒 WebSocket server 會送出一個 heartbeat 訊息：

```json
{
  "event": "heartbeat",
  "data": {
    "time": "<Timestamp>"
  }
}

```

#### Ping/Pong[​](#pingpong "Direct link to Ping/Pong")

將以下 JSON 格式訊息發送到 WebSocket Server (`state` 為可選)：

```json
{
  "event": "ping",
  "data": {
    "state": "<ANY>"
  }
}

```

WebSocket Server 會回應以下訊息 (若 ping 未送 `state` 則不會有該欄位)：

```json
{
  "event": "pong",
  "data": {
    "time": "<TIMESTAMP>",
    "state": "<ANY>"
  }
}

```

#### Channels[​](#channels "Direct link to Channels")

富果行情 WebSocket API 目前提供以下可訂閱頻道：

* `trades` - [接收訂閱股票最新成交資訊](https://developer.fugle.tw/docs/data/websocket-api/market-data-channels/trades.md)
* `candles` - [接收訂閱股票最新分鐘Ｋ](https://developer.fugle.tw/docs/data/websocket-api/market-data-channels/candles.md)
* `books` - [接收訂閱股票最新最佳五檔委買委賣資訊](https://developer.fugle.tw/docs/data/websocket-api/market-data-channels/books.md)
* `aggregates` - [接收訂閱股票聚合數據的行情資訊](https://developer.fugle.tw/docs/data/websocket-api/market-data-channels/aggregates.md)
* `indices` - [接收訂閱股票最新指數行情資料](https://developer.fugle.tw/docs/data/websocket-api/market-data-channels/indices.md)

##### 訂閱頻道[​](#訂閱頻道 "Direct link to 訂閱頻道")

要訂閱一個頻道 JSON 格式訊息發送到 WebSocket Server：

```json
{
  "event": "subscribe",
  "data": {
    "channel": "<CHANNEL_NAME>",
    "symbol": "<SYMBOL_ID>"
  }
}

```

> 在 `data` 指定 `"intradayOddLot": true` 可訂閱盤中零股行情。

訂閱成功後，會收到以下事件回應：

```json
{
  "event": "subscribed",
  "data": {
    "id": "<CHANNEL_ID>",
    "channel": "<CHANNEL_NAME>",
    "symbol": "<SYMBOL_ID>"
  }
}

```

支援訂閱同頻道的多檔股票：

```json
{
  "event": "subscribe",
  "data": {
    "channel": "<CHANNEL_NAME>",
    "symbols": ["<SYMBOL_ID_1>", "<SYMBOL_ID_2>"]
  }
}

```

訂閱成功後，會收到以下事件回應：

```json
{
  "event": "subscribed",
  "data": [
    {
      "id": "<CHANNEL_ID>",
      "channel": "<CHANNEL_NAME>",
      "symbol": "<SYMBOL_ID_1>"
    },
    {
      "id": "<CHANNEL_ID>",
      "channel": "<CHANNEL_NAME>",
      "symbol": "<SYMBOL_ID_2>"
    }
  ]
}

```

##### 取消訂閱[​](#取消訂閱 "Direct link to 取消訂閱")

要取消已訂閱頻道，請將以下 JSON 格式訊息發送到 WebSocket Server：

```json
{
  "event": "unsubscribe",
  "data": {
    "id": "<CHANNEL_ID>"
  }
}

```

取消訂閱成功後，會收到以下事件回應：

```json
{
  "event": "unsubscribed",
  "data": {
    "id": "<CHANNEL_ID>"
  }
}

```

支援取消訂閱多個頻道：

```json
{
  "event": "unsubscribe",
  "data": {
    "ids": ["<CHANNEL_ID_1>", "<CHANNEL_ID_2>"]
  }
}

```

取消訂閱成功後，會收到以下事件回應：

```json
{
  "event": "unsubscribed",
  "data": [
    {
      "id": "<CHANNEL_ID_1>"
    },
    {
      "id": "<CHANNEL_ID_2>"
    }
  ]
}

```

##### 訂閱資訊[​](#訂閱資訊 "Direct link to 訂閱資訊")

要取得已訂閱的頻道，請將以下 JSON 格式訊息發送到 WebSocket Server：

```json
{
  "event": "subscriptions"
}

```

然後會收到以下事件回應：

```json
{
  "event": "subscriptions",
  "data": [
    {
      "id": "<CHANNEL_ID>",
      "channel": "<CHANNEL_NAME>",
      "symbol": "<SYMBOL_ID>"
    }
  ]
}

```

#### 快速開始[​](#快速開始 "Direct link to 快速開始")

以下是一個在瀏覽器環境下，建立 WebSocket 連線、身份驗證以及訂閱頻道接收即時行情的範例：

```js
const socket = new WebSocket('wss://api.fugle.tw/marketdata/v1.0/stock/streaming');

socket.onopen = () => {
  socket.send(
    JSON.stringify({
      event: 'auth',
        data: {
          apikey: '<API_KEY>',
      },
    }),
  );

  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);

    if (data.event === 'authenticated') {
      socket.send(
        JSON.stringify({
          event: 'subscribe',
          data: {
            channel: 'trades',
            symbol: '2330',
          },
        }),
      );
    }

    console.log(data);
  };
};

```

#### 使用 SDK[​](#使用-sdk "Direct link to 使用 SDK")

富果行情 WebSocket API 提供 Python 與 Node.js SDK。您可以透過以下範例存取 WebSocket API：

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(f'message: {message}')

def handle_connect():
    print('connected')

def handle_disconnect(code, message):
    print(f'disconnect: {code}, {message}')

def handle_error(error):
    print(f'error: {error}')

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    stock = client.stock
    stock.on("connect", handle_connect)
    stock.on("message", handle_message)
    stock.on("disconnect", handle_disconnect)
    stock.on("error", handle_error)
    stock.connect()
    stock.subscribe({
        "channel": 'trades',
        "symbol": '2330'
    })

if __name__ == "__main__":
    main()

```

```js
const { WebSocketClient } = require('@fugle/marketdata');

const client = new WebSocketClient({ apiKey: 'YOUR_API_KEY' });
const stock = client.stock;

// open the WebSocket connection and authenticate
stock.connect().then(() => {
  // subscribe the channel to receive streaming data
  stock.subscribe({ channel: 'trades', symbol: '2330' });
});

stock.on('message', (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```


---

### Aggregates

接收訂閱股票聚合數據的行情資訊

#### Parameters[​](#parameters "Direct link to Parameters")

| Name             | Type    | Description                                                     |
| ---------------- | ------- | --------------------------------------------------------------- |
| `channel`\*      | string  | 訂閱頻道：`trades`, `candles`, `books`, `aggregates`, `indices` |
| `symbol`\*       | string  | 股票代碼                                                        |
| `intradayOddLot` | boolean | `intradayOddLot` true: 盤中零股, false: 股票, default: false    |

#### Response[​](#response "Direct link to Response")

| Name                     | Type      | Description                  |
| ------------------------ | --------- | ---------------------------- |
| `date`\*                 | string    | 日期                         |
| `type`\*                 | string    | Ticker 類型                  |
| `exchange`\*             | string    | 交易所                       |
| `market`                 | string    | 市場別                       |
| `symbol`\*               | string    | 股票代碼                     |
| `name`\*                 | string    | 股票簡稱                     |
| `referencePrice`         | number    | 參考價                       |
| `previousClose`          | number    | 前一交易日收盤價             |
| `openPrice`              | number    | 開盤價                       |
| `openTime`               | number    | 開盤價成交時間               |
| `highPrice`              | number    | 最高價                       |
| `highTime`               | number    | 最高價成交時間               |
| `lowPrice`               | number    | 最低價                       |
| `lowTime`                | number    | 最低價成交時間               |
| `closePrice`             | number    | 收盤價（最後成交價）         |
| `closeTime`              | number    | 收盤價（最後成交價）成交時間 |
| `avgPrice`               | number    | 當日成交均價                 |
| `change`                 | number    | 最後一筆成交漲跌（含試撮）   |
| `changePercent`          | number    | 最後一筆成交漲跌幅（含試撮） |
| `amplitude`              | number    | 當日振幅                     |
| `lastPrice`              | number    | 最後一筆成交價（含試撮）     |
| `lastSize`               | number    | 最後一筆成交數量（含試撮）   |
| `bids`                   | object\[] | 最佳五檔委買                 |
| `bids[0].price`          | number    | 最佳五檔委買價格             |
| `bids[0].size`           | number    | 最佳五檔委買數量             |
| `asks`                   | object\[] | 最佳五檔委賣                 |
| `asks[0].price`          | number    | 最佳五檔委賣價格             |
| `asks[0].size`           | number    | 最佳五檔委賣數量             |
| `total`                  | object    | 統計資訊                     |
| `total.tradeValue`       | number    | 累計成交金額                 |
| `total.tradeVolume`      | number    | 累計成交量                   |
| `total.tradeVolumeAtBid` | number    | 累計內盤成交量               |
| `total.tradeVolumeAtAsk` | number    | 累計外盤成交量               |
| `total.transaction`      | number    | 累計成交筆數                 |
| `total.time`             | number    | 累計資訊時間                 |
| `lastTrade`              | object    | 最後一筆成交資訊             |
| `lastTrade.bid`          | number    | 最後一筆成交買價             |
| `lastTrade.ask`          | number    | 最後一筆成交賣價             |
| `lastTrade.price`        | number    | 最後一筆成交價格             |
| `lastTrade.size`         | number    | 最後一筆成交數量             |
| `lastTrade.time`         | number    | 最後一筆成交時間             |
| `lastTrial`              | object    | 最後一筆試撮資訊             |
| `lastTrial.bid`          | number    | 最後一筆試撮買價             |
| `lastTrial.ask`          | number    | 最後一筆試撮賣價             |
| `lastTrial.price`        | number    | 最後一筆試撮價格             |
| `lastTrial.size`         | number    | 最後一筆試撮數量             |
| `lastTrial.time`         | number    | 最後一筆試撮時間             |
| `isLimitDownPrice`       | boolean   | 最後成交價為跌停價：`true`   |
| `isLimitUpPrice`         | boolean   | 最後成交價為漲停價：`true`   |
| `isLimitDownBid`         | boolean   | 最佳一檔委買跌停價：`true`   |
| `isLimitUpBid`           | boolean   | 最佳一檔委買漲停價：`true`   |
| `isLimitDownAsk`         | boolean   | 最佳一檔委賣跌停價：`true`   |
| `isLimitUpAsk`           | boolean   | 最佳一檔委賣漲停價：`true`   |
| `isLimitDownHalt`        | boolean   | 暫緩撮合且瞬間趨跌：`true`   |
| `isLimitUpHalt`          | boolean   | 暫緩撮合且瞬間趨漲：`true`   |
| `isTrial`                | boolean   | 試撮階段：`true`             |
| `isDelayedOpen`          | boolean   | 延後開盤信號：`true`         |
| `isDelayedClose`         | boolean   | 延後收盤信號：`true`         |
| `isContinuous`           | boolean   | 最後成交為逐筆交易：`true`   |
| `isOpen`                 | boolean   | 開盤信號：`true`             |
| `isClose`                | boolean   | 收盤信號：`true`             |
| `lastUpdated`            | number    | 最後更新時間                 |

#### Example[​](#example "Direct link to Example")

##### Subscribe channel[​](#subscribe-channel "Direct link to Subscribe channel")

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(message)

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    stock = client.stock
    stock.on('message', handle_message)
    stock.connect()
    stock.subscribe({
        'channel': 'aggregates',
        'symbol': '2330'
    })

if __name__ == '__main__':
    main()

```

```js
const { WebSocketClient } = require("@fugle/marketdata");

const client = new WebSocketClient({ apiKey: "YOUR_API_KEY" });

const stock = client.stock;

stock.connect().then(() => {
  stock.subscribe({ channel: "aggregates", symbol: "0050" });
});

stock.on("message", (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```

##### Receive data[​](#receive-data "Direct link to Receive data")

```json
{
  "event": "data",
  "data": {
    "date": "2023-05-29",
    "type": "EQUITY",
    "exchange": "TWSE",
    "market": "TSE",
    "symbol": "2330",
    "name": "台積電",
    "referencePrice": 566,
    "previousClose": 566,
    "openPrice": 574,
    "openTime": 1685322000049353,
    "highPrice": 574,
    "highTime": 1685322000049353,
    "lowPrice": 564,
    "lowTime": 1685327142152580,
    "closePrice": 568,
    "closeTime": 1685338200000000,
    "avgPrice": 568.77,
    "change": 2,
    "changePercent": 0.35,
    "amplitude": 1.77,
    "lastPrice": 568,
    "lastSize": 4778,
    "bids": [
      {
        "price": 567,
        "size": 87
      },
      {
        "price": 566,
        "size": 2454
      },
      {
        "price": 565,
        "size": 611
      },
      {
        "price": 564,
        "size": 609
      },
      {
        "price": 563,
        "size": 636
      }
    ],
    "asks": [
      {
        "price": 568,
        "size": 800
      },
      {
        "price": 569,
        "size": 806
      },
      {
        "price": 570,
        "size": 3643
      },
      {
        "price": 571,
        "size": 1041
      },
      {
        "price": 572,
        "size": 2052
      }
    ],
    "total": {
      "tradeValue": 31019803000,
      "tradeVolume": 54538,
      "tradeVolumeAtBid": 19853,
      "tradeVolumeAtAsk": 27900,
      "transaction": 9530,
      "time": 1685338200000000
    },
    "lastTrade": {
      "bid": 567,
      "ask": 568,
      "price": 568,
      "size": 4778,
      "time": 1685338200000000,
      "serial": 6652422
    },
    "lastTrial": {
      "bid": 567,
      "ask": 568,
      "price": 568,
      "size": 4772,
      "time": 1685338196400347,
      "serial": 6651941
    },
    "isClose": true,
    "serial": 6652422,
    "lastUpdated": 1685338200000000
  },
  "id": "<CHANNEL_ID>",
  "channel": "aggregates"
}

```


---

### Books

接收訂閱股票最新最佳五檔委買委賣資訊

#### Parameters[​](#parameters "Direct link to Parameters")

| Name             | Type    | Description                                                     |
| ---------------- | ------- | --------------------------------------------------------------- |
| `channel`\*      | string  | 訂閱頻道：`trades`, `candles`, `books`, `aggregates`, `indices` |
| `symbol`\*       | string  | 股票代碼                                                        |
| `intradayOddLot` | boolean | `intradayOddLot` true: 盤中零股, false: 股票, default: false    |

#### Response[​](#response "Direct link to Response")

| Name            | Type      | Description      |
| --------------- | --------- | ---------------- |
| `symbol`\*      | string    | 股票代碼         |
| `type`\*        | string    | Ticker 類型      |
| `exchange`\*    | string    | 交易所           |
| `market`        | string    | 市場別           |
| `time`\*        | number    | 時間             |
| `bids`          | object\[] | 最佳五檔委買     |
| `bids[0].price` | number    | 最佳五檔委買價格 |
| `bids[0].size`  | number    | 最佳五檔委買數量 |
| `asks`          | object\[] | 最佳五檔委賣     |
| `asks[0].price` | number    | 最佳五檔委賣價格 |
| `asks[0].size`  | number    | 最佳五檔委賣數量 |

#### Example[​](#example "Direct link to Example")

##### Subscribe channel[​](#subscribe-channel "Direct link to Subscribe channel")

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(message)

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    stock = client.stock
    stock.on('message', handle_message)
    stock.connect()
    stock.subscribe({
        'channel': 'books',
        'symbol': '2330'
    })

if __name__ == '__main__':
    main()

```

```js
const { WebSocketClient } = require("@fugle/marketdata");

const client = new WebSocketClient({ apiKey: "YOUR_API_KEY" });

const stock = client.stock;

stock.connect().then(() => {
  stock.subscribe({ channel: "books", symbol: "2330" });
});

stock.on("message", (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```

##### Receive data[​](#receive-data "Direct link to Receive data")

```json
{
  "event": "data",
  "data": {
    "symbol": "2330",
    "type": "EQUITY",
    "exchange": "TWSE",
    "market": "TSE",
    "bids": [
      {
        "price": 567,
        "size": 87
      },
      {
        "price": 566,
        "size": 2454
      },
      {
        "price": 565,
        "size": 611
      },
      {
        "price": 564,
        "size": 609
      },
      {
        "price": 563,
        "size": 636
      }
    ],
    "asks": [
      {
        "price": 568,
        "size": 800
      },
      {
        "price": 569,
        "size": 806
      },
      {
        "price": 570,
        "size": 3643
      },
      {
        "price": 571,
        "size": 1041
      },
      {
        "price": 572,
        "size": 2052
      }
    ],
    "time": 1685338200000000
  },
  "id": "<CHANNEL_ID>",
  "channel": "books"
}

```


---

### Candles

接收訂閱股票最新分鐘Ｋ

#### Parameters[​](#parameters "Direct link to Parameters")

| Name             | Type    | Description                                                     |
| ---------------- | ------- | --------------------------------------------------------------- |
| `channel`\*      | string  | 訂閱頻道：`trades`, `candles`, `books`, `aggregates`, `indices` |
| `symbol`\*       | string  | 股票代碼                                                        |
| `intradayOddLot` | boolean | `intradayOddLot` true: 盤中零股, false: 股票, default: false    |

#### Response[​](#response "Direct link to Response")

| Name         | Type   | Description                                                                |
| ------------ | ------ | -------------------------------------------------------------------------- |
| `date`\*     | string | 日期                                                                       |
| `type`\*     | string | Ticker 類型                                                                |
| `exchange`\* | string | 交易所                                                                     |
| `market`     | string | 市場別                                                                     |
| `symbol`\*   | string | 股票代號                                                                   |
| `open`\*     | number | Ｋ線開盤價                                                                 |
| `high`\*     | number | Ｋ線最高價                                                                 |
| `low`\*      | number | Ｋ線最低價                                                                 |
| `close`\*    | number | Ｋ線收盤價                                                                 |
| `volume`\*   | number | Ｋ線成交量（整股：成交張數；興櫃股票及盤中零股：成交股數；指數：成交金額） |
| `average`\*  | number | 成交均價                                                                   |

#### Example[​](#example "Direct link to Example")

##### Subscribe channel[​](#subscribe-channel "Direct link to Subscribe channel")

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(message)

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    stock = client.stock
    stock.on('message', handle_message)
    stock.connect()
    stock.subscribe({
        'channel': 'candles',
        'symbol': '2330'
    })

if __name__ == '__main__':
    main()

```

```js
const { WebSocketClient } = require("@fugle/marketdata");

const client = new WebSocketClient({ apiKey: "YOUR_API_KEY" });

const stock = client.stock;

stock.connect().then(() => {
  stock.subscribe({ channel: "candles", symbol: "0050" });
});

stock.on("message", (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```

##### Receive data[​](#receive-data "Direct link to Receive data")

```json
{
  "event": "data",
  "data": {
    "symbol": "2330",
    "type": "EQUITY",
    "exchange": "TWSE",
    "market": "TSE",
    "date": "2023-05-29T13:30:00.000+08:00",
    "open": 568,
    "high": 568,
    "low": 568,
    "close": 568,
    "volume": 4778,
    "average": 568.77
  },
  "id": "<CHANNEL_ID>",
  "channel": "candles"
}

```


---

### Indices

接收訂閱股票最新指數行情資料

#### Example[​](#example "Direct link to Example")

##### Subscribe channel[​](#subscribe-channel "Direct link to Subscribe channel")

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(message)

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    stock = client.stock
    stock.on('message', handle_message)
    stock.connect()
    stock.subscribe({ 
        'channel': 'indices', 
        'symbol': 'IR0001'
    })

if __name__ == '__main__': 
    main()

```

```js
const { WebSocketClient } = require('@fugle/marketdata');

const client = new WebSocketClient({ apiKey: 'YOUR_API_KEY' });

const stock = client.stock;

stock.connect().then(() => {
  stock.subscribe({ channel: 'indices', symbol: 'IR0001' });
});

stock.on('message', (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```

##### Receive data[​](#receive-data "Direct link to Receive data")

```json
{
    "event": "data",
    "data": {
        "symbol": "IR0001",
        "type": "INDEX",
        "exchange": "TWSE",
        "index": 35276.44,
        "time": 1686114510000000
    },
    "id": "<CHANNEL_ID>",
    "channel": "indices"
}

```


---

### Trades

接收訂閱股票最新成交資訊

#### Parameters[​](#parameters "Direct link to Parameters")

| Name             | Type    | Description                                                     |
| ---------------- | ------- | --------------------------------------------------------------- |
| `channel`\*      | string  | 訂閱頻道：`trades`, `candles`, `books`, `aggregates`, `indices` |
| `symbol`\*       | string  | 股票代碼                                                        |
| `intradayOddLot` | boolean | `intradayOddLot` true: 盤中零股, false: 股票, default: false    |

#### Response[​](#response "Direct link to Response")

| Name               | Type    | Description                |
| ------------------ | ------- | -------------------------- |
| `symbol`\*         | string  | 股票代號                   |
| `type`\*           | string  | Ticker 類型                |
| `exchange`\*       | string  | 交易所                     |
| `market`           | string  | 市場別                     |
| `time`\*           | number  | 時間                       |
| `serial`\*         | number  | 流水號                     |
| `bid`              | number  | 成交買價                   |
| `ask`              | number  | 成交賣價                   |
| `price`            | number  | 成交價格                   |
| `size`             | number  | 成交單量                   |
| `volume`           | number  | 成交總量                   |
| `isLimitDownPrice` | boolean | 最後成交價為跌停價：`true` |
| `isLimitUpPrice`   | boolean | 最後成交價為漲停價：`true` |
| `isLimitDownBid`   | boolean | 最佳一檔委買跌停價：`true` |
| `isLimitUpBid`     | boolean | 最佳一檔委買漲停價：`true` |
| `isLimitDownAsk`   | boolean | 最佳一檔委賣跌停價：`true` |
| `isLimitUpAsk`     | boolean | 最佳一檔委賣漲停價：`true` |
| `isLimitDownHalt`  | boolean | 暫緩撮合且瞬間趨跌：`true` |
| `isLimitUpHalt`    | boolean | 暫緩撮合且瞬間趨漲：`true` |
| `isTrial`          | boolean | 試撮階段：`true`           |
| `isDelayedOpen`    | boolean | 延後開盤信號：`true`       |
| `isDelayedClose`   | boolean | 延後收盤信號：`true`       |
| `isContinuous`     | boolean | 最後成交為逐筆交易：`true` |
| `isOpen`           | boolean | 開盤信號：`true`           |
| `isClose`          | boolean | 收盤信號：`true`           |

#### Example[​](#example "Direct link to Example")

##### Subscribe channel[​](#subscribe-channel "Direct link to Subscribe channel")

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(message)

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    stock = client.stock
    stock.on('message', handle_message)
    stock.connect()
    stock.subscribe({
        'channel': 'trades',
        'symbol': '2330'
    })

if __name__ == '__main__':
    main()

```

```js
const { WebSocketClient } = require("@fugle/marketdata");

const client = new WebSocketClient({ apiKey: "YOUR_API_KEY" });

const stock = client.stock;

stock.connect().then(() => {
  stock.subscribe({ channel: "trades", symbol: "0050" });
});

stock.on("message", (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```

##### Receive data[​](#receive-data "Direct link to Receive data")

```json
{
  "event": "data",
  "data": {
    "symbol": "2330",
    "type": "EQUITY",
    "exchange": "TWSE",
    "market": "TSE",
    "bid": 567,
    "ask": 568,
    "price": 568,
    "size": 4778,
    "volume": 54538,
    "isClose": true,
    "time": 1685338200000000,
    "serial": 6652422
  },
  "id": "<CHANNEL_ID>",
  "channel": "trades"
}

```


---

### 開始使用 BETA

富果行情 REST API 提供開發者友善的 Web API 服務。您可以查詢台股期貨選擇權的日內行情與歷史行情等數據。

#### 身份驗證[​](#身份驗證 "Direct link to 身份驗證")

富果行情 API 透過 API 金鑰對用戶進行身份驗證（Authentication）。請在發送 API 請求時請加入以下 HTTP 標頭：

```text
X-API-KEY: <YOUR_API_KEY>

```

#### 速率限制[​](#速率限制 "Direct link to 速率限制")

如果您 API 請求超過了限制，將收到帶有狀態碼 `429` 的回應。

不同的 API 方案有不同的速率限制，關於速率限制，請參考 [行情方案及價格](https://developer.fugle.tw/docs/pricing.md) 的說明。

#### API 端點[​](#api-端點 "Direct link to API 端點")

富果行情 REST API 端點使用以下位置為前綴：

```text
https://api.fugle.tw/marketdata/v1.0/futopt/

```

富果行情 REST API 目前提供的端點如下：

* `/intraday/products` - [期權契約列表（依條件查詢）](https://developer.fugle.tw/docs/data-futopt/http-api/intraday/products.md)
* `/intraday/tickers` - [期權可交易商品列表（依條件查詢）](https://developer.fugle.tw/docs/data-futopt/http-api/intraday/tickers.md)
* `/intraday/ticker/{symbol}` - [期權基本資料（依代碼查詢）](https://developer.fugle.tw/docs/data-futopt/http-api/intraday/ticker.md)
* `/intraday/quote/{symbol}` - [期權即時報價（依代碼查詢）](https://developer.fugle.tw/docs/data-futopt/http-api/intraday/quote.md)
* `/intraday/candles/{symbol}` - [期權價格Ｋ線（依代碼查詢）](https://developer.fugle.tw/docs/data-futopt/http-api/intraday/candles.md)
* `/intraday/trades/{symbol}` - [期權成交明細（依代碼查詢）](https://developer.fugle.tw/docs/data-futopt/http-api/intraday/trades.md)
* `/intraday/volumes/{symbol}` - [期權分價量表（依代碼查詢）](https://developer.fugle.tw/docs/data-futopt/http-api/intraday/volumes.md)

#### 使用 SDK[​](#使用-sdk "Direct link to 使用 SDK")

富果行情 Web API 提供 Python 、 Node.js SDK 。您可以透過以下方式存取 API：

* Python
* Node.js

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
futopt = client.futopt

```

```js
const { RestClient } = require('@fugle/marketdata');

const client = new RestClient({ apiKey: 'YOUR_API_KEY' });
const futopt = client.futopt;

```


---

### Intraday Candles BETA

取得期權價格Ｋ線（依商品查詢）

```text
GET /intraday/candles/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name        | Type   | Description                                                                             |
| ----------- | ------ | --------------------------------------------------------------------------------------- |
| `symbol`\*  | string | 期權代碼                                                                                |
| `session`   | string | session 類型，可選 `afterhours` 夜盤                                                    |
| `timeframe` | string | Ｋ線週期，可選 `1` 1分Ｋ；`5` 5分Ｋ；`10` 10分Ｋ；`15` 15分Ｋ；`30` 30分Ｋ；`60` 60分Ｋ |

#### Response[​](#response "Direct link to Response")

| Name              | Type      | Description |
| ----------------- | --------- | ----------- |
| `date`\*          | string    | 日期        |
| `type`\*          | string    | Ticker 類型 |
| `exchange`\*      | string    | 交易所      |
| `market`          | string    | 市場別      |
| `symbol`\*        | string    | 期權代碼    |
| `timeframe`\*     | number    | Ｋ線週期    |
| `data`\*          | object\[] | Ｋ線資料    |
| `data[0].date`    | string    | Ｋ線時間    |
| `data[0].open`    | number    | Ｋ線開盤價  |
| `data[0].high`    | number    | Ｋ線最高價  |
| `data[0].low`     | number    | Ｋ線最低價  |
| `data[0].close`   | number    | Ｋ線收盤價  |
| `data[0].volume`  | number    | Ｋ線成交量  |
| `data[0].average` | number    | 成交均價    |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/candles/TXFC5?timeframe=30' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
futopt = client.futopt
futopt.intraday.candles(symbol='TXFC5', timeframe='30')

```

```js
const { RestClient } = require("@fugle/marketdata");

const client = new RestClient({ apiKey:"YOUR_API_KEY" });

client.futopt.intraday
  .candles({ symbol:"TXFC5", timeframe:"30" })
  .then((data) => console.log(data));

```

Response Body：

```json
{
  "date": "2024-06-18",
  "type": "FUTURE",
  "exchange": "TAIFEX",
  "symbol": "TXFC5",
  "timeframe": "30",
  "data": [
    {
      "date": "2024-06-18T08:30:00.000+08:00",
      "open": 22530,
      "high": 22530,
      "low": 22530,
      "close": 22530,
      "volume": 1,
      "average": 22530
    },
    {
      "date": "2024-06-18T09:00:00.000+08:00",
      "open": 22492,
      "high": 22492,
      "low": 22492,
      "close": 22492,
      "volume": 1,
      "average": 22511
    },
    {
      "date": "2024-06-18T10:00:00.000+08:00",
      "open": 22558,
      "high": 22558,
      "low": 22558,
      "close": 22558,
      "volume": 1,
      "average": 22526.67
    },
    {
      "date": "2024-06-18T10:30:00.000+08:00",
      "open": 22560,
      "high": 22560,
      "low": 22560,
      "close": 22560,
      "volume": 1,
      "average": 22535
    },
    {
      "date": "2024-06-18T11:00:00.000+08:00",
      "open": 22560,
      "high": 22576,
      "low": 22560,
      "close": 22576,
      "volume": 3,
      "average": 22548
    },
    {
      "date": "2024-06-18T11:30:00.000+08:00",
      "open": 22550,
      "high": 22550,
      "low": 22550,
      "close": 22550,
      "volume": 1,
      "average": 22548.25
    },
    {
      "date": "2024-06-18T12:00:00.000+08:00",
      "open": 22570,
      "high": 22570,
      "low": 22570,
      "close": 22570,
      "volume": 1,
      "average": 22550.67
    }
  ]
}


```


---

### Intraday Products BETA

取得期權契約清單（依條件查詢）

```text
GET /intraday/products

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name           | Type   | Description                                                                           |
| -------------- | ------ | ------------------------------------------------------------------------------------- |
| `type`\*       | string | 類型，可選 `FUTURE` 期貨 ； `OPTION` 選擇權                                           |
| `exchange`     | string | 交易所，可選 `TAIFEX` 臺灣期貨交易所                                                  |
| `session`      | string | 交易時段，可選 `REGULAR` 一般交易 或 `AFTERHOURS` 盤後交易                            |
| `contractType` | string | 契約類別，可選 `I` 指數類；`R` 利率類；`B` 債券類；`C` 商品類；`S` 股票類；`E` 匯率類 |
| `status`       | string | 契約狀態，可選 `N` 正常；`P` 暫停交易；`U` 即將上市                                   |

#### Response[​](#response "Direct link to Response")

| Name                       | Type      | Description                                  |
| -------------------------- | --------- | -------------------------------------------- |
| `type`\*                   | string    | 期權類型                                     |
| `exchange`                 | string    | 交易所                                       |
| `session`                  | string    | 交易時段                                     |
| `contractType`             | string    | 契約類別                                     |
| `status`                   | string    | 契約狀態                                     |
| `data`\*                   | object\[] | 契約列表                                     |
| `data[0].symbol`           | string    | 契約代碼                                     |
| `data[0].type`             | string    | 期權類型                                     |
| `data[0].name`             | string    | 契約名稱                                     |
| `data[0].underlyingSymbol` | string    | 股票現貨代號                                 |
| `data[0].contractType`     | string    | 契約類別                                     |
| `data[0].contractSize`     | string    | 契約乘數                                     |
| `data[0].statusCode`       | string    | 狀態碼                                       |
| `data[0].tradingCurrency`  | string    | 交易幣別                                     |
| `data[0].quoteAcceptable`  | boolean   | 是否可報價                                   |
| `data[0].startDate`        | string    | 上市日期                                     |
| `data[0].canBlockTrade`    | boolean   | 是否可鉅額交易                               |
| `data[0].expiryType`       | string    | 到期別，`S` 標準；`W` 週                     |
| `data[0].underlyingType`   | string    | 股票現貨類別，`E` ETF；`S` 個股              |
| `data[0].marketCloseGroup` | string    | 商品收盤時間群組                             |
| `data[0].endSession`       | string    | 交易時段，`0` 一般交易時段；`1` 盤後交易時段 |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/products?type=FUTURE&exchange=TAIFEX&session=REGULAR&contractType=S' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
futopt = client.futopt
futopt.intraday.products(type='FUTURE', exchange='TAIFEX', session='REGULAR', contractType='S')

```

```js
const { RestClient } = require("@fugle/marketdata");

const client = new RestClient({ apiKey: "YOUR_API_KEY" });

client.futopt.intraday
  .products({ type: "FUTURE", exchange: "TAIFEX", session:'REGULAR', contractType:'S' })
  .then((data) => console.log(data));

```

Response Body：

```json
{
  "type": "FUTURE",
  "exchange": "TAIFEX",
  "session": "REGULAR",
  "contractType": "S",
  "data": [
    {
      "symbol": "CAF",
      "type": "FUTURE",
      "canBlockTrade": true,
      "contractSize": 2000,
      "contractType": "S",
      "endSession": "0",
      "expiryType": "S",
      "marketCloseGroup": 1,
      "name": "南亞期貨",
      "quoteAcceptable": true,
      "startDate": "2013-08-07",
      "statusCode": "N",
      "tradingCurrency": "TWD",
      "underlyingSymbol": "1303",
      "underlyingType": "S"
    },
    {
      "symbol": "CBF",
      "type": "FUTURE",
      "canBlockTrade": true,
      "contractSize": 2000,
      "contractType": "S",
      "endSession": "0",
      "expiryType": "S",
      "marketCloseGroup": 1,
      "name": "中鋼期貨",
      "quoteAcceptable": true,
      "startDate": "2014-08-14",
      "statusCode": "N",
      "tradingCurrency": "TWD",
      "underlyingSymbol": "2002",
      "underlyingType": "S"
    },
    {
      "symbol": "CCF",
      "type": "FUTURE",
      "canBlockTrade": true,
      "contractSize": 2000,
      "contractType": "S",
      "endSession": "0",
      "expiryType": "S",
      "marketCloseGroup": 1,
      "name": "聯電期貨",
      "quoteAcceptable": true,
      "startDate": "2010-01-25",
      "statusCode": "N",
      "tradingCurrency": "TWD",
      "underlyingSymbol": "2303",
      "underlyingType": "S"
    },
    {
      "symbol": "CDF",
      "type": "FUTURE",
      "canBlockTrade": true,
      "contractSize": 2000,
      "contractType": "S",
      "endSession": "0",
      "expiryType": "S",
      "marketCloseGroup": 1,
      "name": "台積電期貨",
      "quoteAcceptable": true,
      "startDate": "2010-01-25",
      "statusCode": "N",
      "tradingCurrency": "TWD",
      "underlyingSymbol": "2330",
      "underlyingType": "S"
    },
    {
      "symbol": "CE1",
      "type": "FUTURE",
      "canBlockTrade": true,
      "contractSize": 2100,
      "contractType": "S",
      "endSession": "0",
      "expiryType": "S",
      "marketCloseGroup": 1,
      "name": "富邦金期貨",
      "quoteAcceptable": true,
      "startDate": "2022-09-22",
      "statusCode": "N",
      "tradingCurrency": "TWD",
      "underlyingSymbol": "2881",
      "underlyingType": "S"
    },
    {
      "symbol": "CEF",
      "type": "FUTURE",
      "canBlockTrade": true,
      "contractSize": 2000,
      "contractType": "S",
      "endSession": "0",
      "expiryType": "S",
      "marketCloseGroup": 1,
      "name": "富邦金期貨",
      "quoteAcceptable": true,
      "startDate": "2023-09-04",
      "statusCode": "N",
      "tradingCurrency": "TWD",
      "underlyingSymbol": "2881",
      "underlyingType": "S"
    },
    {
      "symbol": "CFF",
      "type": "FUTURE",
      "canBlockTrade": true,
      "contractSize": 2000,
      "contractType": "S",
      "endSession": "0",
      "expiryType": "S",
      "marketCloseGroup": 1,
      "name": "台塑期貨",
      "quoteAcceptable": true,
      "startDate": "2013-07-17",
      "statusCode": "N",
      "tradingCurrency": "TWD",
      "underlyingSymbol": "1301",
      "underlyingType": "S"
    },
    {
      "symbol": "CGF",
      "type": "FUTURE",
      "canBlockTrade": true,
      "contractSize": 2000,
      "contractType": "S",
      "endSession": "0",
      "expiryType": "S",
      "marketCloseGroup": 1,
      "name": "仁寶期貨",
      "quoteAcceptable": true,
      "startDate": "2010-08-11",
      "statusCode": "N",
      "tradingCurrency": "TWD",
      "underlyingSymbol": "2324",
      "underlyingType": "S"
    },
    {
      "symbol": "CHF",
      "type": "FUTURE",
      "canBlockTrade": true,
      "contractSize": 2000,
      "contractType": "S",
      "endSession": "0",
      "expiryType": "S",
      "marketCloseGroup": 1,
      "name": "友達期貨",
      "quoteAcceptable": true,
      "startDate": "2022-10-11",
      "statusCode": "N",
      "tradingCurrency": "TWD",
      "underlyingSymbol": "2409",
      "underlyingType": "S"
    },
    ...
  ]
}


```


---

### Intraday Quote BETA

取得期權即時報價（依商品代碼查詢）

```text
GET /intraday/quote/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description                          |
| ---------- | ------ | ------------------------------------ |
| `symbol`\* | string | 商品代碼                             |
| `session`  | string | 交易時段，可選 `afterhours` 盤後交易 |

#### Response[​](#response "Direct link to Response")

| Name                  | Type   | Description                  |
| --------------------- | ------ | ---------------------------- |
| `date`\*              | string | 日期                         |
| `type`\*              | string | 期權類型                     |
| `exchange`\*          | string | 交易所                       |
| `symbol`\*            | string | 商品代碼                     |
| `name`\*              | string | 商品名稱                     |
| `previousClose`       | number | 昨日收盤價                   |
| `openPrice`           | number | 開盤價                       |
| `openTime`            | number | 開盤價成交時間               |
| `highPrice`           | number | 最高價                       |
| `highTime`            | number | 最高價成交時間               |
| `lowPrice`            | number | 最低價                       |
| `lowTime`             | number | 最低價成交時間               |
| `closePrice`          | number | 收盤價（最後成交價）         |
| `closeTime`           | number | 收盤價（最後成交價）成交時間 |
| `avgPrice`            | number | 當日成交均價                 |
| `change`              | number | 最後成交價漲跌               |
| `changePercnet`       | number | 最後成交價漲跌幅             |
| `amplitude`           | number | 當日振幅                     |
| `lastPrice`           | number | 最後一筆成交價（含試撮）     |
| `lastSize`            | number | 最後一筆成交數量（含試撮）   |
| `total`               | object | 統計時間                     |
| `total.tradeVolume`   | number | 累計成交量                   |
| `total.totalBidMatch` | number | 累計委買成交筆數             |
| `total.totalAskMatch` | number | 累計委賣成交筆數             |
| `lastTrade`           | object | 最後一筆成交資訊             |
| `lastTrade.bid`       | object | 最後一筆成交買價             |
| `lastTrade.ask`       | object | 最後一筆成交賣價             |
| `lastTrade.price`     | number | 最後一筆成交價格             |
| `lastTrade.size`      | number | 最後一筆成交數量             |
| `lastTrade.time`      | number | 最後一筆成交時間             |
| `lastTrade.serial`    | number | 最後一筆成交流水號           |
| `serial`              | number | 流水號                       |
| `lastUpdated`         | number | 最後異動時間                 |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/quote/TXFC5' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
futopt = client.futopt
futopt.intraday.quote(symbol='TXFC5')

```

```js
const { RestClient } = require("@fugle/marketdata");

const client = new RestClient({ apiKey: "YOUR_API_KEY" });

client.futopt.intraday
  .quote({ symbol:"TXFC5" })
  .then((data) => console.log(data));

```

Response Body：

```json
{
  "date": "2024-10-22",
  "type": "FUTURE",
  "exchange": "TAIFEX",
  "symbol": "TXFC5",
  "name": "臺股期貨035",
  "previousClose": 23640,
  "openPrice": 23631,
  "openTime": 1729557900100000,
  "highPrice": 23655,
  "highTime": 1729574996621000,
  "lowPrice": 23480,
  "lowTime": 1729559107582000,
  "closePrice": 23655,
  "closeTime": 1729574996621000,
  "avgPrice": 23597.5,
  "change": 15,
  "changePercent": 0.06,
  "amplitude": 0.74,
  "lastPrice": 23655,
  "lastSize": 1,
  "total": {
    "tradeVolume": 28,
    "totalBidMatch": 22,
    "totalAskMatch": 27,
    "time": 1729574996621000
  },
  "lastTrade": {
    "bid": 23622,
    "ask": 23655,
    "price": 23655,
    "size": 1,
    "time": 1729574996621000,
    "serial": "00218421"
  },
  "serial": 218421,
  "lastUpdated": 1729574996621000
}

```


---

### Intraday Ticker BETA

取得期權基本資料（依商品代碼查詢）

```text
GET /intraday/quote/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description                          |
| ---------- | ------ | ------------------------------------ |
| `symbol`\* | string | 商品代碼                             |
| `session`  | string | 交易時段，可選 `afterhours` 盤後交易 |

#### Response[​](#response "Direct link to Response")

| Name             | Type   | Description |
| ---------------- | ------ | ----------- |
| `date`\*         | string | 日期        |
| `type`\*         | string | 期權類型    |
| `exchange`\*     | string | 交易所      |
| `symbol`\*       | string | 商品代碼    |
| `name`\*         | string | 商品名稱    |
| `referencePrice` | number | 參考價      |
| `settlementDate` | string | 最後結算日  |
| `startDate`      | string | 上市日期    |
| `endDate`        | string | 下市日期    |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/ticker/TXFC5' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
futopt = client.futopt
futopt.intraday.ticker(symbol='TXFC5')

```

```js
const { RestClient } = require("@fugle/marketdata");

const client = new RestClient({ apiKey: "YOUR_API_KEY" });

client.futopt.intraday
  .ticker({ symbol:"TXFC5" })
  .then((data) => console.log(data));

```

Response Body：

```json
{
    "date": "2024-07-19",
    "type": "FUTURE",
    "exchange": "TAIFEX",
    "symbol": "TXFC5",
    "name": "臺股期貨035",
    "referencePrice": 23565,
    "settlementDate": "2025-03-19",
    "startDate": "2024-03-21",
    "endDate": "2025-03-19"
}

```


---

### Intraday Tickers BETA

取得期權可交易商品列表（依條件查詢）

```text
GET /intraday/tickers

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name           | Type   | Description                                                                           |
| -------------- | ------ | ------------------------------------------------------------------------------------- |
| `type`\*       | string | 類型，可選 `FUTURE` 期貨 ； `OPTION` 選擇權                                           |
| `exchange`     | string | 交易所，可選 `TAIFEX` 臺灣期貨交易所                                                  |
| `session`      | string | 交易時段，可選 `REGULAR` 一般交易 或 `AFTERHOURS` 盤後交易                            |
| `product`      | string | 契約代碼                                                                              |
| `contractType` | string | 契約類別，可選 `I` 指數類；`R` 利率類；`B` 債券類；`C` 商品類；`S` 股票類；`E` 匯率類 |

#### Response[​](#response "Direct link to Response")

| Name                       | Type      | Description          |
| -------------------------- | --------- | -------------------- |
| `type`\*                   | string    | 期權類型             |
| `exchange`\*               | string    | 交易所               |
| `session`                  | string    | 交易時段             |
| `product`                  | string    | 契約代碼             |
| `contractType`             | string    | 契約類別             |
| `data`\*                   | object\[] | 商品列表             |
| `data[0].type`             | string    | 期權類型             |
| `data[0].symbol`           | string    | 商品代碼             |
| `data[0].name`             | string    | 商品名稱             |
| `data[0].referencePrice`   | string    | 參考價               |
| `data[0].contractType`     | string    | 契約類別             |
| `data[0].startDate`        | string    | 上市日期             |
| `data[0].endDate`          | string    | 下市日期             |
| `data[0].flowGroup`        | string    | 流程群組             |
| `data[0].settlementDate`   | string    | 最後結算日           |
| `data[0].isDynamicBanding` | boolean   | 是否適用動態價格穩定 |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/tickers?type=FUTURE&exchange=TAIFEX&session=REGULAR&product=TXF' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
futopt = client.futopt
futopt.intraday.tickers(type='FUTURE', exchange='TAIFEX', session='REGULAR', product='TXF')

```

```js
const { RestClient } = require("@fugle/marketdata");

const client = new RestClient({ apiKey: "YOUR_API_KEY" });

client.futopt.intraday
  .tickers({ type: "FUTURE", exchange: "TAIFEX", session:'REGULAR', product:'TXF' })
  .then((data) => console.log(data));

```

Response Body：

```json
{
  "type": "FUTURE",
  "exchange": "TAIFEX",
  "session": "REGULAR",
  "product": "TXF",
  "data": [
    {
      "symbol": "TXFC5",
      "type": "FUTURE",
      "contractType": "I",
      "endDate": "2025-03-19",
      "flowGroup": 1,
      "isDynamicBanding": true,
      "name": "臺股期貨035",
      "referencePrice": 22275,
      "settlementDate": "2025-03-19",
      "startDate": "2024-03-21"
    },
    {
      "symbol": "TXFF4",
      "type": "FUTURE",
      "contractType": "I",
      "endDate": "2024-06-19",
      "flowGroup": 1,
      "isDynamicBanding": true,
      "name": "臺股期貨064",
      "referencePrice": 22477,
      "settlementDate": "2024-06-19",
      "startDate": "2023-06-26"
    },
    {
      "symbol": "TXFG4",
      "type": "FUTURE",
      "contractType": "I",
      "endDate": "2024-07-17",
      "flowGroup": 1,
      "isDynamicBanding": true,
      "name": "臺股期貨074",
      "referencePrice": 22346,
      "settlementDate": "2024-07-17",
      "startDate": "2024-04-18"
    },
    {
      "symbol": "TXFH4",
      "type": "FUTURE",
      "contractType": "I",
      "endDate": "2024-08-21",
      "flowGroup": 1,
      "isDynamicBanding": true,
      "name": "臺股期貨084",
      "referencePrice": 22294,
      "settlementDate": "2024-08-21",
      "startDate": "2024-05-16"
    },
    {
      "symbol": "TXFI4",
      "type": "FUTURE",
      "contractType": "I",
      "endDate": "2024-09-18",
      "flowGroup": 1,
      "isDynamicBanding": true,
      "name": "臺股期貨094",
      "referencePrice": 22267,
      "settlementDate": "2024-09-18",
      "startDate": "2023-09-21"
    },
    {
      "symbol": "TXFL4",
      "type": "FUTURE",
      "contractType": "I",
      "endDate": "2024-12-18",
      "flowGroup": 1,
      "isDynamicBanding": true,
      "name": "臺股期貨124",
      "referencePrice": 22271,
      "settlementDate": "2024-12-18",
      "startDate": "2023-12-21"
    }
  ]
}

```


---

### Intraday Trades BETA

取得期權成交明細（依代碼查詢）

```text
GET /intraday/trades/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description                      |
| ---------- | ------ | -------------------------------- |
| `symbol`\* | string | 期權代碼                         |
| `session`  | string | 交易時段，可選 `afterhours` 夜盤 |
| `offset`   | number | 偏移量                           |
| `limit`    | number | 限制量                           |

#### Response[​](#response "Direct link to Response")

| Name             | Type      | Description |
| ---------------- | --------- | ----------- |
| `date`\*         | string    | 日期        |
| `type`\*         | string    | 期權類型    |
| `exchange`\*     | string    | 交易所      |
| `symbol`\*       | string    | 商品代碼    |
| `data`\*         | object\[] | 成交明細    |
| `data[0].bid`    | number    | 成交買價    |
| `data[0].ask`    | number    | 成交賣價    |
| `data[0].price`  | number    | 成交價格    |
| `data[0].size`   | number    | 成交單量    |
| `data[0].time`   | number    | 成交時間    |
| `data[0].serial` | number    | 流水號      |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/trades/TXFC5' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
futopt = client.futopt
futopt.intraday.trades(symbol='TXFC5')

```

```js
const { RestClient } = require("@fugle/marketdata");

const client = new RestClient({ apiKey:"YOUR_API_KEY" });

client.futopt.intraday
  .tradesc({ symbol:"TXFC5" })
  .then((data) => console.log(data));

```

Response Body：

```json
{
  "date": "2024-10-22",
  "type": "FUTURE",
  "exchange": "TAIFEX",
  "symbol": "TXFC5",
  "data": [
    {
      "bid": 23622,
      "ask": 23655,
      "price": 23655,
      "size": 1,
      "time": 1729574996621000,
      "serial": 218421
    },
    {
      "bid": 23583,
      "ask": 23597,
      "price": 23583,
      "size": 1,
      "time": 1729573825049000,
      "serial": 208004
    },
    {
      "bid": 23607,
      "ask": 23648,
      "price": 23648,
      "size": 1,
      "time": 1729571331711000,
      "serial": 188854
    },
    {
      "bid": 23568,
      "ask": 23605,
      "price": 23605,
      "size": 1,
      "time": 1729563837862000,
      "serial": 140103
    },
    {
      "bid": 23568,
      "ask": 23605,
      "price": 23604,
      "size": 1,
      "time": 1729563835924000,
      "serial": 140081
    },
    {
      "bid": 23568,
      "ask": 23605,
      "price": 23602,
      "size": 1,
      "time": 1729563833108000,
      "serial": 140018
    },
    {
      "bid": 23568,
      "ask": 23605,
      "price": 23602,
      "size": 1,
      "time": 1729563830690000,
      "serial": 140008
    },
    {
      "bid": 23568,
      "ask": 23605,
      "price": 23600,
      "size": 1,
      "time": 1729563826344000,
      "serial": 139988
    },
    {
      "bid": 23559,
      "ask": 23602,
      "price": 23593,
      "size": 1,
      "time": 1729563713019000,
      "serial": 139171
    },
    {
      "bid": 23572,
      "ask": 23611,
      "price": 23611,
      "size": 1,
      "time": 1729563629699000,
      "serial": 138540
    }
  ]
}

```


---

### Intraday Volumes BETA

取得期權分價量表（依代碼查詢）

```text
GET /intraday/volumes/{symbol}

```

#### Parameters[​](#parameters "Direct link to Parameters")

| Name       | Type   | Description                      |
| ---------- | ------ | -------------------------------- |
| `symbol`\* | string | 期權代碼                         |
| `session`  | string | 交易時段，可選 `afterhours` 夜盤 |

#### Response[​](#response "Direct link to Response")

| Name             | Type      | Description          |
| ---------------- | --------- | -------------------- |
| `date`\*         | string    | 日期                 |
| `type`\*         | string    | 期權類型             |
| `exchange`\*     | string    | 交易所               |
| `symbol`\*       | string    | 商品代碼             |
| `data`\*         | object\[] | 分價量表             |
| `data[0].price`  | number    | 成交價               |
| `data[0].volume` | number    | 該成交價之累計成交量 |

#### Example[​](#example "Direct link to Example")

* cURL
* Python
* Node.js

```sh
curl -X 'GET' \
  'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/volumes/CDFC5' \
  -H 'X-API-KEY: <YOUR_API_KEY>'

```

```python
from fugle_marketdata import RestClient

client = RestClient(api_key = 'YOUR_API_KEY')
futopt = client.futopt
futopt.intraday.volumes(symbol='CDFC5')

```

```js
const { RestClient } = require("@fugle/marketdata");

const client = new RestClient({ apiKey: "YOUR_API_KEY" });

client.futopt.intraday
  .volumes({ symbol:"CDFC5" })
  .then((data) => console.log(data));

```

Response Body：

```json
{
  "date": "2024-06-18",
  "type": "FUTURE",
  "exchange": "TAIFEX",
  "symbol": "CDFC5",
  "data": [
    {
      "price": 971,
      "volume": 2
    },
    {
      "price": 968,
      "volume": 3
    },
    {
      "price": 967,
      "volume": 1
    }
  ]
}

```


---

### 富果期權行情 API BETA

富果期權行情 API 是由時報資訊與 Fugle 技術團隊開發提供。 期權即時行情資料來源為臺灣期貨交易所，請您詳閱相關使用規範與聲明。

#### REST API[​](#rest-api "Direct link to REST API")

富果行情 [Rest API](https://developer.fugle.tw/docs/data-futopt/http-api/getting-started.md) 提供開發者友善的 Web API 服務。您可以查詢台股期權的日內行情及歷史數據。

#### WebSocket API[​](#websocket-api "Direct link to WebSocket API")

富果行情 [WebSocket API](https://developer.fugle.tw/docs/data-futopt/websocket-api/getting-started.md) 提供台股期權即時行情服務。透過 WebSocket API 可以滿足您想要接收即時行情的需求。

#### 官方函式庫[​](#sdk "Direct link to 官方函式庫")

您可以使用富果提供函式庫，以簡化使用行情 API 的方式。

| Language | URL                                                                             |
| -------- | ------------------------------------------------------------------------------- |
| Node.js  | [fugle-marketdata-node](https://github.com/fugle-dev/fugle-marketdata-node)     |
| Python   | [fugle-marketdata-python](https://github.com/fugle-dev/fugle-marketdata-python) |

#### 使用規範與聲明[​](#statement "Direct link to 使用規範與聲明")

* 透過本服務取得之行情資料僅供參考，成交值及成交量不含零股及鉅額交易，使用者依本資料交易發生交易損失需自行負責。
* 時報資訊與群馥科技對資料內容錯誤、更新延誤或傳輸中斷不負任何責任。您應對您所為之任何金融或投資決策自行負責。
* 使用者應遵守[臺灣證券交易所股份有限公司交易資訊使用管理辦法](http://www.selaw.com.tw/LawArticle.aspx?LawID=G0100124)、[臺灣期貨交易所股份有限公司交易資訊使用管理辦法](http://www.selaw.com.tw/LawArticle.aspx?LawID=G0101422)、[財團法人中華民國證券櫃檯買賣中心有價證券交易資訊使用管理辦法](http://www.selaw.com.tw/LawArticle.aspx?LawID=G0100766)、各資訊來源提供者所定之資訊使用相關規範及智慧財產權相關法令，如有盜接、轉接交易資訊，或以其他方式出售、出租、轉讓、再授權交易資訊，或將交易資訊另行取樣並編製指數、其他衍生性商品或將之傳送予第三人，應負違約及侵權之相關民、刑事責任。
* 使用者須遵守臺灣證券交易所「[交易資訊使用管理辦法](https://www.twse.com.tw/downloads/zh/products/regulation_use.pdf)」等交易資訊管理相關規定，所有資訊以臺灣證券交易所公告資料為準。


---

### 開始使用 BETA

富果行情 WebSocket API 提供台股即時行情服務。透過 WebSocket API 可以滿足您想要接收即時行情的需求。

#### 建立連線[​](#建立連線 "Direct link to 建立連線")

您可以透過以下位置向富果行情 WebSocket API server 建立連線：

```text
wss://api.fugle.tw/marketdata/v1.0/futopt/streaming

```

#### 身份驗證[​](#身份驗證 "Direct link to 身份驗證")

當驗證成功後，會收到以下訊息：

```json
{
  "event": "authenticated",
  "data": {
    "message": "Authenticated successfully"
  }
}

```

若驗證失敗，則收到以下訊息：

```json
{
  "event": "error",
  "data": {
    "message": "Invalid authentication credentials"
  }
}

```

#### Heartbeat[​](#heartbeat "Direct link to Heartbeat")

每隔 30 秒 WebSocket server 會送出一個 heartbeat 訊息：

```json
{
  "event": "heartbeat",
  "data": {
    "time": "<Timestamp>"
  }
}

```

#### Ping/Pong[​](#pingpong "Direct link to Ping/Pong")

將以下 JSON 格式訊息發送到 WebSocket Server (`state` 為可選)：

```json
{
  "event": "ping",
  "data": {
    "state": "<ANY>"
  }
}

```

WebSocket Server 會回應以下訊息 (若 ping 未送 `state` 則不會有該欄位)：

```json
{
  "event": "pong",
  "data": {
    "time": "<TIMESTAMP>",
    "state": "<ANY>"
  }
}

```

#### Channels[​](#channels "Direct link to Channels")

富果行情 WebSocket API 目前提供以下可訂閱頻道：

* `trades` - [接收訂閱期權商品最新成交資訊](https://developer.fugle.tw/docs/data-futopt/websocket-api/market-data-channels/trades.md)
* `candles` - [接收訂閱期權商品最新分鐘Ｋ](https://developer.fugle.tw/docs/data-futopt/websocket-api/market-data-channels/candles.md)
* `books` - [接收訂閱期權商品最新最佳五檔委買委賣資訊](https://developer.fugle.tw/docs/data-futopt/websocket-api/market-data-channels/books.md)
* `aggregates` - [接收訂閱期權聚合數據的行情資訊](https://developer.fugle.tw/docs/data-futopt/websocket-api/market-data-channels/aggregates.md)

##### 訂閱頻道[​](#訂閱頻道 "Direct link to 訂閱頻道")

要訂閱一個頻道 JSON 格式訊息發送到 WebSocket Server：

```json
{
  "event": "subscribe",
  "data": {
    "channel": "<CHANNEL_NAME>",
    "symbol": "<SYMBOL_ID>"
  }
}

```

訂閱成功後，會收到以下事件回應：

```json
{
  "event": "subscribed",
  "data": {
    "id": "<CHANNEL_ID>",
    "channel": "<CHANNEL_NAME>",
    "symbol": "<SYMBOL_ID>"
  }
}

```

支援訂閱同頻道的多檔股票：

```json
{
  "event": "subscribe",
  "data": {
    "channel": "<CHANNEL_NAME>",
    "symbols": ["<SYMBOL_ID_1>", "<SYMBOL_ID_2>"]
  }
}

```

訂閱成功後，會收到以下事件回應：

```json
{
  "event": "subscribed",
  "data": [
    {
      "id": "<CHANNEL_ID>",
      "channel": "<CHANNEL_NAME>",
      "symbol": "<SYMBOL_ID_1>"
    },
    {
      "id": "<CHANNEL_ID>",
      "channel": "<CHANNEL_NAME>",
      "symbol": "<SYMBOL_ID_2>"
    }
  ]
}

```

##### 取消訂閱[​](#取消訂閱 "Direct link to 取消訂閱")

要取消已訂閱頻道，請將以下 JSON 格式訊息發送到 WebSocket Server：

```json
{
  "event": "unsubscribe",
  "data": {
    "id": "<CHANNEL_ID>"
  }
}

```

取消訂閱成功後，會收到以下事件回應：

```json
{
  "event": "unsubscribed",
  "data": {
    "id": "<CHANNEL_ID>"
  }
}

```

支援取消訂閱多個頻道：

```json
{
  "event": "unsubscribe",
  "data": {
    "ids": ["<CHANNEL_ID_1>", "<CHANNEL_ID_2>"]
  }
}

```

取消訂閱成功後，會收到以下事件回應：

```json
{
  "event": "unsubscribed",
  "data": [
    {
      "id": "<CHANNEL_ID_1>"
    },
    {
      "id": "<CHANNEL_ID_2>"
    }
  ]
}

```

##### 訂閱資訊[​](#訂閱資訊 "Direct link to 訂閱資訊")

要取得已訂閱的頻道，請將以下 JSON 格式訊息發送到 WebSocket Server：

```json
{
  "event": "subscriptions"
}

```

然後會收到以下事件回應：

```json
{
  "event": "subscriptions",
  "data": [
    {
      "id": "<CHANNEL_ID>",
      "channel": "<CHANNEL_NAME>",
      "symbol": "<SYMBOL_ID>"
    }
  ]
}

```

#### 使用 SDK[​](#使用-sdk "Direct link to 使用 SDK")

富果行情 WebSocket API 提供 Python 與 Node.js SDK。您可以透過以下方式存取 WebSocket API：

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

client = WebSocketClient(api_key = 'YOUR_API_KEY')
futopt = client.futopt

```

```js
const { WebSocketClient } = require('@fugle/marketdata');

const client = new WebSocketClient({ apiKey: 'YOUR_API_KEY' });
const futopt = client.futopt;

```


---

### Aggregates BETA

接收訂閱期權聚合數據的行情資訊

#### Parameters[​](#parameters "Direct link to Parameters")

| Name         | Type    | Description                                          |
| ------------ | ------- | ---------------------------------------------------- |
| `channel`\*  | string  | 訂閱頻道：`trades`, `candles`, `books`, `aggregates` |
| `symbol`\*   | string  | 商品代碼                                             |
| `afterHours` | boolean | true: 夜盤, false: 日盤, default: false              |

#### Response[​](#response "Direct link to Response")

| Name                  | Type   | Description                  |
| --------------------- | ------ | ---------------------------- |
| `date`\*              | string | 日期                         |
| `type`\*              | string | 期權類型                     |
| `exchange`\*          | string | 交易所                       |
| `symbol`\*            | string | 商品代碼                     |
| `name`\*              | string | 商品名稱                     |
| `previousClose`       | number | 昨日收盤價                   |
| `openPrice`           | number | 開盤價                       |
| `openTime`            | number | 開盤價成交時間               |
| `highPrice`           | number | 最高價                       |
| `highTime`            | number | 最高價成交時間               |
| `lowPrice`            | number | 最低價                       |
| `lowTime`             | number | 最低價成交時間               |
| `closePrice`          | number | 收盤價（最後成交價）         |
| `closeTime`           | number | 收盤價（最後成交價）成交時間 |
| `avgPrice`            | number | 當日成交均價                 |
| `change`              | number | 最後成交價漲跌               |
| `changePercnet`       | number | 最後成交價漲跌幅             |
| `amplitude`           | number | 當日振幅                     |
| `lastPrice`           | number | 最後一筆成交價（含試撮）     |
| `lastSize`            | number | 最後一筆成交數量（含試撮）   |
| `total`               | object | 統計時間                     |
| `total.tradeVolume`   | number | 累計成交量                   |
| `total.totalBidMatch` | number | 累計委買成交筆數             |
| `total.totalAskMatch` | number | 累計委賣成交筆數             |
| `lastTrade`           | object | 最後一筆成交資訊             |
| `lastTrade.price`     | number | 最後一筆成交價格             |
| `lastTrade.size`      | number | 最後一筆成交數量             |
| `lastTrade.time`      | number | 最後一筆成交時間             |
| `lastTrade.serial`    | number | 最後一筆成交流水號           |
| `serial`              | number | 流水號                       |
| `lastUpdated`         | number | 最後異動時間                 |

#### Example[​](#example "Direct link to Example")

##### Subscribe channel[​](#subscribe-channel "Direct link to Subscribe channel")

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(message)

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    futopt = client.futopt
    futopt.on('message', handle_message)
    futopt.connect()
    futopt.subscribe({ 
        'channel': 'aggregates', 
        'symbol': 'TXFK4',
        'afterHours': True
    })

if __name__ == '__main__':
    main()

```

```js
const { WebSocketClient } = require("@fugle/marketdata");

const client = new WebSocketClient({ apiKey: "YOUR_API_KEY" });

const futopt = client.futopt;

stock.connect().then(() => {
  stock.subscribe({ channel: "aggregates", symbol: "TXFK4", afterHours: true });
});

stock.on("message", (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```

##### Receive data[​](#receive-data "Direct link to Receive data")

```json
{
  "event": "data",
  "data": {
    "date": "2024-10-23",
    "type": "FUTURE_AH",
    "exchange": "TAIFEX",
    "symbol": "TXFK4",
    "name": "臺股期貨114",
    "previousClose": 23660,
    "openPrice": 23611,
    "openTime": 1729580400097000,
    "highPrice": 23667,
    "highTime": 1729581260165000,
    "lowPrice": 23598,
    "lowTime": 1729580555065000,
    "closePrice": 23620,
    "closeTime": 1729582381863000,
    "avgPrice": 23631.9,
    "change": -1,
    "changePercent": 0,
    "amplitude": 0.29,
    "lastPrice": 23620,
    "lastSize": 1,
    "total": {
      "tradeVolume": 2854,
      "totalBidMatch": 2493,
      "totalAskMatch": 2484,
      "time": 1729582381863000
    },
    "lastTrade": {
      "bid": 23620,
      "ask": 23622,
      "price": 23620,
      "size": 1,
      "time": 1729582381863000,
      "serial": "00010204"
    },
    "serial": 158638,
    "lastUpdated": 1729582383094000
  },
  "id": "<CHANNEL_ID>",
  "channel": "aggregates"
}


```


---

### Books BETA

接收訂閱期權商品最新最佳五檔委買委賣資訊

#### Parameters[​](#parameters "Direct link to Parameters")

| Name         | Type    | Description                                           |
| ------------ | ------- | ----------------------------------------------------- |
| `channel`\*  | string  | 訂閱頻道：`trades`, `candles`, `books` , `aggregates` |
| `symbol`\*   | string  | 商品代碼                                              |
| `afterHours` | boolean | true: 夜盤, false: 日盤, default: false               |

#### Response[​](#response "Direct link to Response")

| Name            | Type      | Description      |
| --------------- | --------- | ---------------- |
| `symbol`\*      | string    | 商品代碼         |
| `type`\*        | string    | Ticker 類型      |
| `exchange`\*    | string    | 交易所           |
| `market`        | string    | 市場別           |
| `time`\*        | number    | 時間             |
| `bids`          | object\[] | 最佳五檔委買     |
| `bids[0].price` | number    | 最佳五檔委買價格 |
| `bids[0].size`  | number    | 最佳五檔委買數量 |
| `asks`          | object\[] | 最佳五檔委賣     |
| `asks[0].price` | number    | 最佳五檔委賣價格 |
| `asks[0].size`  | number    | 最佳五檔委賣數量 |

#### Example[​](#example "Direct link to Example")

##### Subscribe channel[​](#subscribe-channel "Direct link to Subscribe channel")

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(message)

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    futopt = client.futopt
    futopt.on('message', handle_message)
    futopt.connect()
    futopt.subscribe({ 
        'channel': 'books', 
        'symbol': 'TXFG4',
    })

if __name__ == '__main__':
    main()

```

```js
const { WebSocketClient } = require("@fugle/marketdata");

const client = new WebSocketClient({ apiKey: "YOUR_API_KEY" });

const futopt = client.futopt;

stock.connect().then(() => {
  stock.subscribe({ channel: "books", symbol: "TXFG4" });
});

stock.on("message", (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```

##### Receive data[​](#receive-data "Direct link to Receive data")

```json
{
  "event": "data",
  "data": {
    "symbol": "TXFG4",
    "type": "FUTURE",
    "exchange": "TAIFEX",
    "bids": [
      {
        "price": 23187,
        "size": 13
      },
      {
        "price": 23186,
        "size": 15
      },
      {
        "price": 23185,
        "size": 21
      },
      {
        "price": 23184,
        "size": 11
      },
      {
        "price": 23183,
        "size": 15
      }
    ],
    "asks": [
      {
        "price": 23189,
        "size": 5
      },
      {
        "price": 23190,
        "size": 14
      },
      {
        "price": 23191,
        "size": 17
      },
      {
        "price": 23192,
        "size": 19
      },
      {
        "price": 23193,
        "size": 15
      }
    ],
    "time": 1718942376775000
  },
  "id": "<CHANNEL_ID>",
  "channel": "books"
}

```


---

### Candles BETA

接收訂閱期權商品最新分鐘Ｋ

#### Parameters[​](#parameters "Direct link to Parameters")

| Name         | Type    | Description                                           |
| ------------ | ------- | ----------------------------------------------------- |
| `channel`\*  | string  | 訂閱頻道：`trades`, `candles`, `books` , `aggregates` |
| `symbol`\*   | string  | 商品代碼                                              |
| `afterHours` | boolean | true: 夜盤, false: 日盤, default: false               |

#### Response[​](#response "Direct link to Response")

| Name          | Type   | Description                                                                |
| ------------- | ------ | -------------------------------------------------------------------------- |
| `date`\*      | string | 日期                                                                       |
| `type`\*      | string | Ticker 類型                                                                |
| `exchange`\*  | string | 交易所                                                                     |
| `market`      | string | 市場別                                                                     |
| `symbol`\*    | string | 商品代碼                                                                   |
| `timeframe`\* | number | Ｋ線週期                                                                   |
| `open`\*      | number | Ｋ線開盤價                                                                 |
| `high`\*      | number | Ｋ線最高價                                                                 |
| `low`\*       | number | Ｋ線最低價                                                                 |
| `close`\*     | number | Ｋ線收盤價                                                                 |
| `volume`\*    | number | Ｋ線成交量（整股：成交張數；興櫃股票及盤中零股：成交股數；指數：成交金額） |
| `average`\*   | number | 成交均價                                                                   |

#### Example[​](#example "Direct link to Example")

##### Subscribe channel[​](#subscribe-channel "Direct link to Subscribe channel")

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(message)

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    futopt = client.futopt
    futopt.on('message', handle_message)
    futopt.connect()
    futopt.subscribe({ 
        'channel': 'candles', 
        'symbol': 'TXFG4'
    })

if __name__ == '__main__':
    main()

```

```js
const { WebSocketClient } = require("@fugle/marketdata");

const client = new WebSocketClient({ apiKey: "YOUR_API_KEY" });

const futopt = client.futopt;

stock.connect().then(() => {
  stock.subscribe({ channel: "candles", symbol: "TXFG4" });
});

stock.on("message", (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```

##### Receive data[​](#receive-data "Direct link to Receive data")

```json
{
  "event": "data",
  "data": {
    "symbol": "TXFG4",
    "type": "FUTURE",
    "exchange": "TAIFEX",
    "date": "2024-06-21T11:59:00.000+08:00",
    "open": 23194,
    "high": 23195,
    "low": 23187,
    "close": 23187,
    "volume": 215,
    "average": 23176.58
  },
  "id": "<CHANNEL_ID>",
  "channel": "candles"
}

```


---

### Trades BETA

接收訂閱期權商品最新成交資訊

#### Parameters[​](#parameters "Direct link to Parameters")

| Name         | Type    | Description                                           |
| ------------ | ------- | ----------------------------------------------------- |
| `channel`\*  | string  | 訂閱頻道：`trades`, `candles`, `books` , `aggregates` |
| `symbol`\*   | string  | 期貨商品代碼                                          |
| `afterHours` | boolean | true: 夜盤, false: 日盤, default: false               |

#### Response[​](#response "Direct link to Response")

| Name                  | Type      | Description      |
| --------------------- | --------- | ---------------- |
| `symbol`\*            | string    | 商品代號         |
| `type`\*              | string    | Ticker 類型      |
| `exchange`\*          | string    | 交易所           |
| `market`              | string    | 市場別           |
| `trades`              | object\[] | 成交報價         |
| `trades[0].price`     | number    | 成交價格         |
| `trades[0].size`      | number    | 成交單量         |
| `trades[0].bid`       | number    | 成交買價         |
| `trades[0].ask`       | number    | 成交賣價         |
| `total`               | object    | 成交量           |
| `total.tradeVolume`   | number    | 成交總量         |
| `total.totalBidMatch` | number    | 累計委買成交筆數 |
| `total.totalAskMatch` | number    | 累計委賣成交筆數 |
| `time`\*              | number    | 時間             |
| `serial`\*            | number    | 流水號           |

#### Example[​](#example "Direct link to Example")

##### Subscribe channel[​](#subscribe-channel "Direct link to Subscribe channel")

* Python
* Node.js

```python
from fugle_marketdata import WebSocketClient

def handle_message(message):
    print(message)

def main():
    client = WebSocketClient(api_key='YOUR_API_KEY')
    futopt = client.futopt
    futopt.on('message', handle_message)
    futopt.connect()
    futopt.subscribe({
      'channel': 'trades', 
      'symbol': 'TXFG4',
      'afterHours': True
    })

if __name__ == '__main__':
    main()

```

```js
const { WebSocketClient } = require("@fugle/marketdata");

const client = new WebSocketClient({ apiKey: "YOUR_API_KEY" });

const futopt = client.futopt;

stock.connect().then(() => {
  stock.subscribe({ channel: "trades", symbol: "TXFG4", afterHours: true });
});

stock.on("message", (message) => {
  const data = JSON.parse(message);
  console.log(data);
});

```

##### Receive data[​](#receive-data "Direct link to Receive data")

```json
{
  "event": "data",
  "data": {
    "symbol": "TXFG4",
    "type": "FUTURE_AH",
    "exchange": "TAIFEX",
    "trades": [
      {
        "price": 23379,
        "size": 1,
        "bid": 23379,
        "ask": 23380
      }
    ],
    "total": {
      "tradeVolume": 12431,
      "totalBidMatch": 8191,
      "totalAskMatch": 7964
    },
    "time": 1718880340342000,
    "serial": 23143
  },
  "id": "<CHANNEL_ID>",
  "channel": "trades"
}

```


---

### 常見問答

#### 如何申請使用行情 API?[​](#如何申請使用行情-api "Direct link to 如何申請使用行情 API?")

註冊 [富果會員 ](https://www.fugle.tw/account/register?referrer=api)即可免費享有使用「基本用戶」權限，

詳情可參考 [方案及價格](https://developer.fugle.tw/docs/pricing/) 說明！

#### 如何尋求技術服務[​](#如何尋求技術服務 "Direct link to 如何尋求技術服務")

請至以下管道與我們聯繫

1. [Discord](https://discord.gg/sdGQ3v8mEv)
2. [GitHub](https://github.com/fugle-dev)
3. [寫信聯絡技術客服](mailto:tech.support@fugle.tw)


---

### 金鑰申請及管理

#### 行情 API

loading...


---

### 行情方案及價格

個人台股行情方案價格及對應權限如下

|                                       | **基本用戶**                                                                      | **開發者**               | **進階用戶**              |
| ------------------------------------- | --------------------------------------------------------------------------------- | ------------------------ | ------------------------- |
| 台股即時行情 WebSocket                | 5 訂閱數<br />1 連線數                                                            | 300 訂閱數<br />2 連線數 | 2000 訂閱數<br />2 連線數 |
| 台股日內行情 API<br />(呼叫次數/分鐘) | 60/min                                                                            | 600/min                  | 2000/min                  |
| 台股日內行情快照<br />(呼叫次數/分鐘) | ✘ 不支援                                                                          | 600/min                  | 2000/min                  |
| 台股歷史行情<br />(呼叫次數/分鐘)     | 60/min                                                                            | 60/min                   | 60/min                    |
| 台股技術指標<br />(呼叫次數/分鐘)     | ✘ 不支援                                                                          | 60/min                   | 60/min                    |
| 台股股務事件<br />(呼叫次數/分鐘)     | ✘ 不支援                                                                          | 30/min                   | 30/min                    |
| 期權即時行情 WebSocket                | ✘ 不支援                                                                          | 300 訂閱數<br />2 連線數 | 2000 訂閱數<br />2 連線數 |
| 期權日內行情 API<br />(呼叫次數/分鐘) | ✘ 不支援                                                                          | 600/min                  | 2000/min                  |
| 價格                                  | 註冊 [富果會員](https://www.fugle.tw/account/register?referrer=api)，即可免費使用 | NT$1499/月               | NT$2999/月                |

行情方案說明及如何訂閱行情方案？

##### 行情方案說明[​](#行情方案說明 "Direct link to 行情方案說明")

* 台股可追蹤標的包含興櫃、上市櫃個股及指數、權證、ETF、ETN

* 台股歷史行情目前僅支援上市櫃個股及 ETF

* Websocket 中的訂閱數及連線數說明如下：

  <!-- -->

  * 訂閱數：每個訂閱數對應 1 檔股票 x 1 種資料類型（Channel），例如訂閱「2000 檔股票的最新成交資訊（Trades Channel）」，需要 2000 訂閱數。
  * 連線數：每個 WebSocket 連線可支援多個訂閱數，例如進階用戶方案中，1 個連線最多支援 2000 訂閱數，最多可建立 2 條連線。

##### 如何訂閱行情方案[​](#如何訂閱行情方案 "Direct link to 如何訂閱行情方案")

可至 [富果進階功能訂閱](https://www.fugle.tw/setting/subscribe-service?referrer=api) 頁，選擇您需要的富果行情 API 訂閱方案並點選訂閱！

***

#### 需要更進階的企業方案嗎？[​](#需要更進階的企業方案嗎 "Direct link to 需要更進階的企業方案嗎？")

請留下您的聯絡資訊以及需求, 我們會盡快與您聯絡, 更客製化的方案包含

1. 專屬的 API 伺服器
2. 無上限的連線數
3. 即時的客戶服務

姓名姓名(必填)

EMAILEMAIL(必填)

電話電話(必填)

公司名稱公司名稱

送出表單


---

### 行情方案及價格

申請玉山證券富果帳戶即可免費使用本服務

|                 | Demo          | 富果帳戶 ([如何取得?](https://www.fugle.tw/events/trade-landing-page/))    |
| --------------- | ------------- | -------------------------------------------------------------------------- |
| Request / min   | 60            | 60                                                                         |
| Websocket limit | 1             | 5                                                                          |
| Content         | 2884 (玉山金) | 上市股票<br />上櫃股票<br />興櫃股票<br />指數<br />ETF<br />權證<br />ETN |
| Price           | free          | free                                                                       |


---

### 最佳實踐

caution

在開發程式下單系統時，確保系統的穩定性、可靠性以及符合交易規則和安全性需求是相當重要的考量因素。在這裡，我們將探討在實務上的最佳作法，以協助您打造一個高效、安全且可靠的程式下單系統。

如果您在開發過程中遇到任何問題，歡迎來信詢問，或者在 [Discord](https://discord.gg/sdGQ3v8mEv) 上與開發者們一同交流。

#### 瞭解交易規則和限制[​](#瞭解交易規則和限制 "Direct link to 瞭解交易規則和限制")

在您開發程式下單系統之前，您必須深入瞭解交易所的交易規則和證券帳戶的交易限制。藉由瞭解股市交易的基本概念、交易時間、股票買賣規則以及買賣金額限制等等，您可以確保您的程式能夠遵守這些規則，並正確地處理交易。

#### 考量安全性[​](#考量安全性 "Direct link to 考量安全性")

由於下單系統涉及金融交易，安全性成為您必須特別考量的重要因素。為了確保您的資金安全，請務必妥善管理您的交易憑證和 API 金鑰，以免您的帳戶遭受非法存取。同時，在您部署程式的環境中，請設置防火牆，並實施適當的存取控制和權限管理，以確保只有經授權的使用者能夠執行特定操作。

#### 處理錯誤和異常狀況[​](#處理錯誤和異常狀況 "Direct link to 處理錯誤和異常狀況")

在您開發程式下單系統的過程中，您必須考慮各種可能的錯誤和異常情況，並採取適當的處理措施。這包括驗證錯誤的輸入、處理網路連線問題以及應對委託下單失敗等狀況。良好的錯誤處理和異常情況處理可以確保您的系統穩定可靠，並提供有用的錯誤訊息，以便您進一步解決問題。

#### 請求限制和節流措施[​](#請求限制和節流措施 "Direct link to 請求限制和節流措施")

當您使用股市交易 API 進行互動時，您可能會遇到請求限制和節流措施，這些措施旨在保護 API 的穩定性並避免過度使用。因此，在您開發程式下單系統的過程中，您需要仔細閱讀相關的 API 文件，了解這些限制和措施。同時，您需要合理管理請求的頻率和數量，避免觸發限制，以確保您的交易操作能夠順利進行。

info

如果您需要在盤中追蹤股價，建議優先使用 [WebSocket API](https://developer.fugle.tw/docs/data/websocket-api/getting-started.md)。WebSocket API 提供即時的行情報價，避免頻繁發送 HTTP 請求。

warning

由於在下單委託、成交回報以及庫存更新之間存在一定的延遲時間差和請求限制，您應該避免在市場交易期間過於頻繁地進行庫存明細和銀行餘額查詢。

#### 主動回報和庫存管理[​](#主動回報和庫存管理 "Direct link to 主動回報和庫存管理")

開發程式下單系統時，您需要特別重視主動回報和庫存管理這兩個功能。主動回報是指證券商系統即時向您提供委託或成交回報、異常情況和錯誤訊息等資訊。庫存管理則涉及您的庫存持倉、可用資金等資訊，以便進行資產管理和風險控制。

caution

我們建議在進行下單交易之前使用快取機制記錄您的持股狀況和可用資金。在下單委託並收到成交回報後，立即更新股票和資金的庫存狀態，以確保資訊同步的準確性。

#### 監控和日誌[​](#監控和日誌 "Direct link to 監控和日誌")

為了確保您的程式下單系統正常運作，您需要進行監控和日誌記錄。您應該實施適當的監控機制，包括監控系統的健康狀態、API 的回應時間以及交易流程的執行情況等。同時，您應該定期審查和分析日誌記錄，以便及早發現問題、進行故障排除和改進系統效能。

#### 測試和模擬[​](#測試和模擬 "Direct link to 測試和模擬")

在您開發程式下單系統之前，進行充分的測試和模擬是不可或缺的。我們建議您在進行實際交易之前，在模擬環境或非交易時段測試您的程式下單功能是否能正常運作。透過模擬環境的測試和驗證，您可以提高程式下單系統的品質，同時降低風險和錯誤的發生。


---

### 合作券商

我們與多家知名券商建立合作關係，共同提供優質的金融服務。

#### 我們的合作夥伴

[![富邦證券](/img/fubon_logo.png)富邦證券](https://www.fbs.com.tw/TradeAPI/)

[![元富證券](/img/masterlink_logo.svg)元富證券](https://ml-fugle-api.masterlink.com.tw/FugleSDK/)

[![玉山證券](/img/esun_logo.svg)玉山證券](https://www.esunsec.com.tw/trading-platforms/api-trading/)

#### 為什麼選擇我們的合作券商？[​](#為什麼選擇我們的合作券商 "Direct link to 為什麼選擇我們的合作券商？")

🏆

##### 業界領先

與台灣優質券商合作，提供最完善的交易服務

💡

##### 技術創新

整合金融科技，打造順暢的交易體驗

🔒

##### 安全可靠

符合金管會規範，確保交易與個資安全無虞

#### 加入我們的合作網路[​](#加入我們的合作網路 "Direct link to 加入我們的合作網路")

想要成為我們的合作夥伴？歡迎與我們聯繫，共同開創金融科技的未來。

[立即聯繫我們](mailto:tech.support@fugle.tw)


---

### 富果交易 API

<!-- -->

### ⚠️此套件已停止更新

富果交易 API 於 2025/11 不再更新，下單需求請轉移到合作券商 SDK

[🤝合作券商](https://developer.fugle.tw/docs/trading/brokerage_partner.md)

[📊行情 API](https://developer.fugle.tw/docs/data/intro.md)

富果交易 API 是由 [Fugle](https://www.fugle.tw/) 技術團隊與玉山證券合作開發的程式交易 API。目前您可以在 Windows、Mac 及 Linux 上使用我們提供的 SDK，搭配您的交易策略進行台灣股票市場的程式交易。


---

### 事前準備

caution

使用正式交易之前，您必須完成以下步驟

1. 申請使用交易 API 服務

   <!-- -->

   * 申請憑證
   * 簽署同意書
   * 等待審核

2. 進行模擬測試

   <!-- -->

   * 申請模擬環境金鑰
   * 修改模擬環境設定檔
   * 安裝套件
   * 完成模擬下單

#### 申請使用交易 API 服務[​](#certificate_and_service "Direct link to 申請使用交易 API 服務")

進入 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout) 點選 **登入** 按鈕 (如下圖)

![金鑰申請頁面](/assets/images/key_01-bf05beac827475e7c294a4a03b733214.jpg)

使用您的證券帳號登入系統 (如下圖)

![金鑰申請頁面](/assets/images/key_02-662d8b3bd70c3e10101ad82c264cd673.jpg)

有富果帳戶卻無法登入怎麼辦？

因 富果交易 API 屬於玉山證券富果帳戶的專屬服務，所以您必須使用 「8840 經紀本部」或「884M 數位分公司」進行登入，詳情可參考 [更換分公司說明](https://support.fugle.tw/fugle-member-account/fugle-login/5850/)！

##### 申請憑證[​](#申請憑證 "Direct link to 申請憑證")

依照頁面顯示步驟申請憑證 (如下圖)

![金鑰申請頁面](/assets/images/key_03-0eac7829a236f346ff8b7a877103b4dc.jpg)

##### 簽署 API 服務申請同意書[​](#簽署-api-服務申請同意書 "Direct link to 簽署 API 服務申請同意書")

請勾選同意書內容 (如下圖)

![金鑰申請頁面](/assets/images/key_04-3fcd2e058ce7dfaefe42079ffa57bff0.jpg)

##### 等待審核[​](#等待審核 "Direct link to 等待審核")

送出申請後，您會同時收到一封標題為「【玉山證券富果帳戶】已收到您的交易 API 申請資料」的信件，審核過程約 1 至 3 個工作天。如未收到信件或審核超過 3 個工作天(不含假日)，請聯絡 [技術客服](mailto:tech.support@fugle.tw) 反應。

caution

審核通過後，您會收到一封標題為「【玉山證券富果帳戶】交易 API 申請完成通知」的信件。

#### 進行模擬測試[​](#run_simulation "Direct link to 進行模擬測試")

##### 申請模擬環境金鑰[​](#申請模擬環境金鑰 "Direct link to 申請模擬環境金鑰")

審核通過後，請您再次登入 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout)，即可看到模擬金鑰申請畫面 (如下圖)

![金鑰申請頁面](/assets/images/key_06-f91eee37a452ce746ac02b53e63bc465.png)

1. `取得憑證檔案` - 請點擊左下角「匯出憑證」並輸入憑證密碼，下載 `ID_DATE.p12` 憑證檔案 (檔名為身份證字號 + 憑證過期日)。

   什麼是憑證密碼？

   憑證密碼是指您之前申請憑證時所設置的密碼，示意圖如下：

   ![憑證密碼申請頁面](/assets/images/config_01-12164d6420c57c7bf30f38d696d716ae.jpg)

2. `取得模擬環境設定檔` - 點擊右上角「新增模擬金鑰」->「下載金鑰」，下載 `config.simulation.ini.example` 模擬環境設定檔。

3. `增加白名單` - 頁面會顯示已建立的金鑰內容，請一併將您稍後會執行程式的 IP 位址加入「模擬 IP 白名單」，以便模擬環境能夠允許您的連線。(如下圖)

![金鑰申請頁面](/assets/images/key_06_2-7c690398ec159df74dd0805f3fbb2626.jpg)

caution

若您屬於非固定 IP 的使用者 ex. Colab, 非固定 IP 的公司/家用網路，您可以暫時將 IP 白名單設定為 0.0.0.0/0（允許全部來源 IP），以便進行開發測試。

您的資料夾結構應該會像是這樣

```text
.
├── config.simulation.ini
└── ID_DATE.p12

```

如果您首次執行，您的模擬 API 金鑰管理頁面將會出現一筆模擬金鑰(如下圖)

![金鑰申請頁面](/assets/images/key_07-5e882b6b7d321af1fa819f1f5d9e4a99.png)

##### 修改模擬環境設定檔[​](#修改模擬環境設定檔 "Direct link to 修改模擬環境設定檔")

將 `模擬環境` 範例的設定檔改名成 `config.simulation.ini`，並在設定檔 \[CERT] -> Path 刪除 `;Your Cert File Path Ex: ./python/cert.p12` 範例後，填入您的憑證檔 (ID\_DATE.p12) 路徑 ([如何取得正確路徑](https://developer.fugle.tw/docs/faq/trading/error_C00000#step1))

```python
# config.simulation.ini

[Core]
Entry = https://fugletradingapi-simulation.esunsec.com.tw/api/v1
Environment = SIMULATION
[Cert]
Path = ;Your Cert File Path Ex: ./python/cert.p12
[Api]
Key = XXXXXXXXXXXXXXXX
Secret = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
[User]
Account = 884XXXXXXXX

```

##### 安裝套件[​](#安裝套件 "Direct link to 安裝套件")

* Python
* Node.js

```python
pip install fugle-trade -U

```

目前支援 Python 3.7, 3.8, 3.9, 3.10 等版本。

```jsx
npm install --save @fugle/trade

```

目前支援 Node.js 16 以上版本。

##### 完成模擬下單[​](#完成模擬下單 "Direct link to 完成模擬下單")

* Python
* Node.js

您可以在與憑證及設定檔相同的資料夾內新增 `index.py`，使用以下內容進行連線測試

```python
from configparser import ConfigParser
from fugle_trade.sdk import SDK
from fugle_trade.order import OrderObject
from fugle_trade.constant import (APCode, Trade, PriceFlag, BSFlag, Action)
# 讀取設定檔
config = ConfigParser()
config.read('./config.simulation.ini')
# 登入
sdk = SDK(config)
sdk.login()
# 建立委託物件
order = OrderObject(
    buy_sell = Action.Buy,
    price_flag = PriceFlag.LimitDown,
    price = None,
    stock_no = "2884",
    quantity = 1,
)
sdk.place_order(order)
print("Your order has been placed successfully.")

```

程式會跳出提示，請您輸入玉山證券富果帳戶的登入密碼以及憑證密碼：

```bash
# 執行程式
$ python index.py
Enter esun account password: # 請輸入您玉山證券富果帳戶的登入密碼
Enter cert password: # 請輸入您的憑證密碼
Your order has been placed successfully.

```

不小心輸入錯誤密碼怎麼辦？

您可以執行 `sdk.reset_password()`，重新輸入玉山證券富果帳戶的登入密碼及憑證密碼再重新登入，範例如下：

```python
from configparser import ConfigParser
from fugle_trade.sdk import SDK
from fugle_trade.order import OrderObject
from fugle_trade.constant import (APCode, Trade, PriceFlag, BSFlag, Action)

config = ConfigParser()
config.read('./config.simulation.ini') # 請換上您正在使用的 config 檔案
sdk = SDK(config)
sdk.reset_password() # 此函數用來重設密碼
sdk = SDK(config)
sdk.login()

```

若想了解更多可參考 [相關文件](https://developer.fugle.tw/docs/trading/reference/python#reset_password) !

您可以在與憑證及設定檔相同的資料夾內新增 `index.js`，使用以下內容進行連線測試

```jsx
import { FugleTrade, Order } from '@fugle/trade';
// 環境設定
const fugle = new FugleTrade({
    configPath: './config.simulation.ini',
});
// 登入
await fugle.login();
// 建立委託物件
const order = new Order({
    buySell: Order.Side.Buy,
    price: '',
    stockNo: '2884',
    quantity: 1,
    apCode: Order.ApCode.Common,
    priceFlag: Order.PriceFlag.LimitDown,
    bsFlag: Order.BsFlag.ROD,
    trade: Order.Trade.Cash,
});
// 送出委託
await fugle.placeOrder(order);
console.log("Your order has been placed successfully.");

```

程式會跳出提示，請您輸入玉山證券富果帳戶的登入密碼以及憑證密碼：

```bash
# 執行程式
$ node index.js
Enter esun account password # 請輸入您玉山證券富果帳戶的登入密碼
Enter cert password # 請輸入您的憑證密碼
Your order has been placed successfully.

```

不小心輸入錯誤密碼怎麼辦？

您可以執行 `fugle.logout()`function 進行登出後再重新登入，

也可試試預先配置帳號及憑證密碼， 詳情可參考：[Node.js reference](https://developer.fugle.tw/docs/trading/reference/nodejs#constructor-new-fugletradeoptions) !

caution

您可以透過模擬環境測試您的下單、查詢委託等指令，唯目前模擬環境在接單後不會有模擬成交之行為，其帳務及交易商品等資訊亦不保證與正式環境相同。

info

若程式執行成功，稍後您會收到一封標題為「【玉山證券】交易 API 正式金鑰申請通知」的信件，代表您已完成模擬環境的連線測試，可以申請正式金鑰了！

恭喜您已完成開通！立刻開始使用交易 API 來撰寫策略，進行實單交易吧！

請您再次登入 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout)，即可看到頁面左側選單有新增 [API 金鑰管理](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout/apikey/APIKeyManagement) 的功能 (如下圖)，您可依照之前建立模擬金鑰的操作方式，下載正式環境的金鑰及設定檔。

![金鑰申請頁面](/assets/images/key_08-aa53a9bf30931b793a2fc96611b5e87d.png)


---

### 快速開始

#### 確認環境[​](#確認環境 "Direct link to 確認環境")

請參考 [事前準備](https://developer.fugle.tw/docs/trading/prerequisites.md) 完成相關檔案下載及連線測試，並確認您的資料夾內已經有準備好**正式環境的憑證**及**設定檔**。

您的資料夾結構應該像是：

```text
.
├── config.ini
└── XXXXXXXXXX_XXXXXXXX.p12

```

若您尚未安裝 SDK 套件，可使用以下指令安裝：

* Python
* Node.js

```
pip install fugle-trade -U
```

目前支援 Python 3.7, 3.8, 3.9, 3.10 等版本。

```
npm install --save @fugle/trade
```

目前支援 Node.js 16 以上版本。

#####

* Python
* Node.js

若您未曾使用 SDK 進行過登入，或更換了 SDK 執行環境，請在資料夾新增一個 `index.py` 檔案，貼上以下內容並執行：

```python
from configparser import ConfigParser
from fugle_trade.sdk import SDK

# 讀取設定檔
config = ConfigParser()
config.read('./config.ini')
# 將設定檔內容寫至 SDK 中，並確認是否已設定密碼
sdk = SDK(config)

```

程式會跳出提示，請您輸入玉山證券富果帳戶的登入密碼以及憑證密碼：

```bash
# 執行程式
$ python index.py
Enter esun account password: # 請輸入您玉山證券富果帳戶的登入密碼
Enter cert password: # 請輸入您的憑證密碼

```

若您未曾使用 SDK 進行過登入，或更換了 SDK 執行環境，請在資料夾新增一個 `index.js` 檔案，貼上以下內容並執行：

```js
import { FugleTrade, Order } from '@fugle/trade';

// 以 config.ini 設定檔初始化新的 SDK 物件
const fugle = new FugleTrade({
    configPath: './config.ini',
});

// 登入
await fugle.login();

```

程式會跳出提示，請您輸入玉山證券富果帳戶的登入密碼以及憑證密碼：

```bash
# 執行程式
$ node index.js
Enter esun account password # 請輸入您玉山證券富果帳戶的登入密碼
Enter cert password # 請輸入您的憑證密碼

```

info

因資安要求，SDK 暫不提供於設定檔中直接使用明文設定密碼的功能。

#### 送出第一筆正式委託[​](#送出第一筆正式委託 "Direct link to 送出第一筆正式委託")

caution

提醒您，取得正式環境的使用權限前，您必須至少在模擬環境送出過一筆委託。

以下範例程式碼將示範如何使用富果交易 API 送出一張以跌停價買入 玉山金 (2884) 的限價委託單：

* Python
* Node.js

```python
from configparser import ConfigParser
from fugle_trade.sdk import SDK
from fugle_trade.order import OrderObject
from fugle_trade.constant import (APCode, Trade, PriceFlag, BSFlag, Action)
# 讀取設定檔
config = ConfigParser()
config.read('./config.ini')
sdk = SDK(config)
# 登入
sdk.login()
# 建立委託物件
order = OrderObject(
    buy_sell = Action.Buy,
    price_flag = PriceFlag.LimitDown,
    price = None,
    stock_no = "2884",
    quantity = 2,
    ap_code = APCode.Common
)
sdk.place_order(order)

```

```bash
# 執行程式
$ python index.py

```

```jsx
import { FugleTrade, Order } from '@fugle/trade';
// 環境設定
const fugle = new FugleTrade({
    configPath: './config.simulation.ini',
});
// 登入
await fugle.login();
// 建立委託物件
const order = new Order({
    buySell: Order.Side.Buy,
    price: '',
    stockNo: '2884',
    quantity: 1,
    apCode: Order.ApCode.Common,
    priceFlag: Order.PriceFlag.LimitDown,
    bsFlag: Order.BsFlag.ROD,
    trade: Order.Trade.Cash,
});
// 送出委託
await fugle.placeOrder(order);

```

```bash
# 執行程式
$ node index.js

```

caution

在執行任何 API 呼叫之前，必須先進行一次登入。

恭喜你！你已經成功用交易 API 完成了第一筆委託！您可以開始撰寫自己的交易演算法，或到 [實例應用](https://developer.fugle.tw/blog) 參考更多的範例程式碼。


---

### Changelog

#### Python[​](#python "Direct link to Python")

最新版本：1.1.2

[Changelog](https://github.com/fugle-dev/fugle-trade-python/blob/master/CHANGELOG.md)

#### Node.js[​](#nodejs "Direct link to Node.js")

最新版本：2.0.0

[Changelog](https://github.com/fugle-dev/fugle-trade-node/blob/master/CHANGELOG.md)


---

### 錯誤代碼

| 代碼    | 意義                                        | 說明                                                                                                                                                                        |
| ------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AG00000 | Parameter error                             | 參數錯誤                                                                                                                                                                    |
| AG00001 | Cert error                                  | 驗章錯誤！可能因憑證過期 或 刪掉憑證後，又使用該憑證會出現此錯訊；建議您可以到 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout) 重新匯出憑證 |
| AG00003 | OrdNo Error                                 | 單號不存在, 刪改單的參數錯誤                                                                                                                                                |
| AG00004 | The trading system is temporarily suspended | 目前交易系統暫停服務中，請稍後再試                                                                                                                                          |
| AG00005 | This order cannot be deleted                | 此單目前不可刪除 ex. Flag 是 False 就不能刪單                                                                                                                               |
| AG00006 | Reservation order cannot be changed         | 預約單不可改單，請刪單後重新下單                                                                                                                                            |

| 代碼    | 意義                        | 說明                                                                                                                                                                                                  |
| ------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AGA0000 | login error                 | 您所輸入的登入密碼錯誤，可參考 [如何重設密碼](https://developer.fugle.tw/docs/trading/reference/python#reset_password) 重新登入                                                                       |
| AGA0001 | Missing Header              | -                                                                                                                                                                                                     |
| AGA0002 | Invalid IP                  | 屬於 IP 問題，建議您到 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout) 新增您目前的 IP，或參考 [解決方法](https://developer.fugle.tw/docs/faq/trading/error_AGA0002/) |
| AGA0003 | Invalid Signature           | 可能是設定檔的 secret 有問題；建議您到 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout) 新增新金鑰來解決                                                               |
| AGA0004 | Invalid Nonce               | -                                                                                                                                                                                                     |
| AGA0005 | Invalid Timestamp           | 可能因電腦 local 時間與 server 時間不一致所導致，建議您將電腦 local 時間調整為自動設定時間                                                                                                            |
| AGA0006 | No Such Key                 | 可能因設定檔的 key 不小心修改到所導致；建議您到 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout) 新增新金鑰來解決                                                      |
| AGA0007 | Key Is Invalid              | 您的 key 可能不小心刪除了，建議您到 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Home/Index) 重新新增金鑰，並使用新的金鑰設定檔試試                                                |
| AGA0008 | Invalid Scope               | 假設您使用帳務的金鑰去做交易的行為，或反之皆會跳出此錯誤；建議您可以到 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout) 修改金鑰權限或是新增新金鑰                     |
| AGA0009 | Not Allowed to Use          | -                                                                                                                                                                                                     |
| AGA0010 | Not Allowed To Login        | 您可能未完成金鑰申請流程，或帳號已暫停使用；請聯繫 [客服](mailto:tech.support@fugle.tw) 並提供錯訊內容、您的手機號碼以及證券帳號，由客服為您聯繫處理                                                  |
| AGA0011 | Not Allowed Account Type    | API 目前僅限於玉山證券富果帳戶專屬，未來將陸續開放更多服務，敬請期待！                                                                                                                                |
| AGA0012 | Key And Login Account Error | 可能因不小心修改到設定檔中的 Key 跟 Account 數值所導致；建議您到 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout) 新增新的金鑰來解決                                   |

若嘗試過以上說明引導後仍有此錯訊，請聯繫 [客服](mailto:tech.support@fugle.tw) 並提供錯訊內容、您的手機號碼以及證券帳號，由客服為您聯繫處理！

| 代碼    | 意義                                             | 說明                                                                                                                                                                                |
| ------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AGR0000 | Exceed Login Rate Limit                          | 已達玉證控管的登入次數上限，請 1 分鐘後再試；若需要更高權限，請聯繫 [技術客服](mailto:tech.support@fugle.tw)                                                                        |
| AGR0001 | Exceed User Daily Order Rate Limit `{userLimit}` | 已達玉證單日控管的委託次數上限；若需要更高權限或解鎖，請聯繫 [技術客服](mailto:tech.support@fugle.tw)                                                                               |
| AGR0002 | Exceed User Second Order Rate Limit              | 已達玉證每秒控管的委託次數上限，請 1 分鐘後再試；若需要更高權限，請聯繫 [技術客服](mailto:tech.support@fugle.tw)                                                                    |
| AGR0003 | Exceed Transaction Rate Limit                    | 因帳務資料有 [抓取限制](https://developer.fugle.tw/docs/trading/reference/rate_limit.md#%E4%BA%A4%E6%98%93%E5%8F%8A%E5%B8%B3%E5%8B%99-function-%E9%99%90%E5%88%B6)，請 1 分鐘後再試 |
| AGR0004 | Exceed Login Daily Rate Limit `{userLimit}`      | 已達玉證單日控管的登入次數上限；若需要更高權限或解鎖，請聯繫 [技術客服](mailto:tech.support@fugle.tw)                                                                               |
| AGR0005 | Exceed OrderResult Rate Limit                    | 已達玉證每秒控管次數上限，請 1 分鐘後再試；若需要更高權限，請聯繫 [技術客服](mailto:tech.support@fugle.tw)                                                                          |
| AGR0006 | Exceed Settlement Query Rate Limit               | 因帳務資料有 [抓取限制](https://developer.fugle.tw/docs/trading/reference/rate_limit.md#%E4%BA%A4%E6%98%93%E5%8F%8A%E5%B8%B3%E5%8B%99-function-%E9%99%90%E5%88%B6)，請 1 分鐘後再試 |

| 代碼    | 意義              | 說明             |
| ------- | ----------------- | ---------------- |
| AWA0001 | Missing Header    | -                |
| AWA0004 | Invalid Nonce     | -                |
| AWA0005 | Invalid Timestamp | 請檢查本機端時間 |

| 代碼    | 意義     | 說明                                                             |
| ------- | -------- | ---------------------------------------------------------------- |
| AW00000 | 參數錯誤 | 可能是 SDK 版本問題，請確認 SDK 版本是否已更新                   |
| AW00001 | 參數錯誤 | 可能是 SDK 版本問題，請確認 SDK 版本是否已更新                   |
| AW00002 | 參數錯誤 | 成交明細的查詢日期超過範圍限制，請調整您的開始日期或結束日期     |
| AW00003 | 參數錯誤 | 歷史委託列表的查詢日期超過範圍限制，請調整您的開始日期或結束日期 |

| 代碼   | 意義                   | 說明                                                                                                                                                                  |
| ------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C00000 | certs file open failed | 可能遇到檔案權限問題 或 檔案路徑問題，您可以參考  [解決方法](https://developer.fugle.tw/docs/faq/trading/error_C00000)                                                |
| C00001 | key error              | 憑證檔案 (.p12) 有錯誤，可能非玉證的憑證檔 或 編輯時不小心修改；建議您到 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout) 重新匯出憑證 |
| C00002 | certs error            | 憑證檔案 (.p12) 有錯誤，可能非玉證的憑證檔 或 編輯時不小心修改；建議您到 [交易 API 金鑰網站](https://fugletradingapi.esunsec.com.tw/keys/Account/Logout) 重新匯出憑證 |
| C00003 | password may be wrong  | 您輸入的憑證密碼錯誤，可參考 [解決方法](https://developer.fugle.tw/docs/faq/trading/error_C00003)                                                                     |
| C00004 | load keys error        | 可能因電腦記憶體不足所導致。                                                                                                                                          |
| C00005 | certs error            | 憑證已過期                                                                                                                                                            |

| 代碼   | 意義             | 說明                                     |
| ------ | ---------------- | ---------------------------------------- |
| A00001 | JSON parse Error | 與 server 的 Get request 有問題          |
| A00002 | JSON parse Error | 與 server 的 Post request 有問題         |
| A00003 | 憑證跟帳號不合   | 很可能用到非本人的憑證                   |
| A00004 | JSON parse Error | 與 server 的 request 有問題              |
| A00005 | 參數錯誤         | transaction 要用 0d|3d|1m|3m 這些參數 |
| A00006 | 參數錯誤         | 日期格式錯誤                             |

| 代碼   | 意義                                                       | 說明                                                                                                                                                                                                                                       |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| O00001 | must use valid apcode                                      | 可能輸入錯誤的盤別，Python 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/python/#apcode) / Node.js 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/nodejs/#class-property-orderapcode)           |
| O00002 | must use valid bs                                          | 可能輸入錯誤的買賣別，Python 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/python/#action) / Node.js 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/nodejs/#class-property-orderside)           |
| O00003 | must use valid trade                                       | 可能輸入錯誤的交易類別， Python 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/python#trade) / Node.js 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/nodejs/#event-trade)                       |
| O00004 | must use valid price\_flag                                 | 可能輸入錯誤的價格旗標， Python 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/python#priceflag) / Node.js 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/nodejs/#class-property-orderpriceflag) |
| O00005 | must use valid bs\_flag                                    | 可能輸入錯誤的委託條件， Python 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/python#bsflag) / Node.js 版可參考 [此連結](https://developer.fugle.tw/docs/trading/reference/nodejs/#class-property-orderbsflag)       |
| O00006 | quantity value error                                       | 成交量數值有誤                                                                                                                                                                                                                             |
| O00007 | quantity must <!-- -->><!-- --> 0                          | 成交量需大於 0                                                                                                                                                                                                                             |
| O00008 | quantity must <!-- --><=<!-- --> 499                       | 成交量張數須小於 499 張                                                                                                                                                                                                                    |
| O00009 | quantity must <!-- --><=<!-- --> 999                       | 成交量股數須小於 999 股                                                                                                                                                                                                                    |
| O00010 | quantity must <!-- --><=<!-- --> 499000                    | 因興櫃股票成交量以股為單位，因此興櫃股票的整股股數須小於 499000 股                                                                                                                                                                         |
| O00011 | quantity must be multiple of 1000, or any value under 1000 | 因興櫃股票目前的交易機制已區分整股及零股；因此在掛興櫃股票時，須留意成交量股數需要是 1000 的倍數或是小於 1000 的股數                                                                                                                       |
| O00012 | In after market, price\_flag can only be Limit             | 盤後定價的價格旗標，只能選擇 `限價`                                                                                                                                                                                                        |
| O00013 | price must be valid float string                           | -                                                                                                                                                                                                                                          |
| O00014 | price should be None if priceFlag not Limit                | 在價格旗標非使用`限價`時 ，須將委託價格填寫 `None`                                                                                                                                                                                         |
| O00015 | price\_flag can only be Limit if APCode is Emg             | 興櫃股票的價格旗標，只能選擇 `限價`                                                                                                                                                                                                        |
| O00016 | Trade can only be Cash if APCode is Emg                    | 興櫃股票只能使用 `現股` 的盤別                                                                                                                                                                                                             |
| O00017 | price\_flag must 0, bs\_flag must R                        | 改單的時候，只有限價單可以改單、改量 (R=ROD)                                                                                                                                                                                               |


---

### Node.js

#### 目錄[​](#目錄 "Direct link to 目錄")

* [Class: FugleTrade](#class-fugletrade)

  * [Constructor: new FugleTrade(options)](#constructor-new-fugletradeoptions)

  * [fugle.login()](#fuglelogin)

  * [fugle.logout()](#fuglelogout)

  * [fugle.placeOrder(order)](#fugleplaceorderorder)

  * [fugle.getOrders()](#fuglegetorders)

  * [fugle.replacePrice(order, price)](#fuglereplacepriceorder-price)

  * [fugle.replaceQuantity(order, quantity)](#fuglereplacequantityorder-quantity)

  * [fugle.cancelOrder(order)](#fuglecancelorderorder)

  * [fugle.getHistoricalOrders()](#fuglegethistoricalorders)

  * [fugle.getTransactions(options)](#fuglegettransactionsoptions)

  * [fugle.getInventories()](#fuglegetinventories)

  * [fugle.getSettlements()](#fuglegetsettlements)

  * [fugle.getBalance()](#fuglegetbalance)

  * [fugle.getTradeStatus()](#fuglegettradestatus)

  * [fugle.getMarketStatus()](#fuglegetmarketstatus)

  * [fugle.getKeyInfo()](#fuglegetkeyinfo)

  * [fugle.getCertInfo()](#fuglegetcertinfo)

  * [fugle.getMachineTime()](#fuglegetmachinetime)

  * [fugle.streamer](#fuglestreamer)

    * [Event: 'connect'](#event-connect)
    * [Event: 'disconnect'](#event-disconnect)
    * [Event: 'order'](#event-order)
    * [Event: 'trade'](#event-trade)
    * [Event: 'message'](#event-message)
    * [Event: 'error'](#event-error)

  * [fugle.streamer.connect()](#fuglestreamerconnect)

  * [fugle.streamer.disconnect()](#fuglestreamerdisconnect)

* [Class: Order](#class-order)

  * [Class property: Order.Side](#class-property-orderside)
  * [Class property: Order.ApCode](#class-property-orderapcode)
  * [Class property: Order.PriceFlag](#class-property-orderpriceflag)
  * [Class property: Order.BsFlag](#class-property-orderbsflag)
  * [Class property: Order.TradeType](#class-property-ordertradetype)
  * [Constructor new Order(payload)](#constructor-new-orderpayload)
  * [order.setSymbol(symbol)](#ordersetsymbolsymbol)
  * [order.setSide(side)](#ordersetsideside)
  * [order.setPrice(price)](#ordersetpriceprice)
  * [order.setQuantity(quantity)](#ordersetquantityquantity)
  * [order.setApCode(apCode)](#ordersetapcodeapcode)
  * [order.setPriceFlag(priceFlag)](#ordersetpriceflagpriceflag)
  * [order.setBsFlag(bsFlag)](#ordersetbsflagbsflag)
  * [order.setTrade(trade)](#ordersettradetrade)
  * [order.toObject()](#ordertoobject)

#### Class: FugleTrade[​](#class-fugletrade "Direct link to Class: FugleTrade")

此類別代表使用遠端伺服器服務的客戶端。

##### Constructor: `new FugleTrade(options)`[​](#constructor-new-fugletradeoptions "Direct link to constructor-new-fugletradeoptions")

為 `FugleTrade` 設置可配置選項。請注意，必須指定 `configPath` 或 `config` 選項。

* `options` {Object} 為 `FugleTrade` 設置可配置選項。請注意，必須指定 `configPath` 或 `config` 選項。

  <!-- -->

  * `configPath` {string} 透過路徑載入配置文件。

  * `config` {Object} 設置配置變數。可用的屬性為：

    <!-- -->

    * `apiUrl` {string} 富果交易 API URL。
    * `apiKey` {string} 富果交易 API 金鑰。
    * `apiSecret` {string} 富果交易 API 私鑰。
    * `certPath` {string} 憑證路徑。
    * `certPass` {string} 憑證密碼。
    * `aid` {string} 證券帳號。
    * `password` {string} 帳號密碼。

建立一個新的 `FugleTrade` 實體。

##### `fugle.login()`[​](#fuglelogin "Direct link to fuglelogin")

* Returns: {Promise} 成功後回傳 `undefined`。

登入到遠端伺服器以開始使用服務。

```js
const { FugleTrade } = require('@fugle/trade');

const fugle = new FugleTrade({ configPath: '/path/to/config.ini' });

fugle.login().then(() => {
  // Do something
});

```

##### `fugle.logout()`[​](#fuglelogout "Direct link to fuglelogout")

* Returns: {Promise} 成功後回傳 `undefined`。

登出並刪除登入帳號的驗證憑據。

```js
fugle.logout().then(() => {
  // Do something
});

```

##### `fugle.placeOrder(order)`[​](#fugleplaceorderorder "Direct link to fugleplaceorderorder")

* `order` {Order} 要下的委託單。
* Returns: {Promise} 成功後回傳 {PlaceOrderResponse}。

使用登入帳號下委託單。

```js
const { FugleTrade, Order } = require('@fugle/trade');

const fugle = new FugleTrade({ configPath: '/path/to/config.ini' });

fugle.login().then(() => {
  const order = new Order({
    buySell: Order.Side.Buy,
    price: 25.00,
    stockNo: '2884',
    quantity: 1,
    apCode: Order.ApCode.Common,
    priceFlag: Order.PriceFlag.Limit,
    bsFlag: Order.BsFlag.ROD,
    trade: Order.Trade.Cash,
  });
  fugle.placeOrder(order).then((res) => console.log(res));
});

// Prints:
// {
//   ordDate: '20220310',  // 委託日期
//   ordTime: '094932438', // 委託時間
//   ordType: '2',         // 委託單狀態 (1:預約單 2:盤中單)
//   ordNo: 'A4461',       // 委託序號
//   retCode: '000000',    // 處理結果代碼
//   retMsg: '',           // 錯誤訊息
//   workDate: '20220310'  // 有效交易日期
// }

```

##### `fugle.getOrders()`[​](#fuglegetorders "Direct link to fuglegetorders")

* Returns: {Promise} 成功後回傳 {OrderResult\[]}。

取得登入帳號的現有委託單。

```js
fugle.login().then(() => {
  fugle.getOrders().then(res => console.log(res[0].toObject()));
});

// Prints: 
// {
//   apCode: '1',          // 盤別
//   avgPrice: 0.0,        // 成交均價
//   bsFlag: 'R',          // 委託條件
//   buySell: 'B',         // 買賣別
//   celQty: 1,            // 已取消數量 (張)
//   celQtyShare: 1000,    // 已取消數量 (股)
//   celable: '2',         // 可取消狀態 (1:可取消 2:不可取消)
//   errCode: '00000000',  // 錯誤碼
//   errMsg: '',           // 錯誤訊息
//   matQty: 0,            // 已成交數量 (張)
//   matQtyShare: 0,       // 已成交數量 (股)
//   odPrice: 25.95,       // 委託價格
//   ordDate: '20220310',  // 原始委託日期
//   ordNo: 'A4461',       // 委託書編號
//   ordStatus: '2',       // 預約狀態 (1:預約單 2:盤中單)
//   ordTime: '094932438', // 原始委託時間
//   orgQty: 1,            // 原始委託數量 (張)
//   orgQtyShare: 1000,    // 原始委託數量 (股)
//   preOrdNo: '',         // 預約單編號
//   priceFlag: '2',       // 價格旗標
//   stockNo: '2884',      // 股票代號
//   trade: '0',           // 交易類別
//   workDate: '20220310', // 有效交易日期
//   memo: ''              // 自訂欄位
// }

```

##### `fugle.replacePrice(order, price)`[​](#fuglereplacepriceorder-price "Direct link to fuglereplacepriceorder-price")

* `order` {PlacedOrder} 要更改的進行中委託單。
* `price` {number | Order.PriceFlag} 更改的價格。
* Returns: {Promise} 成功後回傳 {ReplaceOrderResponse}。

更改登入帳號的進行中委託單的價格。

```js
fugle.login().then(() => {
  fugle.getOrders().then(orders => {
    const [ order, ...others ] = orders;
    fugle.replacePrice(order, 24.5).then(res => console.log(res));
  });
});

// Prints:
// {
//   retCcode: '000000',  // 處理結果代碼
//   retMsg: '',          // 錯誤訊息
//   ordDate: '20220310', // 修改委託日期
//   ordTime: '104605207' // 修改委託時間
// }

```

##### `fugle.replaceQuantity(order, quantity)`[​](#fuglereplacequantityorder-quantity "Direct link to fuglereplacequantityorder-quantity")

* `order` {PlacedOrder} 要更改的進行中委託單。
* `quantity` {number} 更改的數量。
* Returns: {Promise} 成功後回傳 {ReplaceOrderResponse}。

更改登入帳號的進行中委託單的數量。

```js
fugle.login().then(() => {
  fugle.getOrders().then(orders => {
    const [ order, ...others ] = orders;
    fugle.replaceQuantity(order, 1).then(res => console.log(res));
  });
});

// Prints:
// {
//   retCcode: '000000',  // 處理結果代碼
//   retMsg: '',          // 錯誤訊息
//   ordDate: '20220310', // 修改委託日期
//   ordTime: '104605207' // 修改委託時間
// }

```

##### `fugle.replaceOrder(order, options)`[​](#fuglereplaceorderorder-options "Direct link to fuglereplaceorderorder-options")

* `order` {PlacedOrder} 要更改的進行中委託單。

* `options` {Object} 設置可配置的選項來更改委託單。

  <!-- -->

  * `price` {number | Order.PriceFlag} 更改的價格。
  * `quantity` {number} 更改的數量。

* Returns: {Promise} 成功後回傳 {ReplaceOrderResponse}。

更改登入帳號的進行中委託單的價格或數量。請注意，必須指定 `price` 或 `quantity` 選項，且只有一個選項可以被指定。

```js
fugle.login().then(() => {
  fugle.getOrders().then(orders => {
    const [ order, ...others ] = orders;
    const options = { price: 24.5 , quantity: 1 };
    fugle.replaceOrder(order, options).then(res => console.log(res));
  });
});

// Prints:
// {
//   retCcode: '000000',  // 處理結果代碼
//   retMsg: '',          // 錯誤訊息
//   ordDate: '20220310', // 修改委託日期
//   ordTime: '104605207' // 修改委託時間
// }

```

##### `fugle.cancelOrder(order)`[​](#fuglecancelorderorder "Direct link to fuglecancelorderorder")

* `order` {PlacedOrder} 要取消的進行中委託單。
* Returns: {Promise} 成功後回傳 {ReplaceOrderResponse}。

取消登入帳號的進行中委託單。

```js
fugle.login().then(() => {
  fugle.getOrders().then(orders => {
    const [ order, ...others ] = orders;
    fugle.cancelOrder(order).then(res => console.log(res));
  });
});

// Prints:
// {
//   retCcode: '000000',  // 處理結果代碼
//   retMsg: '',          // 錯誤訊息
//   ordDate: '20220310', // 修改委託日期
//   ordTime: '104605207' // 修改委託時間
// }

```

##### `fugle.getHistoricalOrders()`[​](#fuglegethistoricalorders "Direct link to fuglegethistoricalorders")

* `options` {Object} 設置可配置的選項取得歷史委託單。

  <!-- -->

  * `startDate` {string} 開始日期。
  * `endDate` {string} 結束日期。

* Returns: {Promise} 成功後回傳 {OrderResult\[]}。

取得登入帳號的歷史委託單。

```js
fugle.login().then(() => {
  const options = { startDate: '2022-03-01', endDate: '2022-03-31' };
  fugle.getHistoricalOrders().then(res => console.log(res[0].toObject()));
});

// Prints: 
// {
//   apCode: '1',          // 盤別
//   avgPrice: 0.0,        // 成交均價
//   bsFlag: 'R',          // 委託條件
//   buySell: 'B',         // 買賣別
//   celQty: 1,            // 已取消數量 (張)
//   celQtyShare: 1000,    // 已取消數量 (股)
//   celable: '2',         // 可取消狀態 (1:可取消 2:不可取消)
//   errCode: '00000000',  // 錯誤碼
//   errMsg: '',           // 錯誤訊息
//   matQty: 0,            // 已成交數量 (張)
//   matQtyShare: 0,       // 已成交數量 (股)
//   odPrice: 25.95,       // 委託價格
//   ordDate: '20220310',  // 原始委託日期
//   ordNo: 'A4461',       // 委託書編號
//   ordStatus: '2',       // 預約狀態 (1:預約單 2:盤中單)
//   ordTime: '094932438', // 原始委託時間
//   orgQty: 1,            // 原始委託數量 (張)
//   orgQtyShare: 1000,    // 原始委託數量 (股)
//   preOrdNo: '',         // 預約單編號
//   priceFlag: '2',       // 價格旗標
//   stockNo: '2884',      // 股票代號
//   trade: '0',           // 交易類別
//   workDate: '20220310', // 有效交易日期
//   memo: ''              // 自訂欄位
// }

```

##### `fugle.getTransactions(options)`[​](#fuglegettransactionsoptions "Direct link to fuglegettransactionsoptions")

* `options` {Object} 設置可配置的選項取得成交明細。

  <!-- -->

  * `duration` {string} 可設定 `0d` (日內), `3d` (近三日), `1m` (近一月) 或 `3m` (近三月)。
  * `startDate` {string} 開始日期。
  * `endDate` {string} 結束日期。

* Returns: {Promise} 成功後回傳 {Trade\[]}。

取得登入帳號的成交明細。

```js
fugle.login().then(() => {
  fugle.getTransactions({ duration: '0d' }).then(res => console.log(res[0]));
});

// Prints:
// {                                // <匯總>
//   buySell: 'S',                  // 買賣別
//   cDate: '20220314',             // 交割日期
//   cost: '-16410',                // 已實現損益成本小計
//   make: '7933',                  // 已實現損益
//   makePer: '48.34',              // 已實現獲利率
//   priceAvg: '24.45',             // 成交均價
//   priceQty: '24450',             // 價金小計
//   qty: '1000',                   // 成交數量
//   recv: '24343',                 // 已實現損益收入小計
//   stkNa: '玉山金',                // 股票名稱
//   stkNo: '2884',                 // 股票代號
//   sType: 'H',                    // 市場別 (H:上市 O:上櫃 R:興櫃)
//   tDate: '20220310',             // 成交日期
//   trade: '0'                     // 交易類別 (0:現股 3:融資 4:融券 A:現股當沖賣)
//   matDats: [
//     {                            // <明細>
//       buySell: 'S',              // 買賣別
//       cDate: '20220314',         // 交割日期
//       dbFee: '0',                // 融券手續費
//       fee: '34',                 // 手續費
//       make: '7933',              // 已實現損益
//       makePer: '48.34',          // 已實現獲利率
//       orderNo: 'A7828002924570', // 委託書編號
//       payN: '24343',             // 淨收付款
//       price: '24.45',            // 成交價格
//       priceQty: '24450',         // 價金
//       qty: '1000',               // 成交數量
//       sType: 'H',                // 市場別 (H:上市 O:上櫃 R:興櫃)
//       stkNa: '玉山金',            // 股票名稱
//       stkNo: '2884',             // 股票代號
//       tDate: '20220310',         // 成交日期
//       tTime: '090819800',        // 成交時間
//       tax: '73',                 // 交易稅
//       taxG: '0',                 // 證所稅
//       trade: '0',                // 交易類別 (0:現股 3:融資 4:融券 A:現股當沖賣)
//       memo: ''                   // 自訂欄位
//     }
//   ]
// }

```

##### `fugle.getInventories()`[​](#fuglegetinventories "Direct link to fuglegetinventories")

* Returns: {Promise} 成功後回傳 {Stock\[]}。

取得登入帳號的現有庫存。

```js
fugle.login().then(() => {
  fugle.getInventories().then(res => console.log(res[0]));
});

// Prints:
// {
//   apCode: '',                  // 盤別
//   costQty: '1150',             // 成本股數
//   costSum: '-103235',          // 成本總計
//   makeAPer: '51.59',           // 未實現獲利率
//   makeASum: '53255',           // 未實現損益小計
//   priceAvg: '89.63',           // 成交均價
//   priceEvn: '89.99',           // 損益平衡價
//   priceMkt: '136.45',          // 即時價格 (無假除權息)
//   priceNow: '136.45',          // 即時價格 (有假除權息)
//   priceQtySum: '103074',       // 價金總計
//   qtyB: '0',                   // 今委買股數
//   qtyBm: '0',                  // 今委買成交股數
//   qtyC: '0',                   // 調整股數 (現償/匯撥)
//   qtyL: '1150',                // 昨餘額股數
//   qtyS: '0',                   // 今委賣股數
//   qtySm: '0',                  // 今委賣成交股數
//   recVaSum: '156490',          // 未實現收入小計
//   stkNa: '元大台灣50',          // 股票名稱
//   stkNo: '0050',               // 股票代碼
//   sType: 'H',                  // 市場別 (H:上市 O:上櫃 R:興櫃)
//   trade: '0',                  // 交易類別
//   valueMkt: '13645',           // 市值 (無假除權息)
//   valueNow: '13645'            // 市值 (有假除權息)
//   stkDats: [
//     { 
//       buySell: 'B',
//       costR: '0',              // 已分攤成本
//       fee: '18',               // 手續費
//       makeA: '804',            // 未實現損益
//       makeAPer: '6.28',        // 未實現獲益率
//       ordNo: 'D3660038938518', // 委託書編號
//       payN: '-12808',          // 淨收付金額
//       price: '127.90',         // 成交價格
//       priceEvn: '128.41',      // 平衡損益價
//       qty: '100',              // 庫存股數
//       qtyC: '0',               // 調整股數 (現償/匯撥)
//       qtyH: '0',               // 實高權值股數 (維持率)
//       qtyR: '0',               // 已分攤股數
//       tDate: '20210512',       // 成交日期
//       tTime: '',               // 成交時間
//       tax: '0',                // 交易稅
//       taxG: '0',               // 證所稅
//       trade: '0',              // 交易類別
//       valueMkt: '13645',       // 市值 (無假除權息)
//       valueNow: '13645',       // 市值 (有假除權息)
//       memo: ''                 // 自訂欄位
//   }]
// }

```

##### `fugle.getSettlements()`[​](#fuglegetsettlements "Direct link to fuglegetsettlements")

* Returns: {Promise} 成功後回傳 {Settlement\[]}。

取得登入帳號的交割資訊。

```js
fugle.login().then(() => {
  fugle.getSettlements().then(res => console.log(res[0]));
});

// Prints:
// {
//   cDate: '20220310', // 交割日期
//   date: '20220308',  // 成交日期
//   price: '-80912'    // 交割款應收付金額
// }

```

##### `fugle.getBalance()`[​](#fuglegetbalance "Direct link to fuglegetbalance")

* Returns: {Promise} 成功後回傳 {BalanceStatus}。

取得登入帳號的銀行帳戶餘額。

```js
fugle.login().then(() => {
  fugle.getBalance().then(res => console.log(res));
});

// Prints:
// {
//   availableBalance: 500000,   // 可用銀行餘額
//   exchangeBalance: 100000,    // 今日票據交換金額
//   stockPreSaveAmount: 100000, // 圈存金額
//   isLatestData: true,         // 最新資料
//   updatedAt: 1676735999       // 更新時間
// }

```

##### `fugle.getTradeStatus()`[​](#fuglegettradestatus "Direct link to fuglegettradestatus")

* Returns: {Promise} 成功後回傳 {TradeStatus}。

取得登入帳號的交易額度以及信用交易等資訊。

```js
fugle.login().then(() => {
  fugle.getTradeStatus().then(res => console.log(res));
});

// Prints:
// {
//   tradeLimit: 0,       // 交易額度
//   marginLimit: 500000, // 融資額度
//   shortLimit: 500000,  // 融券額度
//   dayTradeCode: 'X',   // 現股當沖狀態代碼 (X:已啟用 Y:僅可先買後賣 N:未啟用 S:暫停中)
//   marginCode: '0',     // 融資狀態代碼 (0:可買賣 1:可買 2:可賣 9:不可買賣)
//   shortCode: '0'       // 融券狀態代碼 (0:可買賣 1:可買 2:可賣 9:不可買賣)
// }

```

##### `fugle.getMarketStatus()`[​](#fuglegetmarketstatus "Direct link to fuglegetmarketstatus")

* Returns: {Promise} 成功後回傳 {MarketStatus}。

取得市場開盤狀態。

```js
fugle.login().then(() => {
  fugle.getMarketStatus().then(res => console.log(res));
});

// Prints:
// {
//   isTradingDay: true,         // 當日是否開盤
//   lastTradingDay: '20221017', // 上個交易日期
//   nextTradingDay: '20221019'  // 下個交易日期
// }

```

##### `fugle.getKeyInfo()`[​](#fuglegetkeyinfo "Direct link to fuglegetkeyinfo")

* Returns: {Promise} 成功後回傳 {KeyInfo}。

取得登入帳號的 API 金鑰資訊。

```js
fugle.login().then(() => {
  fugle.getKeyInfo().then(res => console.log(res));
});

// Prints:
// {
//   apiKey: 'XXXXXXXXXXXXX', // API 金鑰
//   apiKeyMemo: '',          // API 金鑰備註
//   apiKeyName: '',          // API 金鑰名稱
//   createdAt: { nanos: 683000000, seconds: 1720359631 }, // API 金鑰建立時間
//   scope: 'C',              // API 金鑰權限
//   status: 1                // API 金鑰狀態
// }

```

##### `fugle.getCertInfo()`[​](#fuglegetcertinfo "Direct link to fuglegetcertinfo")

* Returns: {Promise} 成功後回傳 {CertInfo}。

取得憑證資訊。

```js
fugle.getCertInfo().then(res => console.log(res));

// Prints:
// {
//   serial: '7DA4C168'              // 憑證序號
//   isValid: true,                  // 憑證有效
//   notAfter: 1676735999,           // 憑證有效期限
//   cn: 'A123456789-00-00::PCC005'  // 憑證名稱
// }

```

##### `fugle.getMachineTime()`[​](#fuglegetmachinetime "Direct link to fuglegetmachinetime")

* Returns: {Promise} 成功後回傳 {string}。

取得遠端伺服器的機器時間。請注意，如果下單程式所在的機器時間與遠端伺服器的機器時間相差太大，有可能導致下單驗證失敗。

```js
fugle.getMachineTime().then(res => console.log(res));

// Prints: 2022-03-10 10:23:48.464

```

##### `fugle.streamer`[​](#fuglestreamer "Direct link to fuglestreamer")

* {Streamer}

一個繼承於 `EventEmitter` 的類別實體，並包含 `ws.WebSocket` 來處理 WebSocket 連線。

##### Event: `'connect'`[​](#event-connect "Direct link to event-connect")

當連線建立時觸發。

##### Event: `'disconnect'`[​](#event-disconnect "Direct link to event-disconnect")

當連線關閉時觸發。

##### Event: `'order'`[​](#event-order "Direct link to event-order")

* `data` {string} 委託回報的訊息內容。

當委託確認時觸發。收到的 `data` 是委託回報的訊息內容。

##### Event: `'trade'`[​](#event-trade "Direct link to event-trade")

* `data` {string} 成交回報的訊息內容。

當執行委託時觸發。收到的 `data` 是成交回報的訊息內容。

##### Event: `'message'`[​](#event-message "Direct link to event-message")

* `data` {string} 來自 streamer 的訊息內容。

當收到訊息時觸發。

##### Event: `'error'`[​](#event-error "Direct link to event-error")

* `error` {Error}

當發生錯誤時觸發。

##### `fugle.streamer.connect()`[​](#fuglestreamerconnect "Direct link to fuglestreamerconnect")

建立與遠端伺服器的連線。

##### `fugle.streamer.disconnect()`[​](#fuglestreamerdisconnect "Direct link to fuglestreamerdisconnect")

中斷與遠端伺服器的連線。

#### Class: `Order`[​](#class-order "Direct link to class-order")

此類別代表要下的委託單。

##### Class property: `Order.Side`[​](#class-property-orderside "Direct link to class-property-orderside")

* {enum}

| Key    | Value | Description |
| ------ | ----- | ----------- |
| `Buy`  | `'B'` | 買進        |
| `Sell` | `'S'` | 賣出        |

##### Class property: `Order.ApCode`[​](#class-property-orderapcode "Direct link to class-property-orderapcode")

* {enum}

| Key           | Value | Description |
| ------------- | ----- | ----------- |
| `Common`      | `'1'` | 盤中整股    |
| `AfterMarket` | `'2'` | 盤後定價    |
| `Odd`         | `'3'` | 盤後零股    |
| `Emg`         | `'4'` | 興櫃        |
| `IntradayOdd` | `'5'` | 盤中零股    |

##### Class property: `Order.PriceFlag`[​](#class-property-orderpriceflag "Direct link to class-property-orderpriceflag")

* {enum}

| Key         | Value | Description |
| ----------- | ----- | ----------- |
| `Limit`     | `'0'` | 限價        |
| `Flat`      | `'1'` | 平盤價      |
| `LimitDown` | `'2'` | 跌停價      |
| `LimitUp`   | `'3'` | 漲停價      |
| `Market`    | `'4'` | 市價        |

##### Class property: `Order.BsFlag`[​](#class-property-orderbsflag "Direct link to class-property-orderbsflag")

* {enum}

| Key   | Value | Description          |
| ----- | ----- | -------------------- |
| `ROD` | `'R'` | 當日委託有效單       |
| `IOC` | `'I'` | 立即成交否則取消     |
| `FOK` | `'F'` | 立即全部成交否則取消 |

##### Class property: `Order.TradeType`[​](#class-property-ordertradetype "Direct link to class-property-ordertradetype")

* {enum}

| Key              | Value | Description              |
| ---------------- | ----- | ------------------------ |
| `Cash`           | `'0'` | 現股                     |
| `Margin`         | `'3'` | 融資                     |
| `Short`          | `'4'` | 融券                     |
| `DayTrading`     | `'9'` | 信用當沖（僅適用於帳務） |
| `DayTradingSell` | `'A'` | 現股當沖賣               |

##### Constructor: `new Order(payload)`[​](#constructor-new-orderpayload "Direct link to constructor-new-orderpayload")

* `payload` {Object} 設置委託單的酬載。

  <!-- -->

  * `stockNo` {string} 股票代號。
  * `buySell` {Order.Side} 買賣別。
  * `price` {number} 價格。
  * `quantity` {number} 數量。
  * `apCode` {Order.ApCode} 盤別。
  * `priceFlag` {Order.PriceFlag} 價格旗標。
  * `bsFlag` {Order.BsFlag} 委託單別。
  * `trade` {Order.TradeType} 交易類別。

建立一個新的 `Order` 實體。

##### `order.payload`[​](#orderpayload "Direct link to orderpayload")

* {Object}

  <!-- -->

  * `stockNo` {string} 股票代號。
  * `buySell` {Order.Side} 買賣別。
  * `price` {number} 價格。
  * `quantity` {number} 數量。
  * `apCode` {Order.ApCode} 盤別。
  * `priceFlag` {Order.PriceFlag} 價格旗標。
  * `bsFlag` {Order.BsFlag} 委託單別。
  * `trade` {Order.TradeType} 交易類別。

委託單的酬載。

##### `order.setSymbol(symbol)`[​](#ordersetsymbolsymbol "Direct link to ordersetsymbolsymbol")

* `symbol` {string} 股票代號。
* Returns: {this}

設置委託單酬載的 `stockNo` 值。

##### `order.setSide(side)`[​](#ordersetsideside "Direct link to ordersetsideside")

* `side` {Order.Side} 買賣別。
* Returns: {this}

設置委託單酬載的 `buySell` 值。

##### `order.setPrice(price)`[​](#ordersetpriceprice "Direct link to ordersetpriceprice")

* `price` {number} 價格。
* Returns: {this}

設置委託單酬載的 `price` 值。

##### `order.setQuantity(quantity)`[​](#ordersetquantityquantity "Direct link to ordersetquantityquantity")

* `quantity` {number} 數量。
* Returns: {this}

設置委託單酬載的 `quantity` 值。

##### `order.setApCode(apCode)`[​](#ordersetapcodeapcode "Direct link to ordersetapcodeapcode")

* `apCode` {Order.ApCode} 盤別。
* Returns: {this}

設置委託單酬載的 `apCode` 值。

##### `order.setPriceFlag(priceFlag)`[​](#ordersetpriceflagpriceflag "Direct link to ordersetpriceflagpriceflag")

* `priceFlag` {Order.PriceFlag} 價格旗標。
* Returns: {this}

設置委託單酬載的 `priceFlag` 值。

##### `order.setBsFlag(bsFlag)`[​](#ordersetbsflagbsflag "Direct link to ordersetbsflagbsflag")

* `bsFlag` {Order.BsFlag} 委託單別。
* Returns: {this}

設置委託單酬載的 `bsFlag` 值。

##### `order.setTradeType(tradeType)`[​](#ordersettradetypetradetype "Direct link to ordersettradetypetradetype")

* `tradeType` {Order.TradeType} 交易類別。
* Returns: {this}

設置委託單酬載的 `trade` 值。

##### `order.toObject()`[​](#ordertoobject "Direct link to ordertoobject")

* Returns: {OrderObject}

轉換為 `@fugle/trade-core` 的 `OrderObject` 物件。


---

### Python

#### 登入及用戶資訊[​](#登入及用戶資訊 "Direct link to 登入及用戶資訊")

##### 登入 login()[​](#登入-login "Direct link to 登入 login()")

###### Input Parameters[​](#input-parameters "Direct link to Input Parameters")

None

###### Response Example[​](#response-example "Direct link to Response Example")

None

info

登入有效時間為一天，每日有登入次數限制。在執行任何功能之前，必須成功呼叫過一次登入。

##### 重設密碼 reset\_password()[​](#重設密碼-reset_password "Direct link to 重設密碼 reset_password()")

程式執行到此函數時，會於命令列提示請用戶輸入證券密碼及憑證密碼。

###### Input Parameters[​](#input-parameters-1 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-1 "Direct link to Response Example")

None

info

若您的證券登入密碼或憑證密碼有變更，請務必記得重設儲存在 SDK 的密碼。

caution

若密碼錯誤嘗試超過 3 次，您的證券帳號將被暫時鎖定，此時可參考 [登入問題說明](https://support.fugle.tw/account/289/) 進行解鎖。

##### 憑證資訊 certinfo()[​](#憑證資訊-certinfo "Direct link to 憑證資訊 certinfo()")

取得憑證相關資訊。

###### Input Parameters[​](#input-parameters-2 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-2 "Direct link to Response Example")

```json
{
    "cn": "A123456789-00-00::PCC005", // 憑證名稱 (string)
    "is_valid": True, // 憑證有效 (boolean)
    "not_after": 1676735999, // 憑證有效期限 (timestamp)
    "serial": "7DA4C168" // 憑證序號 (string)
}

```

info

憑證效期為自申請日起一年，請務必於憑證過期前申請展延或更換新憑證。

##### 金鑰資訊 get\_key\_info()[​](#金鑰資訊-get_key_info "Direct link to 金鑰資訊 get_key_info()")

取得金鑰相關資訊。

###### Input Parameters[​](#input-parameters-3 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-3 "Direct link to Response Example")

```json
{
    "api_key": "XXXXXXXXXXXXX", // API 金鑰 (string)
    "api_key_memo": "", // API 金鑰備註 (string)
    "api_key_name": "", // API 金鑰名稱 (string)
    "created_at": {"nanos": 220000000, "seconds": 1633657888}, // API 金鑰建立時間
    "scope": "C", // API 金鑰權限 (KeyScope enum)
    "status": 1 // API 金鑰狀態 (number)
}

```

info

金鑰有效期限為自建立時間起一年。

##### 交易額度及權限 get\_trade\_status()[​](#交易額度及權限-get_trade_status "Direct link to 交易額度及權限 get_trade_status()")

取得用戶交易額度、交易權限相關資訊。

###### Input Parameters[​](#input-parameters-4 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-4 "Direct link to Response Example")

```json
{
    "trade_limit": 0,        // 交易額度 (number)
    "margin_limit": 500000,  // 融資額度 (number)
    "short_limit": 500000,   // 融券額度 (number)
    "day_trade_code": "X",   // 現股當沖狀態代碼 (X:已啟用 Y:僅可先買後賣 N:未啟用 S:暫停中)
    "margin_code": "0",      // 融資狀態代碼 (0:可買賣 1:可買 2:可賣 9:不可買賣)
    "short_code": "0"        // 融券狀態代碼 (0:可買賣 1:可買 2:可賣 9:不可買賣)
}

```

***

#### 交易下單[​](#交易下單 "Direct link to 交易下單")

##### 下單 place\_order(order\_object)[​](#下單-place_orderorder_object "Direct link to 下單 place_order(order_object)")

送出委託單。

###### Input Parameters[​](#input-parameters-5 "Direct link to Input Parameters")

| 參數          | 類別                        | 說明     |
| ------------- | --------------------------- | -------- |
| order\_object | [OrderObject](#orderobject) | 委託內容 |

###### Response Example[​](#response-example-5 "Direct link to Response Example")

```json
{
    "ord_date": "20220310", // 委託日期 YYYYMMDD (string)
    "ord_time": "094932438", // 委託時間 HHmmssSSS (string)
    "ord_type": "2", //
    "ord_no": "A4461", // 委託序號 (string)
    "ret_code": "000000", // 處理結果代碼 (string)
    "ret_msg": "", // 錯誤訊息 (string)
    "work_date": "20220310" // 有效交易日期 (string)
}

```

##### 改價 modify\_price(order\_result, target\_price, price\_flag)[​](#改價-modify_priceorder_result-target_price-price_flag "Direct link to 改價 modify_price(order_result, target_price, price_flag)")

修改委託價格。

###### Input Parameters[​](#input-parameters-6 "Direct link to Input Parameters")

| 參數                | 類別                        | 說明       |
| ------------------- | --------------------------- | ---------- |
| order\_result       | [OrderResult](#orderresult) | 委託單資料 |
| target\_price       | float or None               | 目標價格   |
| price\_flag(option) | [PriceFlag](#priceflag)     | 價格旗標   |

info

市價不能變更為其他價格旗標，其他價格旗標也無法變更為市價

除了限價之外，其他價格旗標都不能變更為原本的價格旗標 ex: 漲停 -> 漲停, 跌停 -> 跌停

price\_flag 在非限價時，target\_price 要放 None

caution

提供以下範例

sdk.modify\_price(order\_result, 10.00) // 改成限價 10.00 元

sdk.modify\_price(order\_result, None, PriceFlag.LimitDown) // 改成跌停

sdk.modify\_price(order\_result, None, PriceFlag.LimitUp) // 改成漲停

sdk.modify\_price(order\_result, None, PriceFlag.Flat) // 改成平盤

###### Response Example[​](#response-example-6 "Direct link to Response Example")

```json
{
    "ret_code": "000000", // 處理結果代碼 (string)
    "ret_msg": "", // 錯誤訊息 (string)
    "ord_date": "20220310", // 修改委託日期 YYYYMMDD (string)
    "ord_time": "104605207" // 修改委託時間 HHmmssSSS (string)
}

```

caution

只能修改 ROD 限價單的價格。

##### 刪改單 cancel\_order(order\_result, \*\*kwargs)[​](#刪改單-cancel_orderorder_result-kwargs "Direct link to 刪改單 cancel_order(order_result, **kwargs)")

減少委託單量，或刪除單筆委託。

###### Input Parameters[​](#input-parameters-7 "Direct link to Input Parameters")

| 參數            | 類別                        | 說明                |
| --------------- | --------------------------- | ------------------- |
| order\_result   | [OrderResult](#orderresult) | 委託單資料          |
| cel\_qty        | int                         | 取消張數 (optional) |
| cel\_qty\_share | int                         | 取消股數 (optional) |

info

cel\_qty 或 cel\_qty\_share 只需要提供其中一個，系統會自動處理張/股轉換。若兩者都沒有提供，系統會刪除該筆委託。

###### Response Example[​](#response-example-7 "Direct link to Response Example")

```json
{
    "ret_code": "000000", // 處理結果代碼 (string)
    "ret_msg": "", // 錯誤訊息 (string)
    "ord_date": "20220310", // 刪除委託日期 YYYYMMDD (string)
    "ord_time": "101825110" // 刪除委託時間 HHmmssSSS (string)
}

```

##### 委託紀錄 get\_order\_results()[​](#委託紀錄-get_order_results "Direct link to 委託紀錄 get_order_results()")

取得委託列表。

###### Input Parameters[​](#input-parameters-8 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-8 "Direct link to Response Example")

```json
[{
    "ap_code": "1", // 盤別 (APCode enum)
    "avg_price": 0.0, // 成交均價 (number)
    "bs_flag": "R", // 委託條件 (BSFlag enum)
    "buy_sell": "B", // 買賣別 (Action enum)
    "cel_qty": 1, // 已取消數量(張) (number)
    "cel_qty_share": 1000, // 已取消數量(股) (number)
    "celable": "2", // 可取消狀態 1:可取消 2:不可取消 (string)
    "err_code": "00000000", // 錯誤碼 (string)
    "err_msg": "", // 錯誤訊息 (string)
    "mat_qty": 0, // 已成交數量(張) (number)
    "mat_qty_share": 0, // 已成交數量(股) (number)
    "od_price": 25.95, // 委託價格 (number)
    "ord_date": "20220310", // 原始委託日期 (string)
    "ord_no": "A4461", // 委託書編號 (string)
    "ord_status": "2", // 預約狀態 1:預約單 2:盤中單 (string)
    "ord_time": "094932438", // 原始委託時間 (string)
    "org_qty": 1, // 原始委託數量(張) (number)
    "org_qty_share": 1000, // 原始委託數量(股) (number)
    "pre_ord_no": "", // 預約單編號，預約單時才有值 (string)
    "price_flag": "2", // 價格旗標 (PriceFlag enum)
    "stock_no": "2884", // 股票代號 (string)
    "trade": "0", // 交易類別 (Trade enum)
    "work_date": "20220310", // 有效交易日期 (string)
    "user_def": "下單測試" // 自訂欄位 (string)
}, ...]

```

##### 歷史委託 get\_order\_results\_by\_date(start\_date, end\_date)[​](#歷史委託-get_order_results_by_datestart_date-end_date "Direct link to 歷史委託 get_order_results_by_date(start_date, end_date)")

取得 start\_date, end\_date 時間範圍內的歷史委託列表，無法查詢已刪除及預約單。

PriceFlag 只有判斷市價及限價

###### Input Parameters[​](#input-parameters-9 "Direct link to Input Parameters")

| 參數        | 類別   | 說明                         |
| ----------- | ------ | ---------------------------- |
| start\_date | string | 格式為 yyyy-MM-dd 的開始日期 |
| end\_date   | string | 格式為 yyyy-MM-dd 的結束日期 |

取得特定日期區間的歷史委託列表，目前提供查詢的日期範圍，以 180 日為限！

若超過這個時間範圍區間，會得到 AW00003 的錯誤訊息！

###### Response Example[​](#response-example-9 "Direct link to Response Example")

```json
[{
    "ack_date": "20230310", //委託日期
    "ap_code": "1", // 盤別 (APCode enum)
    "avg_price": 0.0, // 成交均價 (number)
    "bs_flag": "R", // 委託條件 (BSFlag enum)
    "buy_sell": "B", // 買賣別 (Action enum)
    "cel_qty": 1, // 已取消數量(張) (number)
    "cel_qty_share": 1000, // 已取消數量(股) (number)
    "celable": "2", // 可取消狀態 1:可取消 2:不可取消 (string)
    "mat_qty": 0, // 已成交數量(張) (number)
    "mat_qty_share": 0, // 已成交數量(股) (number)
    "od_price": 25.95, // 委託價格 (number)
    "ord_date": "20220310", // 原始委託日期 (string)
    "ord_no": "A4461", // 委託書編號 (string)
    "ord_time": "094932438", // 原始委託時間 (string)
    "org_qty": 1, // 原始委託數量(張) (number)
    "org_qty_share": 1000, // 原始委託數量(股) (number)
    "price_flag": "0", // 價格旗標 (PriceFlag enum)，現階段只能判斷限價(limit)與市價(market)
    "stock_no": "2884", // 股票代號 (string)
    "trade": "0", // 交易類別 (Trade enum)
    "user_def": "下單測試" // 自訂欄位 (string)
}, ...]

```

##### 市場開盤狀態 get\_market\_status()[​](#市場開盤狀態-get_market_status "Direct link to 市場開盤狀態 get_market_status()")

取得開盤狀態。

###### Input Parameters[​](#input-parameters-10 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-10 "Direct link to Response Example")

```json
{
    "is_trading_day": true,          //當日是否開盤
    "last_trading_day": "20221017",  //上個交易日期
    "next_trading_day": "20221019"   //下個交易日期
}

```

##### 取得機器時間 get\_machine\_time()[​](#取得機器時間-get_machine_time "Direct link to 取得機器時間 get_machine_time()")

取得主機端機器的時間

###### Input Parameters[​](#input-parameters-11 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-11 "Direct link to Response Example")

```json
{
    "time": "2022-03-10 10:23:48.464" // 機器時間 (string)
}

```

caution

若您的下單程式所在的機器時間與主機時間相差過多，有可能導致下單驗證失敗，建議定時與主機進行校時同步。

***

#### 帳務查詢[​](#帳務查詢 "Direct link to 帳務查詢")

##### 近期成交明細 get\_transactions(query\_range)[​](#近期成交明細-get_transactionsquery_range "Direct link to 近期成交明細 get_transactions(query_range)")

取得近期特定時間範圍內的成交明細。

###### Input Parameters[​](#input-parameters-12 "Direct link to Input Parameters")

| 參數         | 類別   | 說明                                                  |
| ------------ | ------ | ----------------------------------------------------- |
| query\_range | string | 時間區間，目前有效數值為 "0d"(當日)、"3d"、"1m"、"3m" |

###### Response Example[​](#response-example-12 "Direct link to Response Example")

```json
[{ // 成交明細彙總 (array)
    "buy_sell": "S",
    "c_date": "20220314",
    "cost": "-16410", // 已實現損益成本小計
    "make": "7933",
    "make_per": "48.34",
    "mat_dats": [{ // 成交明細 (array)
        "buy_sell": "S",
        "c_date": "20220314",
        "db_fee": "0", // 融券手續費
        "fee": "34", // 手續費 (string)
        "make": "7933", // 已實現損益
        "make_per": "48.34", // 已實現獲利率
        "order_no": "A7828002924570", // 前 5 碼由委託列表的委託書號 (ord_no) 所組成
        "pay_n": "24343", // 淨收付款 (string)
        "price": "24.45", // 成交價格 (string)
        "price_qty": "24450", // 價金 (string)
        "qty": "1000", // 成交數量 (string)
        "s_type": "H", // 市場別 H:上市,O:上櫃,R:興櫃
        "stk_na": "玉山金",
        "stk_no": "2884",
        "t_date": "20220310", // 成交日期 (string)
        "t_time": "090819800", // 成交時間 (string) -> 僅成交當日有資料，其餘時間皆為空值
        "tax": "73", // 交易稅 (string)
        "tax_g": "0", // 證所稅 (string)
        "trade": "0",  // 交易類別 (Trade enum)
        "user_def": "下單測試" // 自訂欄位 (string)
    }],
    "price_avg": "24.45", // 成交均價 (string)
    "price_qty": "24450", // 價金小計 (string)
    "qty": "1000",
    "recv": "24343", // 已實現損益收入小計
    "s_type": "H", // 市場別 H:上市 O:上櫃 R:興櫃
    "stk_na": "玉山金",
    "stk_no": "2884",
    "t_date": "20220310",
    "trade": "0"
}, ...]

```

##### 成交明細（依指定日期） get\_transactions\_by\_date(start\_date, end\_date)[​](#成交明細依指定日期-get_transactions_by_datestart_date-end_date "Direct link to 成交明細（依指定日期） get_transactions_by_date(start_date, end_date)")

取得 start\_date, end\_date 時間範圍內的成交明細。

###### Input Parameters[​](#input-parameters-13 "Direct link to Input Parameters")

| 參數        | 類別   | 說明                         |
| ----------- | ------ | ---------------------------- |
| start\_date | string | 格式為 yyyy-MM-dd 的開始日期 |
| end\_date   | string | 格式為 yyyy-MM-dd 的結束日期 |

取得特定日期區間的成交明細，目前提供查詢的日期範圍，以 180 日為限！

若超過這個時間範圍區間，會得到 AW00002 的錯誤訊息！

###### Response Example[​](#response-example-13 "Direct link to Response Example")

```json
[{ // 成交明細彙總 (array)
    "buy_sell": "S",
    "c_date": "20220314",
    "cost": "-16410", // 已實現損益成本小計
    "make": "7933",
    "make_per": "48.34",
    "mat_dats": [{ // 成交明細 (array)
        "buy_sell": "S",
        "c_date": "20220314",
        "db_fee": "0", // 融券手續費
        "fee": "34", // 手續費 (string)
        "make": "7933", // 已實現損益
        "make_per": "48.34", // 已實現獲利率
        "order_no": "A7828002924570", // 前 5 碼由委託列表的委託書號 (ord_no) 所組成
        "pay_n": "24343", // 淨收付款 (string)
        "price": "24.45", // 成交價格 (string)
        "price_qty": "24450", // 價金 (string)
        "qty": "1000", // 成交數量 (string)
        "s_type": "H", // 市場別 H:上市,O:上櫃,R:興櫃
        "stk_na": "玉山金",
        "stk_no": "2884",
        "t_date": "20220310", // 成交日期 (string)
        "t_time": "090819800", // 成交時間 (string) -> 僅成交當日有資料，其餘時間皆為空值
        "tax": "73", // 交易稅 (string)
        "tax_g": "0", // 證所稅 (string)
        "trade": "0",  // 交易類別
        "user_def": "下單測試" // 自訂欄位 (string)
    }],
    "price_avg": "24.45", // 成交均價 (string)
    "price_qty": "24450", // 價金小計 (string)
    "qty": "1000",
    "recv": "24343", // 已實現損益收入小計
    "s_type": "H", // 市場別 H:上市 O:上櫃 R:興櫃
    "stk_na": "玉山金",
    "stk_no": "2884",
    "t_date": "20220310",
    "trade": "0"  // 交易類別
}, ...]

```

##### 庫存明細 get\_inventories()[​](#庫存明細-get_inventories "Direct link to 庫存明細 get_inventories()")

取得當下的庫存明細。

###### Input Parameters[​](#input-parameters-14 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-14 "Direct link to Response Example")

```json
[{ // 庫存彙總
    "ap_code": "", // 盤別，僅盤中零股會有值 (string)
    "cost_qty": "1150", // 成本股數
    "cost_sum": "-103235", // 成本總計
    "make_a_per": "51.59", // 未實現獲利率
    "make_a_sum": "53255", // 未實現損益小計
    "price_avg": "89.63", // 成交均價
    "price_evn": "89.99", // 損益平衡價
    "price_mkt": "136.45", // 即時價格(無假除權息)
    "price_now": "136.45", // 即時價格(有假除權息)
    "price_qty_sum": "103074", // 價金總計
    "qty_b": "0", // 今委買股數
    "qty_bm": "0", // 今委買成交股數
    "qty_c": "0", // 調整股數(現償 or 匯撥) 負號為減庫存
    "qty_l": "1150", // 昨餘額股數
    "qty_s": "0", // 今委賣股數
    "qty_sm": "0", // 今委賣成交股數
    "rec_va_sum": "156490", // 未實現收入小計
    "s_type": "H", // 市場別 H:上市 O:上櫃 R:興櫃
    "stk_dats": [{ // 庫存明細
        "buy_sell": "B",
        "cost_r": "0", // 已分攤成本
        "fee": "18", // 手續費(由原始資料分攤)
        "make_a": "804", // 未實現損益
        "make_a_per": "6.28", // 未實現獲益率
        "ord_no": "D3660038938518", // 前 5 碼由委託列表的委託書號 (ord_no) 所組成
        "pay_n": "-12808", // 淨收付金額(由原始資料分攤)
        "price": "127.90", // 成交價格
        "price_evn": "128.41", // 平衡損益價(以cost-costr計算)
        "qty": "100", // 庫存股數
        "qty_c": "0", // 調整股數(現償 or 匯撥) 負號為減庫存
        "qty_h": "0", // 實高權值股數(維持率)
        "qty_r": "0", // 已分攤股數
        "t_date": "20210512", // 成交日期
        "t_time": "", // 成交時間 -> 僅成交當日有資料，其餘時間皆為空值
        "tax": "0", // 交易稅(由原始資料分攤)
        "tax_g": "0", // 證所稅(由原始資料分攤)
        "trade": "0", // 交易類別
        "value_mkt": "13645", // 市值(無假除權息)
        "value_now": "13645", // 市值(有假除權息)
        "user_def": "下單測試" // 自訂欄位
    }],
    "stk_na": "元大台灣50", // 股票名稱
    "stk_no": "0050", // 股票代碼
    "trade": "0", // 交易類別
    "value_mkt": "13645", // 市值(無假除權息)
    "value_now": "13645" // 市值(有假除權息)
}, ...]


```

##### 銀行餘額 get\_balance()[​](#銀行餘額-get_balance "Direct link to 銀行餘額 get_balance()")

取得銀行餘額相關資訊。 (每 180 秒可查詢一次)

###### Input Parameters[​](#input-parameters-15 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-15 "Direct link to Response Example")

```json
{
    "available_balance": 500000,  // 可用銀行餘額 (number)
    "exange_balance": 100000,  //今日票據交換金額  (number)
    "stock_pre_save_amount": 100000 //圈存金額 (number)
}

```

##### 交割款 get\_settlements()[​](#交割款-get_settlements "Direct link to 交割款 get_settlements()")

取得交割款資訊。

###### Input Parameters[​](#input-parameters-16 "Direct link to Input Parameters")

None

###### Response Example[​](#response-example-16 "Direct link to Response Example")

```json
[{
    "c_date": "20220310", // 交割日期 YYYYMMDD (string)
    "date": "20220308", // 成交日期 YYYYMMDD (string)
    "price": "-80912" // 交割款應收金額 (string)
}, {
    "c_date": "20220311",
    "date": "20220309",
    "price": "4826"
}, ...]

```

caution

交易當日盤中取得的交割款為試算結果，僅供參考，需待當日 21:00 帳務系統更新後，才可取得正確的 T+2 交割金額。

***

#### Decorators[​](#decorators "Direct link to Decorators")

##### 委託回報 on('order')[​](#委託回報-onorder "Direct link to 委託回報 on('order')")

委託回報透過 decorator 的 callback function 回傳委託資訊。

###### Input Parameters[​](#input-parameters-17 "Direct link to Input Parameters")

| 參數        | 類別                    | 說明     |
| ----------- | ----------------------- | -------- |
| notify\_ack | [NotifyAck](#notifyack) | 委託內容 |

##### 成交回報 on('dealt')[​](#成交回報-ondealt "Direct link to 成交回報 on('dealt')")

成交回報透過 decorator 的 callback function 回傳成交資訊。

###### Input Parameters[​](#input-parameters-18 "Direct link to Input Parameters")

| 參數          | 類別                        | 說明     |
| ------------- | --------------------------- | -------- |
| notify\_dealt | [NotifyDealt](#notifydealt) | 成交內容 |

##### 錯誤回報 on('error')[​](#錯誤回報-onerror "Direct link to 錯誤回報 on('error')")

當發生錯誤時會回傳相關資訊。

#### Classes[​](#classes "Direct link to Classes")

##### OrderObject[​](#orderobject "Direct link to OrderObject")

| Parameter            | Type      | Default Value   | Meaning                                                              |
| -------------------- | --------- | --------------- | -------------------------------------------------------------------- |
| ap\_code             | APCode    | APCode.Common   | [盤別](#apcode)                                                      |
| buy\_sell            | Action    | -               | [買賣別](#action)                                                    |
| price                | float     | -               | 委託價格                                                             |
| stock\_no            | string    | -               | 股票代號                                                             |
| quantity             | int       | -               | 委託數量                                                             |
| price\_flag          | PriceFlag | PriceFlag.Limit | [價格旗標](#priceflag)                                               |
| bs\_flag             | BSFlag    | BSFlag.ROD      | [委託條件](#bsflag)                                                  |
| trade                | Trade     | Trade.Cash      | [交易類別](#trade)                                                   |
| user\_def (optional) | string    | -               | 自訂欄位（長度最長 50 字元以下，不支援特殊符號）（ 模擬環境不適用 ） |

caution

不同 apCode 對應的 quantity 之單位及範圍不同，請參考 [盤別](#apcode) 說明。

caution

當 apCode 爲 APCode.Common, APCode.Odd, APCode.Emg, APCode.IntradayOdd 其中之一，且 priceFlag 爲 PriceFlag.Limit 時，需填入 price 欄位，其餘時候 price 欄位不需填入。

##### OrderResult[​](#orderresult "Direct link to OrderResult")

委託列表，透過 [`get_order_results()`](#get_order_results) 取得。

| Parameter       | Type      | Meaning                        |
| --------------- | --------- | ------------------------------ |
| ap\_code        | APCode    | [盤別](#apcode)                |
| avg\_price      | number    | 成交均價                       |
| bs\_flag        | BSFlag    | [委託條件](#bsflag)            |
| buy\_sell       | Action    | [買賣別](#action)              |
| cel\_qty        | number    | 已取消數量(張)                 |
| cel\_qty\_share | number    | 已取消數量(股)                 |
| celable         | string    | 可取消狀態 1:可取消 2:不可取消 |
| err\_code       | string    | 錯誤碼                         |
| err\_msg        | string    | 錯誤訊息                       |
| mat\_qty        | number    | 已成交數量(張)                 |
| mat\_qty\_share | number    | 已成交數量(股)                 |
| od\_price       | number    | 委託價格                       |
| ord\_date       | string    | 原始委託日期                   |
| ord\_no         | string    | 委託書編號                     |
| ord\_status     | string    | 預約狀態 1:預約單 2:盤中單     |
| ord\_time       | string    | 原始委託時間                   |
| org\_qty        | number    | 原始委託數量(張)               |
| org\_qty\_share | number    | 原始委託數量(股)               |
| pre\_ord\_no    | string    | 預約單編號，預約單時才有值     |
| price\_flag     | PriceFlag | [價格旗標](#priceflag)         |
| stock\_no       | string    | 股票代號                       |
| trade           | Trade     | [交易類別](#trade)             |
| work\_date      | string    | 有效交易日期                   |
| user\_def       | string    | 自訂欄位 （ 模擬環境不適用 ）  |

#### Constants[​](#constants "Direct link to Constants")

##### Action[​](#action "Direct link to Action")

買賣別

| Name | Value | Meaning |
| ---- | ----- | ------- |
| Buy  | "B"   | 買      |
| Sell | "S"   | 賣      |

##### APCode[​](#apcode "Direct link to APCode")

盤別

| Name        | Value | Meaning  |
| ----------- | ----- | -------- |
| Common      | "1"   | 整股     |
| AfterMarket | "2"   | 盤後定價 |
| Odd         | "3"   | 盤後零股 |
| Emg         | "4"   | 興櫃     |
| IntradayOdd | "5"   | 盤中零股 |

使用不同 APCode 時，相對應的 Quantity 欄位所代表的單位及範圍也會不同，詳如下表：

| APCode Names | Quantity Unit | Quantity Ranges                                              |
| ------------ | ------------- | ------------------------------------------------------------ |
| Common       | 張            | 1 ~ 499                                                     |
| AfterMarket  | 張            | 1 ~ 499                                                     |
| Odd          | 股            | 1 ~ 999                                                     |
| Emg          | 股            | 1 ~ 999, 1000 ~ 499000 (超過 1000 後，最小升降單位為 1000) |
| IntradayOdd  | 股            | 1 ~ 999                                                     |

使用不同 APCode 時，可使用的 PriceFlag 會不同，詳如下表：

| APCode Names | Available PriceFlag Names               |
| ------------ | --------------------------------------- |
| Common       | Limit, Flat, LimitDown, LimitUp, Market |
| AfterMarket  | Limit                                   |
| Odd          | Limit, Flat, LimitDown, LimitUp         |
| Emg          | Limit                                   |
| IntradayOdd  | Limit, Flat, LimitDown, LimitUp         |

##### Trade[​](#trade "Direct link to Trade")

交易類別

| Name           | Value | Meaning                  |
| -------------- | ----- | ------------------------ |
| Cash           | "0"   | 現股                     |
| Margin         | "3"   | 融資                     |
| Short          | "4"   | 融券                     |
| DayTrading     | "9"   | 信用當沖（僅適用於帳務） |
| DayTradingSell | "A"   | 現股當沖賣               |

##### PriceFlag[​](#priceflag "Direct link to PriceFlag")

價格旗標

| Name      | Value | Meaning |
| --------- | ----- | ------- |
| Limit     | "0"   | 限價    |
| Flat      | "1"   | 平盤    |
| LimitDown | "2"   | 跌停    |
| LimitUp   | "3"   | 漲停    |
| Market    | "4"   | 市價    |

##### BSFlag[​](#bsflag "Direct link to BSFlag")

委託條件

| Name | Value | Meaning              |
| ---- | ----- | -------------------- |
| FOK  | "F"   | 立即全部成交否則取消 |
| IOC  | "I"   | 立即成交否則取消     |
| ROD  | "R"   | 當日委託有效單       |

##### KeyScope[​](#keyscope "Direct link to KeyScope")

API 金鑰權限

| Name  | Value | Meaning |
| ----- | ----- | ------- |
| Trade | "A"   | 下單    |
| Query | "B"   | 查詢    |
| All   | "C"   | 全部    |

##### NotifyAck[​](#notifyack "Direct link to NotifyAck")

委託回報的物件

| Parameter    | Type   | Meaning                        |
| ------------ | ------ | ------------------------------ |
| work\_date   | string | 有效交易日期                   |
| ret\_date    | string | 委託日期                       |
| ret\_time    | string | 委託時間                       |
| ord\_status  | string | 預約狀態 1:預約單 2:盤中單     |
| ord\_no      | string | 委託書編號                     |
| pre\_ord\_no | string | 預約單編號，預約單時才有值     |
| stock\_no    | string | 股票代號                       |
| buy\_sell    | string | [買賣別](#action)              |
| ap\_code     | string | [盤別](#apcode)                |
| price\_flag  | string | [價格旗標](#priceflag)         |
| trade        | string | [交易類別](#trade)             |
| od\_price    | string | 委託價格                       |
| org\_qty     | string | 原始委託數量                   |
| mat\_qty     | string | 已成交數量                     |
| cel\_qty     | string | 已取消數量                     |
| cel\_type    | string | 可取消狀態 1 可取消 2 不可取消 |
| err\_code    | string | 錯誤碼                         |
| err\_msg     | string | 錯誤訊息                       |
| before\_qty  | string | 變更前數量                     |
| after\_qty   | string | 變更後數量                     |
| bs\_flag     | string | [委託條件](#bsflag)            |

##### NotifyDealt[​](#notifydealt "Direct link to NotifyDealt")

成交回報的物件

| Parameter     | Type   | Meaning            |
| ------------- | ------ | ------------------ |
| mat\_time     | string | 成交時間           |
| ord\_no       | string | 委託書編號         |
| stock\_no     | string | 股票代號           |
| buy\_sell     | string | [買賣別](#action)  |
| ap\_code      | string | [盤別](#apcode)    |
| trade         | string | [交易類別](#trade) |
| mat\_price    | string | 成交價格           |
| mat\_qty      | string | 已成交數量         |
| pay\_price    | string | 價金               |
| mkt\_seq\_num | string | 市場總序號         |


---

### 使用限制

##### 登入及委託下單限制[​](#登入及委託下單限制 "Direct link to 登入及委託下單限制")

| 行為     | 每秒上限 | 每分鐘上限 | 每日上限 |
| -------- | -------- | ---------- | -------- |
| 登入     | -        | 10 次      | 300 次   |
| 委託下單 | 20 次    | -          | 2000 次  |

##### 交易及帳務 Function 限制[​](#交易及帳務-function-限制 "Direct link to 交易及帳務 Function 限制")

* Python
* Node.js

| 行為         | 對應 Function                                                                                                                                                                                                                                                    | 使用上限       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 庫存查詢     | [`get_inventories()`](https://developer.fugle.tw/docs/trading/reference/python.md#get_inventories)                                                                                                                                                               | 每分鐘 12 次   |
| 委託查詢     | [`get_order_results()`](https://developer.fugle.tw/docs/trading/reference/python.md#get_order_results), [`get_order_results_by_date()`](https://developer.fugle.tw/docs/trading/reference/python.md#get_order_results_by_datestart_date-end_date)                | 每分鐘 12 次   |
| 成交明細查詢 | [`get_transactions()`](https://developer.fugle.tw/docs/trading/reference/python.md#get_transactionsquery_range), [`get_transactions_results_by_date()`](https://developer.fugle.tw/docs/trading/reference/python.md#get_transactions_by_datestart_date-end_date) | 每分鐘 12 次   |
| 交割款查詢   | [`get_settlements()`](https://developer.fugle.tw/docs/trading/reference/python.md#get_settlements)                                                                                                                                                               | 每分鐘 3 次    |
| 銀行餘額查詢 | [`get_balance()`](https://developer.fugle.tw/docs/trading/reference/python.md#get_balance)                                                                                                                                                                       | 每 3 分鐘 1 次 |

| 行為         | 對應 Function                                                                                                                                                                                                        | 使用上限       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 庫存查詢     | [`getInventories()`](https://developer.fugle.tw/docs/trading/reference/nodejs.md#fuglegetinventories)                                                                                                                | 每分鐘 12 次   |
| 委託查詢     | [`getOrders()`](https://developer.fugle.tw/docs/trading/reference/nodejs.md#fuglegetorders), [`getHistoryOrders(options)`](https://developer.fugle.tw/docs/trading/reference/nodejs.md#fuglegethistoryordersoptions) | 每分鐘 12 次   |
| 成交明細查詢 | [`getTransactions(options)`](https://developer.fugle.tw/docs/trading/reference/nodejs.md#fuglegettransactionsoptions)                                                                                                | 每分鐘 12 次   |
| 交割款查詢   | [`getSettlements()`](https://developer.fugle.tw/docs/trading/reference/nodejs.md#fuglegetsettlements)                                                                                                                | 每分鐘 3 次    |
| 銀行餘額查詢 | [`getBalance()`](https://developer.fugle.tw/docs/trading/reference/nodejs.md#fuglegetbalance)                                                                                                                        | 每 3 分鐘 1 次 |

info

若超出每秒/每分上限，於一分鐘後可再繼續執行指令；若已超出當日上限，請於隔日再試。若您仍持續遇到問題，請聯繫客服。


---
