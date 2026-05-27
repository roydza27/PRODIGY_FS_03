# 🏗️ Architecture Guide

This document outlines the high-level architecture of the E-Commerce platform, explaining the design patterns and structures used across the stack to ensure maintainability, scalability, and type safety.

---

## 🖥️ Client Architecture (Frontend)

The frontend is a **React 19** application built with **Vite** and **TypeScript**. We use a **Feature-Sliced Design (FSD)** inspired architecture to keep the codebase modular and scalable.

### 1. Directory Structure

- `src/app/`: The core initialization of the application. Contains the global React Router setup (`router/`), global stores (`store/`), and root-level providers.
- `src/features/`: The heart of the application. Business logic is grouped by domain (e.g., `auth`, `admin`, `cart`, `seller`). 
  - Each feature folder contains its own `components/`, `pages/`, `services/` (API calls), `hooks/`, and `types/`. This isolation prevents spaghetti code and tight coupling.
- `src/shared/`: Code that is truly globally shared.
  - `components/`: Generic UI components, particularly **shadcn/ui** elements.
  - `layouts/`: Core page wrappers (`AdminLayout`, `AuthLayout`, etc.).
  - `types/`: Global TypeScript interfaces that span multiple features.
- `src/lib/`: Third-party library initializations and core utilities (e.g., tailwind merge utility `utils.ts`).

### 2. State Management

- **Local State:** Managed via React `useState` and `useReducer`.
- **Global Server State / API Calls:** Encapsulated in feature-specific service files (e.g., `auth.service.ts`), using Axios.
- **Global Client State:** Managed via **Zustand**. For instance, `useAuthStore` (`src/app/store/auth.store.ts`) manages authentication tokens, hydration, and user session across the app.

### 3. Styling and UI

- **Tailwind CSS v4:** Used for all styling. Ensures a utility-first, highly responsive design.
- **shadcn/ui + Radix UI:** Provides accessible, unstyled primitives that we style with Tailwind. Components are imported into `shared/components/ui/` so they can be modified if needed.
- **Animations:** Managed via `framer-motion` for page transitions and complex interactive states.

---

## ⚙️ Server Architecture (Backend)

The backend is an **Express.js** application written in **TypeScript**. It follows a strict **Module-Based** Service-Oriented Architecture.

### 1. Directory Structure

- `src/app.ts`: Express application setup, global middleware registration (CORS, body parsing), and API route aggregation.
- `src/server.ts`: The entry point that connects to the database and starts the HTTP server.
- `src/middlewares/`: Global Express middlewares (e.g., `auth.middleware.ts` for verifying JWTs, `validateBody.middleware.ts` for Zod validation, and `error.middleware.ts` for centralized error handling).
- `src/modules/`: Similar to the frontend's features, backend logic is grouped by domain (`auth`, `product`, `order`, `seller`, etc.).

### 2. The Module Pattern

Inside every module (e.g., `src/modules/product/`), you will find:
- **`product.model.ts`**: The Mongoose Schema and Model definition. Controls database interactions and document structure.
- **`product.validation.ts`**: **Zod** schemas defining the exact shape of incoming request bodies, queries, and parameters.
- **`product.service.ts`**: Contains the core business logic. The service interacts directly with the Mongoose model. It does *not* know about Express `req` or `res` objects.
- **`product.controller.ts`**: Express route handlers. They extract data from `req`, call the respective method in the Service layer, and return the `res` to the client. Keep controllers thin!
- **`product.routes.ts`**: Defines the Express Router and binds HTTP methods, paths, validation middlewares, auth middlewares, and controller functions.

### 3. Authentication Flow

1. **Login/Register:** User hits `/api/auth/login`. The controller validates credentials using bcrypt and generates a JWT.
2. **Client Storage:** The frontend stores this token in `localStorage`/`sessionStorage` and injects it into the Axios default headers.
3. **Protected Routes:** Requests to protected backend routes pass through `auth.middleware.ts`, which verifies the JWT signature and attaches the decoded user context to `req.user`.
4. **Role-Based Access Control (RBAC):** Specific routes can use middlewares like `requireAdmin.middleware.ts` to ensure the `req.user.role` matches the required privileges before proceeding.

### 4. Error Handling

We avoid scattered `try/catch` blocks inside controllers by utilizing an Express error-handling middleware. 
- Business logic in services throws a custom `AppError` class (which extends `Error` and includes HTTP status codes).
- If an async controller throws, Express catches it and forwards it to `errorHandler` (in `error.middleware.ts`), which ensures a consistent JSON error response format sent to the client.