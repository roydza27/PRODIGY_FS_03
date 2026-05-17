import express from "express";
import cors from "cors";

import authRoutes from "@/modules/auth/auth.routes";
import employeeRoutes from "@/modules/employee/employee.routes";
import productRoutes from "./modules/product/product.routes";

import { errorHandler } from "@/middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use(express.json());

// health check route
app.get("/", (_req, res) => {
  res.send("API is running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", productRoutes);

// MUST BE LAST
app.use(errorHandler);

export default app;