import { Router } from "express";
import {
  handleAddItemToCart,
  handleClearCart,
  handleGetCart,
  handleRemoveCartItem,
  handleUpdateCartItem,
} from "./cart.controller";
import { protect } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validateBody.middleware";
import {
  addCartItemSchema,
  updateCartItemSchema,
} from "./cart.validation";

const router = Router();

router.use(protect);

router.get("/", handleGetCart);
router.post("/", validateBody(addCartItemSchema), handleAddItemToCart);
router.patch(
  "/:productId",
  validateBody(updateCartItemSchema),
  handleUpdateCartItem
);
router.delete("/:productId", handleRemoveCartItem);
router.delete("/", handleClearCart);

export default router;