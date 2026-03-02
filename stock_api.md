# 股票API初始文件
## 專案背景
藉由富果(https://developer.fugle.tw/)建構一個股票api系統，可以連接line bot或是其他前端介面，提供使用者在盤中可以查詢目前的股票價格，也提供用戶建構一個股票列表，定時推送該股票列表的盤中價格
## 專案固定規範與通用規則
- 時區設定都以東八區(UTC+8)為主，例如本月指的是東八區的1號00:00:00到最後一天23:59:59
- api不提供前端介面，但是interface需要能通用於各式前端(nodejs、flutter、line bot...)連接使用
- 使用富果api取得資訊， API 端點使用以下位置為前綴：https://developer.fugle.tw/
- 富果文件在以下位置：/Users/kc.tsai/Documents/other project/stock_api/Fugle Developer Docs.ini.md
- 建立unit test，方便bug tracking
- readme.md建立用戶使用指南，提示如何使用api
- 使用時在header加入我的身份驗證X-API-KEY:Y2QzMzAyNzYtMjYzNy00NzhhLTk4MTYtYWZhMDdkYjgzNzQxIDNlMGI4M2NhLTEzMGMtNDk1OS04ZGZiLThkMmNjZDI0ZjI0ZA==
- 身份驗證需要做特殊處理不能顯示出來，該專案因為上傳到git repository上，並且為public身份，所以公開api key是不被允許的
- 目前設定以line bot為主，日後可擴充至其他前端介面
## 查詢特定股票盤中訊息
- 透過/intraday/candles/{symbol}取得該股票
- line bot可以使用/search 2330觸發該功能
- 取得的1分k將會傳回到line bot中
- line bot會繪製成趨勢圖傳送到使用者的line訊息內