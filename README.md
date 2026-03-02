# Stock API (Fugle Intraday Candles) - Cloudflare Workers Edition

這是一個基於富果 (Fugle) API 建構的股票資訊 API 系統，並且已優化為部署於 **Cloudflare Workers** 或相容 Edge 環境的架構。
使用極速的 [Hono](https://hono.dev/) 框架建立，並且將圖表產生的依賴轉交給第三方免費服務 [QuickChart](https://quickchart.io/)，實現不需額外伺服器全自動運作與無伺服器 (Serverless) 部署。

## 系統需求
- Node.js (用於開發、部署)
- 已經申請好富果 API Token (X-API-KEY)
- 已經建立好 LINE Developer Channel (用於 LINE Bot)
- Cloudflare 帳號 (可用免費版 Workers)

## 專案設置

1. 安裝依賴套件:
```bash
npm install
```

2. 登入 Cloudflare:
```bash
npx wrangler login
```

3. 設定環境變數:
請在本地端建立 `.dev.vars` 進行本地測試（已由 `.env` 複製）：
```env
FUGLE_API_KEY=你的富果API_KEY
LINE_CHANNEL_ACCESS_TOKEN=你的_line_channel_access_token
LINE_CHANNEL_SECRET=你的_line_channel_secret
```

**正式上線前**，請將這些環境變數設定到 Cloudflare 專案上：
```bash
npx wrangler secret put FUGLE_API_KEY
npx wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
npx wrangler secret put LINE_CHANNEL_SECRET
```

## 啟動與部署

### 本地開發測試
啟動本地端模擬 Worker 環境伺服器:
```bash
npx wrangler dev
```

### 部署至 Cloudflare Workers
只需要一行指令，即可免費發布到全球邊緣網路：
```bash
npx wrangler deploy
```

發布後，Wrangler 會提供您一個專屬的 URL (例如: `https://stock-api.<your-tenant>.workers.dev`)。

## API 使用說明

### 1. 查詢特定股票盤中 K 線
- **Endpoint**: `GET /api/stock/:symbol/candles`
- **參數**:
  - `symbol`: 股票代碼，例如 `2330`
  - `timeframe`: K線頻率 (1, 5, 10, 15, 30, 60)，預設 `1`
- **回傳範例**:
```json
{
  "success": true,
  "symbol": "2330",
  "data": [ ... ]
}
```

### 2. LINE Bot Webhook
- **Webhook URL 設置**: 在您的 LINE Developer Console 中，將 Webhook URL 設定為您部署後的網址 + `/webhook`。
- **範例**: `https://stock-api.<your-tenant>.workers.dev/webhook`
- 使用者在 LINE 輸入 `/search 2330`，系統將回傳含有 1 分 K 趨勢圖 (透過 QuickChart 生成) 的圖片訊息。

## 單元測試 (開發中)
原本的 `jest` 設定是以 Node.js 為主，因架構移轉至 Hono 與 Fetch API，後續將重構測試以符合 Cloudflare Edge 環境。
