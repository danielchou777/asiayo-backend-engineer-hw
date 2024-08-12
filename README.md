## Installation

```
$ npm install
```

## Build
```
$ npm run build
```

## Running the app
```
$ npm run start
```
- Access: Visit http://localhost:3000

## Test
```
$ npm test
```
## Docker

1. build docker image
```
$ docker-compose build
```

2. Start docker container
```
$ docker-compose up
```
- Access: Visit http://localhost:3000

# 資料庫測驗

1. 請寫出一條查詢語句 (SQL)，列出在 2023 年 5 月下訂的訂單，使用台幣付款且5月總金額最多的前 10 筆的旅宿 ID (bnb_id), 旅宿名稱 (bnb_name), 5 月總金額 (may_amount)

```sql
SELECT b.id AS bnb_id, b.name AS bnb_name, SUM(o.amount) AS may_amount 
FROM orders AS o 
INNER JOIN bnbs AS b ON o.bnb_id = b.id
WHERE o.currency = 'TWD'
AND o.created_at >= '2023-05-01 00:00:00'
AND o.created_at < '2023-06-01 00:00:00'
GROUP BY b.id, b.name
ORDER BY may_amount DESC
LIMIT 10
```

1. 在題目一的執行下，我們發現 SQL 執行速度很慢，您會怎麼去優化？請闡述您怎麼判斷與優化的方式

- 可以先透過 `EXPLAIN` 指令來分析 SQL 效能，來確認是否有使用到 index。在下 `EXPLAIN` 的時候，要特別注意 type 這個欄位，如果結果是 ALL 或 index，代表該 SQL 進行全表掃描，效能極差，沒有成功使用到 index 來查找。從題目一的 QUERY 來看，orders 表中的 currency 及 created_at 需要建立索引來提升效能。

```sql
EXPLAIN SELECT b.id AS bnb_id, b.name AS bnb_name, SUM(o.amount) AS may_amount 
FROM orders AS o 
INNER JOIN bnbs AS b ON o.bnb_id = b.id
WHERE o.currency = 'TWD'
AND o.created_at >= '2023-05-01 00:00:00'
AND o.created_at < '2023-06-01 00:00:00'
GROUP BY b.id, b.name
ORDER BY may_amount DESC
LIMIT 10;
```

- 再來可以確認 `JOIN` 的操作有沒有效能上的優化空間。在 bnbs 表中 ，id 欄位是 primary key，已自動建立索引，需要確認 orders 表中 bnb_id 欄位是否有建立索引。常見的做法是在 orders 表中的 bnb_id 欄位設置 foreign key，如果沒有的話則需要額外建立 index。
- 如果情境上查詢的固定且時常被使用，可以考慮使用 cache 機制。例如利用 in-memory 資料庫 (ex. redis) 來儲存查詢結果，這樣可以大幅提升查詢速度，避免每次都進行重複查詢。
- 可以考慮垂直擴展來提升硬體效能，比如可以增加 CPU、記憶體性能。
- 如果 orders 表中的資料量很多，可以考慮使用 partitioning 或 sharding。透過按日期或其他條件進行分區，查詢只需掃描相關分區，提高查詢速度。如果資料分佈在多個伺服器上，也可以考慮 sharding 來分散查詢 loading。
- 也可以考慮使用 mysql replication 主從式架構，進行讀寫分離。 write 集中在 master 伺服器上，而 read 操作則分散到 slave 伺服器上。這樣可以有效分散資料庫的 loading，提升整體讀取效能。


# API 實作測驗

api 實作 project 符合了以下 SOLID 原則與 design pattern 設計模式

## SOLID 原則

- 單一職責原則 (SRP): 每個類別只對一個角色負責。例如，`orderService` 負責處理訂單邏輯，而每種策略（ex. `nameValidationStrategy`）則處理特定欄位的驗證工作。

```jsx
// src/services/orderService.ts
export class OrderService {
  processOrder(order: Order): Order {
    // 訂單邏輯
  }
}

// src/services/orderStrategies/nameValidationStrategy.ts
export class NameValidationStrategy implements IValidationStrategy {
  validate(order: Order): void {
    if (/[^a-zA-Z\s]/.test(order.name)) {
      throw new Error('Name contains non-English characters');
    }

    if (order.name.charAt(0) !== order.name.charAt(0).toUpperCase()) {
      throw new Error('Name is not capitalized');
    }
  }
}
```

- 開放封閉原則 (OCP): `orderService` 是開放擴充但封閉修改的。透過策略模式，可以新增其他欄位的驗證策略而不需修改現有程式碼。
- 里氏替換原則 (LSP): 每一種策略 (ex. `nameValidationStrategy`、`priceValidationStrategy` ) 都實作 `iValidationStrategy` 介面。這代表它們可以在 `orderService` 中互換而且維持程式的正確性。

```jsx
// src/services/orderStrategies/iValidationStrategy.ts
export interface IValidationStrategy {
  validate(order: Order): void;
}

// src/services/orderService.ts
const strategies: IValidationStrategy[] = [
  new NameValidationStrategy(),
  new PriceValidationStrategy(),
  new CurrencyValidationStrategy(),
];

strategies.forEach(strategy => strategy.validate(order));
```

- 介面隔離原則 (ISP): `iValidationStrategy` 介面只包含 `validate` 方法。這保持介面的簡潔，確保實作只需提供與驗證相關的必要功能。
- 依賴反轉原則 (DIP):`orderService` 依賴於 `iValidationStrategy` 抽象介面，而不是具體實作 (ex. `nameValidationStrategy`)。這樣使得高層模組 (`orderService`) 與低層模組解耦合。如果未來需要更換策略，只需要注入不同的實作類別。

## 設計模式 (Design Pattern)

在這個 project 中，我使用了**策略模式 (strategy pattern)** 來處理訂單的驗證邏輯。該模式將行為封裝到獨立的策略類別中，使得在運行中可以抽換不同策略類別，擴展容易。

在實作中，`orderService` 依賴抽象的 `iValidationStrategy` 介面執行訂單驗證。`orderService` 不需要知道具體的驗證邏輯，只需將驗證工作委託給注入的策略就好。

而 `iValidationStrategy` 定義了一個通用的驗證介面，具體的策略類別有`NameValidationStrategy`、`PriceValidationStrategy` 、 `CurrencyValidationStrategy` ，各自實作介面，提供不同的驗證邏輯。

如果有需要新的驗證邏輯 (ex. 驗證地址)，只需要新增一個策略類別即可，不需修改現有程式碼。