# Stock API (Fugle Intraday Candles)

這是一個基於富果 (Fugle) API 建構的股票資訊 API 系統。
它提供了一個通用介面 (Express API) 以供各種前端 (例如 Node.js, Flutter) 查詢特定股票盤中訊息，同時也直接內建了 LINE Bot 的 Webhook 支援，能夠在 LINE 中接收 `/search {symbol}` 指令並回傳該股票當日的 1 分 K 趨勢圖。

## 系統需求
- Node.js (v14 或以上)
- 已經申請好富果 API Token (X-API-KEY)
- 已經建立好 LINE Developer Channel (用於 LINE Bot)

## 專案設置

1. 安裝依賴套件:
```bash
npm install
```

2. 設定環境變數:
請確認專案根目錄下的 `.env` 檔案內包含以下設定（已預設配置好 API 驗證資訊，請勿公開上傳含明碼之 `.env` 檔）：
```env
FUGLE_API_KEY=你的富果API_KEY
PORT=3000
LINE_CHANNEL_ACCESS_TOKEN=你的_line_channel_access_token
LINE_CHANNEL_SECRET=你的_line_channel_secret
BASE_URL=https://your-ngrok-url.ngrok.io
```
注意：`BASE_URL` 是用於 LINE Bot 顯示圖片的對外網址。測試時建議使用 `ngrok` 取得 HTTPS 網址。

3. 啟動伺服器:
```bash
npm start
```
開發模式 (自動重啟):
```bash
npm run dev
```

## API 使用說明

### 1. 查詢特定股票盤中 K 線
- **Endpoint**: `GET /api/stock/:symbol/candles`
- **參數**:
  - `symbol` (Path Parameter): 股票代碼，例如 `2330`
  - `timeframe` (Query Parameter, 選擇性): K線頻率 (1, 5, 10, 15, 30, 60)，預設為 `1`
- **回傳範例**:
```json
{
  "success": true,
  "symbol": "2330",
  "data": [
    {
      "date": "2023-10-25T09:00:00+08:00",
      "open": 540.0,
      "high": 545.0,
      "low": 539.0,
      "close": 544.0,
      "volume": 1200
    }
  ]
}
```

### 2. LINE Bot Webhook
- **Endpoint**: `POST /webhook`
- 使用者在 LINE 輸入 `/search 2330`，系統將自動解析代碼 `2330` 並向富果要求當日 1 分 K 資料。
- 接著，系統會生成趨勢圖圖片並透過 LINE Messaging API 回傳給使用者。

## 測試指令
執行單元測試以確保系統邏輯正確：
```bash
npm test
```

## 注意事項
- 所有時間資料皆以東八區 (UTC+8) 為準。
- 因 API 金鑰驗證需放置於 Header (`X-API-KEY`) 中，為避免金鑰外洩，專案中將其存放於 `.env` 中並由服務器端進行代理請求，確保不被前端或公開存取端看見。
