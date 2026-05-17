import { Router } from "express";
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProductById,
  handleGetProducts,
  handleUpdateProduct,
} from "./product.controller";

import { protect, authorizeRoles } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validateBody.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "./product.validation";

const router = Router();

router.get("/", handleGetProducts);
router.get("/:id", handleGetProductById);

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