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
## 全股票列表索取更新
- 透過/intraday/tickers取得
- 取得兩次，參數分別帶入?type=EQUITY&exchange=TWSE&market=TSE、?type=INDEX&exchange=TWSE&market=TSE拿取股票和指數至兩種type的基本股市資料
- 取得時機點為每天早上9點整，更新整份資料
- 資料存入資料庫內，以供索引，只需存入symbol和name就可以
## 查詢特定股票盤中訊息
- 透過/intraday/candles/{symbol}取得該股票
- line bot可以使用/search 233或是/search 台積電觸發該功能
- 取得的1分k將會傳回到line bot中
- line bot會繪製成趨勢圖傳送到使用者的line訊息內
- 趨勢圖以昨日收盤價為中線，昨日收盤價可以從/intraday/ticker/{symbol}取得，並且昨日收盤價上方為紅，下方為綠，昨日收盤價會在圖中劃出一條橫線
- search快取為3分鐘(配合3分k線)，只要在3分鐘內使用search就不會跟富果要資料，直接回傳快取
- 昨日收盤價快取session為每天早上九點，超過了快取快失效自動抓取
- 下方加上成交量
## 列表功能
- /add XXXX，可以把股票加入列表，XXXX可以是股票名稱（模糊搜尋）或股票代碼
- /list，可以查看自己的列表，列表顯示股票代號/名稱、成交量、現價、差價(漲跌幅)
- /remove XXXX，可以從列表中移除股票
## K線圖
- 藉由/historical/candles拿取資料，symbol為股票代號，from和to拿取從本日起算前一年資料，timeframe填入D拿取日K
- 畫面顯示從今日算起前60筆資料顯示出日k，紅漲綠跌，算出每日的5日、10日、20日、60日線折線，並在上方顯示文字
- 橫軸只要把每月的1日顯示出來就好
- 下方也要顯示每日交易量，紅漲綠跌