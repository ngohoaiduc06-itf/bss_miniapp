# Hệ thống — Tài liệu chi tiết

## Tóm tắt nhanh
Dự án `duc-nh-app-store` là một Shopify App gồm:
- Frontend: `app/` — React + React Router (Remix-style) tích hợp Shopify App.
- Backend API: `api/` — Koa server viết bằng TypeScript, dùng Sequelize (MySQL) cho dữ liệu ứng dụng và session.

Mục tiêu tài liệu này: mô tả kiến trúc, luồng chạy (run flow), cách thiết lập môi trường, cách chạy dev/prod, và mẹo xử lý sự cố.

---

## 1. Kiến trúc hệ thống (System Overview)

- Flow tổng thể:
  1. Người dùng mở app (ứng dụng nhúng trong Shopify admin hoặc qua URL do `shopify app dev` cung cấp).
  2. Frontend (`app/`) thực hiện xác thực với Shopify (mã trong `app/shopify.server.ts`).
  3. Frontend gọi API nội bộ (`api/`) thông qua các API client ở `app/api/` (`ruleApi.ts`, `productApi.ts`, `shopApi.ts`).
  4. API (`api/server.ts`) xử lý request thông qua các `routes` → `controllers` và truy vấn dữ liệu bằng Sequelize (`api/models/*`).
  5. Session và dữ liệu ứng dụng được lưu trong cơ sở dữ liệu MySQL (Sequelize).
  6. Khi cần, server gọi API Shopify (qua `shopify` helper) để thao tác admin/shopify data.

- Thành phần chính:
  - `app/`: routes, components, store (Redux Toolkit), shopify integration.
  - `api/`: Koa server, `api/routes/*`, `api/controllers/*`, `api/models/*` (Sequelize), `api/services/shopify.service.ts`.
  - `extensions/`: code extension cho Shopify (blocks, snippets, locales).

- Lưu ý quan trọng: Dự án sử dụng Sequelize (MySQL) cho cả dữ liệu ứng dụng và session storage. Trong production bạn nên dùng một DB sản xuất (MySQL hoặc Postgres) và cấu hình cả ứng dụng để kết nối tới nó.

---

## 2. Luồng chạy (Run Flow) — chi tiết kỹ thuật

1. `shopify app dev` (script `dev`) sẽ khởi tạo tunnel (hoặc localhost) và chạy toàn bộ app (frontend + server tích hợp với CLI), đưa ra URL để cài app vào store dev.
2. Khi user cài app, Shopify gọi lại `afterAuth` hook (nếu được cấu hình), ứng dụng lưu session vào DB.
3. Frontend khi tương tác gọi API trong `app/api/*`:
   - Những request đến backend sẽ tới `api/server.ts` trên `API_PORT` (mặc định `3001`).
   - `api/server.ts` gọi `connectDatabase()` (Sequelize) và `sequelize.sync()` để đảm bảo các bảng (Shop, Rule) tồn tại.
4. Backend lưu/đọc data app bằng Sequelize models (`api/models/Shop.ts`, `api/models/Rule.ts`).

---

## 3. Thiết lập môi trường (Setup) — Các bước chi tiết

### 3.1 Yêu cầu trước
- Node.js (x >= 20.19, <22 hoặc >=22.12). Xem `package.json` `engines`.
- `pnpm`/`npm` để cài dependencies.
- Shopify CLI (để chạy `shopify app dev`).
- MySQL server (ứng dụng sử dụng MySQL / Sequelize cho dữ liệu và session).

### 3.2 Clone & cài đặt

```bash
# từ thư mục dự án gốc
pnpm install
# hoặc
npm install
```

### 3.3 Biến môi trường quan trọng
Tạo file `.env` (không commit secrets). Ví dụ `.env.example`:

```
# Shopify
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_products,write_products
SHOPIFY_APP_URL=https://example.ngrok.io
SHOP_CUSTOM_DOMAIN=

# API / DB (Sequelize - MySQL)
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=secret
DATABASE_NAME=duc_nh_app_db

# Backend API
API_PORT=3001
```

Giải thích biến chính:
- `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`: keys của app trên Shopify (bắt buộc để dev/đăng nhập).
- `SCOPES`: quyền cần thiết (comma-separated).
- `SHOPIFY_APP_URL`: URL public của ứng dụng (CLI thường cấp khi chạy `shopify app dev`).
- `DATABASE_*`: kết nối MySQL dùng cho Sequelize models và session storage.
- `API_PORT`: port cho `api/server.ts`.

### 3.4 Khởi tạo DB
- Dự án dùng Sequelize cho dữ liệu ứng dụng; `api/server.ts` gọi `sequelize.sync()` khi khởi động để đảm bảo các bảng (ví dụ `shops`, `rules`) tồn tại.
- Đảm bảo MySQL server đang chạy và các biến `DATABASE_*` được set.

Nếu bạn muốn dùng migration tool cho Sequelize, áp dụng workflow migration tương ứng; mặc định server sẽ tự tạo bảng khi cần.

---

## 4. Lệnh chạy & phát triển (Commands)

- Chạy toàn bộ (Shopify dev):

```bash
npm run dev
# => chạy `shopify app dev`
```

- Chạy chỉ API (một-shot):

```bash
npm run api
# => `tsx api/server.ts`
```

- Chạy API watch (dev):

```bash
npm run api:dev
# => `tsx watch api/server.ts`
```

- Build frontend/server:

```bash
npm run build
```

- Start built server:

```bash
npm run start
```

- Docker helper:

```bash
npm run docker-start
```

---

## 4.1 API Reference

Base path: `/api`

### Shops

- POST `/api/shops`
   - Request body (JSON):
      - `shopDomain` (string, required)
      - `shopName` (string, required)
      - `accessToken` (string, required)
   - Responses:
      - `201` { success: true, data: shop } — shop created
      - `200` { success: true, data: shop } — shop already existed and was updated
      - `400` { success: false, message: 'Missing required fields' }

- GET `/api/shops/:shopDomain`
   - Responses:
      - `200` { success: true, data: shop } — `accessToken` excluded from returned object
      - `404` { success: false, message: 'Shop not found' }

- PUT `/api/shops/:shopDomain`
   - Request body (JSON):
      - `shopName` (string, optional)
   - Responses:
      - `200` { success: true, data: { id, shopDomain, shopName } }
      - `404` { success: false, message: 'Shop not found' }

- PATCH `/api/shops/:shopDomain/uninstalled`
   - Marks shop status as `uninstalled`.
   - Responses:
      - `200` { success: true, data: { id, shopDomain, shopName, status } }
      - `404` { success: false, message: 'Shop not found' }

### Rules

- GET `/api/rules?shopId={shopId}`
   - Query params:
      - `shopId` (number, required)
      - `search` (optional, supported in route comment but not used for filtering in code)
   - Responses:
      - `200` { success: true, data: [rule...] }
      - `400` { success: false, message: 'shopId is required' }
   - Rule fields returned: `id`, `shopId`, `name`, `status`, `priority`, `applyTo`, `tags`, `pricingType`, `value`, `createdAt`, `updatedAt`.

- GET `/api/rules/:id`
   - Responses:
      - `200` { success: true, data: rule }
      - `404` { success: false, message: 'Rule not found' }

- POST `/api/rules`
   - Request body (JSON):
      - `shopId` (number, required)
      - `name` (string, required)
      - `pricingType` ("fixedPrice" | "fixedDiscount" | "percentage", required)
      - `value` (number, required)
      - `status` ("enable" | "disable", optional, default `enable`)
      - `applyTo` ("all" | "tags", optional, default `all`)
      - `tags` (array, optional)
   - Responses:
      - `201` { success: true, data: rule } — created
      - `400` { success: false, message: 'Missing required fields' }
   - Side effects: newly created rules trigger `syncRulesToShopMetafield` to push rules to Shopify metafields.

- PUT `/api/rules/:id`
   - Request body (JSON): any of the updatable fields: `name`, `status`, `applyTo`, `tags`, `pricingType`, `value`.
   - Responses:
      - `200` { success: true, data: rule } — updated
      - `404` { success: false, message: 'Rule not found' }
   - Side effects: updates trigger `syncRulesToShopMetafield` to sync changes.

- DELETE `/api/rules/:id`
   - Responses:
      - `204` — deleted (no body)
      - `404` { success: false, message: 'Rule not found' }
   - Side effects: deletion triggers `syncRulesToShopMetafield` to update Shopify.

### Products

- GET `/api/products?shopId={shopId}`
   - Query params:
      - `shopId` (number, required)
   - Responses:
      - `200` { success: true, data: [product...] }
      - `400` { success: false, message: 'shopId is required' }
   - Product format returned (formatted): `id`, `title`, `handle`, `status`, `tags`, `image` (url|null), `imageAlt`, `price` (number), `variantId`.

---

## 5. Hướng dẫn sử dụng (Usage) — thao tác phổ biến

1. Dev nhanh (workflow):
   - Thiết lập `.env` với `SHOPIFY_*` và `DATABASE_*`.
   - Đảm bảo MySQL đang chạy; khởi động server sẽ tự tạo bảng bằng `sequelize.sync()`.
   - `npm run dev` để chạy toàn bộ; mở URL do CLI cung cấp, cài app vào store dev.

2. Chạy backend độc lập:
   - `npm run api:dev` — develop API riêng, truy cập `http://localhost:3001`.

3. Kiểm tra dữ liệu:
   - Models chính: `Shop`, `Rule` (xem `api/models/Shop.ts` và `api/models/Rule.ts`).
   - Nếu bạn muốn xem DB tables, kết nối với MySQL và kiểm tra bảng `shops`, `rules`.

4. Endpoints chính (ví dụ - kiểm tra `api/routes` để biết chính xác):
   - `GET /shops` (ví dụ) — danh sách shops
   - `POST /rules` — tạo rule
   - `GET /rules` — danh sách rule
   - `PUT /rules/:id` — cập nhật
   - `DELETE /rules/:id` — xóa

(Lưu ý: đường dẫn thực tế và payload cụ thể nằm trong `api/routes/*` và `api/controllers/*`.)

---

## 6. Xử lý sự cố (Troubleshooting)

- Nếu bảng không tồn tại: đảm bảo MySQL đang chạy và khởi động server để `sequelize.sync()` tạo bảng, hoặc áp migration Sequelize nếu bạn có workflow migration.
- Sequelize không kết nối: kiểm tra `DATABASE_*` env vars và rằng MySQL server đang chạy; kiểm tra log khi `api/server.ts` gọi `connectDatabase()`.
- Port trùng lặp: thay `API_PORT` trong `.env`.
- Webhook test qua CLI không có `admin` object: dùng app-specific webhooks trong `shopify.app.toml` hoặc test qua store thật.

---

## 7. Bảo trì & Production notes
- Sử dụng một DB production (MySQL/Postgres) cho Sequelize; đảm bảo cả dữ liệu và session lưu trên DB production.
- Bật biến `NODE_ENV=production` khi deploy.
- Lưu secrets (Shopify keys, DB credentials) trong secret manager của nền tảng hosting.

---

## 8. Tệp quan trọng (Quick file map)
- `api/server.ts` — entry point API
- `api/config/database.ts` — Sequelize DB config
- `api/routes/` — định nghĩa endpoints
- `api/controllers/` — business logic
- `api/models/` — Sequelize models: `Shop.ts`, `Rule.ts`
- `app/shopify.server.ts` — cấu hình Shopify app
- `app/api/` — client wrappers gọi API backend
- `package.json` — script và dependency

---