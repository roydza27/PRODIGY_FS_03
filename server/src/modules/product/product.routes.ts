import { Router } from "express";
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProductById,
  handleGetProducts,
  handleUpdateProduct,
  handleCreateSellerProduct,
  handleGetSellerProducts,
  handleUpdateSellerProduct,
  handleDeleteSellerProduct,
  handleGetSellerProductStats,
} from "./product.controller";

import { protect, authorizeRoles } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validateBody.middleware";
import {
  createProductSchema,
  updateProductSchema,
  createSellerProductSchema,
  updateSellerProductSchema,
} from "./product.validation";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================
router.get("/", handleGetProducts);
router.get("/:id", handleGetProductById);

// ============================================
// ADMIN ROUTES (keep existing admin functionality)
// ============================================
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validateBody(createProductSchema),
  handleCreateProduct
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validateBody(updateProductSchema),
  handleUpdateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  handleDeleteProduct
);

export default router;