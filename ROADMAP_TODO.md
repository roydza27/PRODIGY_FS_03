# 🚀 Project Enhancement Roadmap: Implementation Task List

This document outlines the granular technical tasks required to transition from the current prototype to a production-hardened platform.

---

## 1. Data Lifecycle & Analytics (Real-Time Aggregations)

### Backend (Server)
- [ ] **Mongoose Aggregation Pipelines**: Implement `getRevenueStats` and `getOrderVolumeStats` using `$match`, `$group`, and `$project` in `server/src/modules/orders/order.service.ts` to aggregate monthly revenue and order volume.
- [ ] **Payment Gateway Webhooks**: Define Stripe/PayPal webhook endpoints in `server/src/modules/orders/order.routes.ts` to handle `payment_intent.succeeded` and `checkout.session.completed` events.
- [ ] **Service State Management**: Update `server/src/modules/orders/order.service.ts` to implement transition logic from `Pending` to `Paid` status upon successful webhook validation.

### Frontend (Client)
- [ ] **Deprecate Admin Mocks**: Remove mock data structures in `client/src/features/admin/pages/` and replace them with dynamic data fetching from the new analytics endpoints.
- [ ] **Real-time Stats Binding**: Implement React Query or SWR hooks in `client/src/features/admin/services/admin.service.ts` to fetch and cache live revenue metrics.

---

## 2. Logistics & Carrier Tracking Integration

### Backend (Server)
- [ ] **Carrier API Facades**: Create `server/src/modules/shipments/` and implement integration with Shippo or EasyPost SDKs for live rate calculation and label generation.
- [ ] **Schema Extension**: Add `trackingNumber` (String) and `carrierId` (String) fields to the `Order` schema in `server/src/modules/orders/order.model.ts`.
- [ ] **Shipment Webhooks**: Implement `POST /api/shipments/webhook` to handle external carrier updates and trigger internal status changes.

### Frontend (Client)
- [ ] **Tracking UI Components**: Create `TrackingTimeline.tsx` in `client/src/features/account/components/` to visualize the shipment journey for users.
- [ ] **Real-time Status Updates**: Implement WebSocket listeners in `client/src/features/account/` to push shipment status changes directly to the user's dashboard.

---

## 3. Seller KYC & Financial Hardening

### Backend (Server)
- [ ] **KYC Schema Updates**: Extend the seller profile in `server/src/modules/auth/auth.model.ts` with `kycStatus` (enum) and `stripeAccountId`.
- [ ] **Secure S3 Uploads**: Implement presigned URL logic in `server/src/modules/seller/seller.routes.ts` for encrypted identity document uploads to AWS S3.
- [ ] **Banking Integration**: Implement Stripe Connect OAuth flow in `server/src/modules/seller/seller.service.ts` for automated seller payouts.

### Frontend (Client)
- [ ] **KYC Onboarding Wizard**: Develop a multi-step onboarding flow in `client/src/features/seller/pages/` to collect business and identity information.
- [ ] **PCI Compliant Iframes**: Integrate Stripe/PayPal financial components in `client/src/features/seller/components/` for secure bank account linking.

---

## 4. Database Performance & Caching

### Backend (Server)
- [ ] **Redis Initialization**: Configure Redis client connection and error handling in `server/src/config/db.ts`.
- [ ] **Dashboard Caching**: Implement a caching layer for `GET /api/admin/dashboard` in the admin controller to reduce database load during peak hours.
- [ ] **Background Task Queue**: Setup BullMQ or Agenda in `server/src/server.ts` to handle asynchronous revenue recalculations and metric updates.
- [ ] **Compound Indexing (Products)**: Add `productSchema.index({ category: 1, price: -1, status: 1 })` in `server/src/modules/product/product.model.ts`.
- [ ] **Compound Indexing (Orders)**: Add `orderSchema.index({ sellerId: 1, createdAt: -1, status: 1 })` in `server/src/modules/orders/order.model.ts`.

---

## 5. Media Optimization & CDN Strategy

### Backend (Server)
- [ ] **CDN URI Offloading**: Refactor `server/src/modules/product/product.service.ts` to return absolute CDN URLs instead of local file paths for product images.
- [ ] **Image Processing Pipeline**: Integrate Sharp.js to convert uploaded images to `.webp` format and generate multiple responsive sizes.

### Frontend (Client)
- [ ] **WebP Implementation**: Update `client/src/features/products/components/` to use modern image formats and `srcset` for optimized mobile delivery.

---

## 6. Real-Time Event & Messaging Engine

### Backend (Server)
- [ ] **Socket.io Integration**: Initialize `socket.io` in `server/src/server.ts` and implement a global event emitter for system-wide notifications.
- [ ] **Redis Pub/Sub Bus**: Setup a Redis event bus in `server/src/modules/auth/auth.service.ts` to broadcast `USER_REGISTERED` and `SELLER_VERIFIED` events across server instances.
- [ ] **Live Order Dispatches**: Implement real-time order notifications in `server/src/modules/orders/order.controller.ts` to alert sellers of new purchases.

### Frontend (Client)
- [ ] **Socket Subscription Logic**: Implement socket channel subscriptions in `client/src/App.tsx` or a dedicated provider to handle live toast notifications.

---

## Engineering Validation Checklist

### Database & Performance
- [ ] **Index Verification**: Run `db.orders.explain("executionStats").find({ sellerId: ... })` to confirm index hits and query performance.
- [ ] **Cache Hit Ratio**: Monitor Redis logs to verify that 90%+ of dashboard requests are served from cache after the first load.

### Data Integrity
- [ ] **Webhook Validation**: Use **Stripe CLI** to simulate successful payments and verify that order statuses in MongoDB update without manual intervention.
- [ ] **KYC Pipeline**: Test the S3 upload flow to ensure identity documents are stored with private access permissions and restricted presigned TTLs.

### Real-Time Delivery
- [ ] **Socket Latency**: Verify that `NEW_ORDER` events are received by the client in `< 200ms` using browser performance tools.
- [ ] **CDN Propagation**: Check that image requests are served from the nearest edge location with valid `Cache-Control` headers.
