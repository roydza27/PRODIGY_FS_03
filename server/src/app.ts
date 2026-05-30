import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/product/product.routes";
import cartRoutes from "@/modules/cart/cart.routes";
import orderRoutes from "./modules/orders/order.routes";
import shipmentRoutes from "./modules/shipments/shipment.routes";
import supportRoutes from "./modules/support/support.routes";
import sellerRoutes from "./modules/seller/seller.routes";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";

import { errorHandler } from "@/middlewares/error.middleware";

const app = express();

// Look for CLIENT_URL env string, split it by commas, or fallback to localhost
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or tools like Postman (no origin header)
    if (!origin) return callback(null, true);
    
    const isAllowedDomain = allowedOrigins.includes(origin);
    const isVercelPreview = 
      process.env.NODE_ENV === "production" && origin.endsWith(".vercel.app");

    // If it matches our allowed origins list OR it's a Vercel preview branch, let it through
    if (isAllowedDomain || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error(`Blocked by CORS policy.`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// health check route
app.get("/", (_req, res) => {
  res.send("API is running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/wishlist", wishlistRoutes);

// MUST BE LAST
app.use(errorHandler);

export default app;