import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware";
import {
  handleAddToWishlist,
  handleClearWishlist,
  handleGetWishlist,
  handleRemoveFromWishlist,
} from "./wishlist.controller";

const router = Router();

router.get("/", protect, handleGetWishlist);
router.post("/:productId", protect, handleAddToWishlist);
router.delete("/:productId", protect, handleRemoveFromWishlist);
router.delete("/", protect, handleClearWishlist);

export default router;