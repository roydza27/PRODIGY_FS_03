# Enhancement Roadmap: Architecture & Data Lifecycle Upgrade

## 1. Transition Plan from Mock Data to Real Data Lifecycle

### 1.1 Live Order & Revenue Aggregations
- **Current State:** Relying on mocked endpoints or static seed data in `server/src/modules/orders/` and UI fallbacks in `client/src/features/admin/`.
- **Target State:** Implement robust Mongoose aggregation pipelines within `server/src/modules/orders/order.service.ts` to compute real-time revenue, order statuses, and vendor payouts.
- **Action Items:**
  - Deprecate hardcoded dashboard data arrays in `client/src/features/admin/pages/`.
  - Introduce `$match`, `$group`, and `$project` aggregations in the order service for period-over-period revenue reporting.
  - Integrate a Stripe/PayPal webhook listener in `server/src/modules/orders/order.routes.ts` to guarantee synchronized payment and lifecycle statuses.

### 1.2 Authentic Carrier Tracking Integration (Shipments)
- **Current State:** Dummy tracking strings or mock statuses for logistics.
- **Target State:** Live carrier API integration (e.g., Shippo, EasyPost) for real-time tracking webhooks.
- **Action Items:**
  - Build an external API facade in the backend for shipment status.
  - Store external `tracking_number` and `carrier_id` natively within the system's models.
  - Expose a webhook endpoint `POST /api/shipments/webhook` to handle asynchronous carrier status updates.
  - Implement a websocket event layer to push tracking updates directly to `client/src/features/account/`.

### 1.3 KYC & Bank Verification Data
- **Current State:** Basic seller models in `server/src/modules/seller/` without stringent identity or bank verifications.
- **Target State:** Integration with real identity verification services (e.g., Stripe Connect, Plaid) for compliant vendor payouts.
- **Action Items:**
  - Extend the Mongoose schema to include `kycStatus`, `stripeAccountId`, and `verificationData`.
  - Create secure upload pipelines for KYC documents within `server/src/modules/seller/seller.routes.ts`, utilizing pre-signed cloud storage URLs.
  - Migrate away from mocked banking details in `client/src/features/seller/pages/` to PCI-compliant iframe elements or specialized OAuth redirect flows.

## 2. Database & Performance Hardening

### 2.1 Calculated Index Caching vs. Active Aggregates
- **Current State:** On-the-fly execution of heavy database queries for dashboards and catalog listings.
- **Target State:** Pre-aggregated materialized views or Redis-backed caching for frequently accessed metrics.
- **Action Items:**
  - Implement a Redis caching layer in `server/src/config/db.ts` or a dedicated caching middleware.
  - Shift expensive dashboard data generation to a background cron job (using BullMQ or Agenda) that updates a dedicated metrics collection.
  - Serve `GET /api/admin/dashboard` directly from the cached metrics rather than executing live `$group` operations per request.

### 2.2 Explicit Compound Indexing
- **Current State:** Unoptimized generic `_id` indexes on data-heavy models.
- **Target State:** Highly optimized queries using explicit compound indexes tailored to the specific search and access patterns of the API.
- **Action Items:**
  - Add compound indexes to the Product schema: `{ category: 1, price: -1, status: 1 }` for optimized catalog browsing.
  - Add compound indexes to the Order schema: `{ sellerId: 1, createdAt: -1, status: 1 }` to accelerate dashboard loading times.
  - Audit all `find()` queries in `server/src/modules/**/*.service.ts` using MongoDB's `explain("executionStats")` to identify index misses.

## 3. Strategic Growth Loops

### 3.1 CDN Image Offloading
- **Current State:** Static uploads or basic references like `client/public/placeholder-product.png`.
- **Target State:** All user-generated content (UGC) and static assets distributed globally via a CDN (e.g., AWS CloudFront, Cloudinary).
- **Action Items:**
  - Introduce a dedicated image upload service in `server/src/modules/product/product.service.ts` leveraging AWS S3 and presigned POST URLs.
  - Update product schemas to store absolute CDN URIs instead of relative local paths.
  - Refactor React components in `client/src/features/products/components/` to utilize optimized CDN URLs handling responsive image sizing and WebP formats.

### 3.2 Automated Platform Onboarding Alerts
- **Current State:** Passive user creation via `auth.controller.ts` with no proactive lifecycle engagement.
- **Target State:** Automated, segmented push and email campaigns to activate new sellers and buyers.
- **Action Items:**
  - Integrate an event bus (e.g., EventEmitter or Redis Pub/Sub) in `server/src/modules/auth/auth.service.ts` to emit specific `USER_REGISTERED` events.
  - Develop a notification service to consume these events and trigger API calls to providers like SendGrid or Twilio.
  - Design conditional onboarding loops based on the registered role (e.g., "Complete your seller profile" vs. "Explore top categories").

### 3.3 Real-Time Push Engines
- **Current State:** Synchronous HTTP polling or manual page refreshes in `client/src/features/cart/` or order lists to observe status changes.
- **Target State:** Bi-directional real-time communication for immediate feedback on orders and stock.
- **Action Items:**
  - Set up a WebSocket server (e.g., Socket.io) alongside the Express app in `server/src/server.ts`.
  - Implement selective channel subscriptions in the React client, allowing users to listen to their specific `userId` or `orderId` topics.
  - Dispatch real-time events from `server/src/modules/orders/order.controller.ts` on checkout success or shipment updates to instantly reflect in the UI without re-fetching.