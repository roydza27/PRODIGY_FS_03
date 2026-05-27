# 🚀 Deployment Guide

This guide covers how to deploy the E-Commerce platform for a production environment. Since the project consists of a React/Vite frontend and a Node.js/Express backend, they are typically deployed separately to specialized hosting providers.

---

## 🗄️ Database: MongoDB Atlas

Before deploying the backend, you need a highly available database.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster (the free tier works well for starting out).
3. Under **Database Access**, create a database user and securely store the password.
4. Under **Network Access**, allow IP addresses (e.g., `0.0.0.0/0` to allow access from anywhere, or specifically white-list your backend server's IP).
5. Click **Connect** -> **Connect your application** and copy the Connection String.

---

## ⚙️ Backend Deployment (Render, Railway, or Heroku)

We recommend using **Render** or **Railway** for seamless Node.js deployments.

### Using Render (render.com)

1. Push your code to a GitHub repository.
2. Log into Render and click **New+** -> **Web Service**.
3. Connect your GitHub repository and select the root directory (or specify the `server` folder using the Root Directory setting).
4. Configure the environment:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start` (which maps to `node dist/server.js`)
5. Add Environment Variables (`.env` equivalents):
   - `PORT`: (Render will assign one automatically, but you can set it if needed)
   - `MONGO_URI`: *Your MongoDB Atlas Connection String*
   - `JWT_SECRET`: *A secure random string*
   - `JWT_EXPIRES_IN`: e.g., `7d`
   - `CLIENT_URL`: *The URL where your frontend will be deployed (e.g., `https://my-store.vercel.app`)*
6. Click **Create Web Service**.

*Note: Ensure your Express `cors` configuration allows the `CLIENT_URL` domain.*

---

## 🖥️ Frontend Deployment (Vercel or Netlify)

Vercel provides best-in-class support for Vite/React applications.

### Using Vercel (vercel.com)

1. Log into Vercel and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. In the project configuration:
   - **Framework Preset:** Vite
   - **Root Directory:** Edit this and select `client`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variables:
   - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://ecommerce-api.onrender.com/api`)
5. Click **Deploy**.

---

## 🔄 Post-Deployment Checklist

1. **Test CORS:** Open your deployed Vercel frontend, open the browser console, and attempt to log in or fetch products. Ensure there are no Cross-Origin Resource Sharing errors.
2. **Secure Secrets:** Verify that no `.env` files or secrets are committed to your GitHub repository.
3. **Database Indexes:** Mongoose will automatically create indexes upon startup, but monitor your MongoDB Atlas dashboard to ensure performance is optimal.