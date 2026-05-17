# User Authentication System — Learning Project README

## Project Goal

Build a secure user authentication system where users can:

* Register an account
* Log in securely
* Access protected routes
* Stay authenticated using tokens
* Log out safely
* (Optional) Access role-based routes

This project is designed to help understand how authentication works internally instead of relying completely on external services.

---

# Tech Stack

## Frontend

* React
* Vite
* React Router DOM
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication & Security

* JWT (JSON Web Tokens)
* bcrypt
* dotenv
* cors

---

# Core Concepts To Learn

## 1. Authentication

Authentication means verifying WHO the user is.

Example:

* User enters email + password
* Server checks credentials
* If valid → user is authenticated

---

## 2. Authorization

Authorization means checking WHAT the user can access.

Example:

* Admin can access `/admin`
* Normal user cannot

---

## 3. Password Hashing

Never store passwords directly in the database.

Instead:

```txt
password → hashed_password
```

Use bcrypt for hashing.

Why?

* Protects user passwords
* Prevents database leaks from exposing real passwords

---

## 4. JWT (JSON Web Tokens)

JWT is used to keep users logged in.

After successful login:

```txt
Server → generates token
Client → stores token
Client → sends token in requests
Server → verifies token
```

---

## 5. Protected Routes

Protected routes are routes accessible only to authenticated users.

Example:

```txt
/profile
/dashboard
/admin
```

The backend checks if the token is valid before allowing access.

---

# Project Structure

## Recommended Scalable Architecture

This version is better if you want to reuse the same setup across multiple projects and keep it clean as the app grows.

```txt
project-root/
│
├── client/
│   ├── public/
│   ├── src/
│   │
│   │   ├── app/
│   │   │   ├── router/
│   │   │   ├── providers/
│   │   │   └── store/
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   ├── hooks/
│   │   │   │   ├── utils/
│   │   │   │   └── authSlice.ts
│   │   │   │
│   │   │   └── dashboard/
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── layouts/
│   │   │   ├── lib/
│   │   │   └── utils/
│   │   │
│   │   ├── services/
│   │   ├── styles/
│   │   └── main.tsx
│
├── server/
│   ├── src/
│   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.validation.ts
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   └── auth.model.ts
│   │   │   │
│   │   │   └── user/
│   │   │
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── database/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── helpers/
│   │   ├── lib/
│   │   ├── app.ts
│   │   └── server.ts
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Why this architecture is stronger

#### 1. Feature-based structure

Instead of keeping everything in one global `controllers/models/routes` setup, group code by feature:

```txt
modules/auth/
modules/user/
modules/payment/
```

This keeps related code together and makes the project easier to scale.

#### 2. Service layer separation

`auth.controller.ts` should only receive the request, call the service, and send the response.

The business logic belongs in `auth.service.ts`.

That separation makes debugging and testing much easier.

#### 3. Validation layer

Use a dedicated validation file for each feature so register and login rules stay centralized and easy to update.

#### 4. Shared vs feature-specific components

Use `shared/` for reusable UI pieces like buttons, modals, and layouts.

Use `features/` for page-specific and feature-specific UI like login forms or dashboard widgets.

#### 5. `lib/` vs `utils/`

Use `utils/` for small pure helper functions.

Use `lib/` for configured external tools like API clients, JWT helpers, or database connections.

#### 6. Middleware separation

Keep global middleware in the main middleware folder, and put auth-specific middleware inside the auth feature when it only belongs there.

### Why this matters for you

This structure is worth learning now because it helps you build projects that still make sense months later when the codebase grows.

It also trains you to think like a developer who builds systems, not just screens.

### Recommended next learning step

Focus on these while building auth:

* request lifecycle
* middleware chaining
* token lifecycle
* error handling patterns
* HTTP status codes
* validation structure
* service separation
* async flow

## Authentication Flow

## Registration Flow

```txt
User fills form
        ↓
Frontend sends request
        ↓
Backend validates input
        ↓
Password gets hashed
        ↓
User saved in database
        ↓
Success response returned
```

---

## Login Flow

```txt
User enters email/password
        ↓
Backend checks email
        ↓
Compare password with hash
        ↓
Generate JWT token
        ↓
Return token to frontend
        ↓
Frontend stores token
```

---

## Protected Route Flow

```txt
User requests protected route
        ↓
Token sent in headers
        ↓
Backend middleware verifies token
        ↓
If valid → access granted
If invalid → access denied
```

---

# Recommended API Routes

## Auth Routes

### Register

```txt
POST /api/auth/register
```

### Login

```txt
POST /api/auth/login
```

### Logout

```txt
POST /api/auth/logout
```

---

## User Routes

### Get Profile

```txt
GET /api/user/profile
```

Protected Route

---

## Admin Routes (Optional)

### Admin Dashboard

```txt
GET /api/admin/dashboard
```

Protected + Role Based

---

# Database Schema Example

## User Model

Fields:

```txt
name
email
password
role
createdAt
```

---

# Middleware Concepts

## Auth Middleware

Purpose:

* Verify JWT token
* Allow only authenticated users

Example Flow:

```txt
Request → Middleware → Verify Token → Continue
```

---

## Role Middleware

Purpose:

* Restrict routes based on user role

Example:

```txt
Admin only route
```

---

# Security Best Practices

## Important Rules

### Never:

* Store plain passwords
* Expose secret keys
* Trust frontend validation only
* Store sensitive secrets in GitHub

---

## Always:

* Use bcrypt
* Use environment variables
* Validate user input
* Protect backend routes
* Handle errors properly

---

# Environment Variables

Example `.env`

```env
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
```

---

# Frontend Responsibilities

The frontend should:

* Create forms
* Send API requests
* Store token
* Redirect authenticated users
* Protect frontend routes
* Handle logout

---

# Backend Responsibilities

The backend should:

* Validate requests
* Hash passwords
* Generate tokens
* Verify tokens
* Protect routes
* Handle database operations

---

# Suggested Learning Order

## Phase 1

* Setup React frontend
* Setup Express backend
* Connect MongoDB

---

## Phase 2

* Create register API
* Hash password
* Save user

---

## Phase 3

* Create login API
* Verify password
* Generate JWT

---

## Phase 4

* Create protected routes
* Create auth middleware

---

## Phase 5

* Add role-based access
* Improve error handling
* Improve validation

---

# Common Mistakes Beginners Make

## 1. Storing plain passwords

Very dangerous.

Always hash passwords.

---

## 2. Protecting only frontend routes

Frontend protection is NOT enough.

Backend must verify authentication too.

---

## 3. Hardcoding secrets

Never write secrets directly in code.

Use `.env` files.

---

## 4. Skipping validation

Always validate:

* Email
* Password length
* Required fields

---

# Recommended Packages

## Backend

```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

Development:

```bash
npm install -D nodemon
```

---

## Frontend

```bash
npm install react-router-dom axios
```

---

# Things To Understand Deeply

Focus on understanding:

* Why passwords are hashed
* Why JWT exists
* How middleware works
* Difference between authentication and authorization
* Why backend route protection matters
* Token lifecycle
* Request/response flow

---

# Bonus Features (Optional)

After completing the basics:

* Refresh tokens
* Email verification
* Forgot password
* Password reset
* Google OAuth
* Rate limiting
* Account locking
* Session expiration

---

# Final Learning Advice

Do not copy large authentication tutorials blindly.

Build slowly:

1. Understand flow
2. Build small features
3. Test every step
4. Debug errors yourself
5. Improve architecture gradually

The goal is not just making login work.

The goal is understanding WHY each authentication layer exists.

That is what turns beginners into developers.
