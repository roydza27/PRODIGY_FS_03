import { Router } from "express";
import { protect, authorizeRoles } from "../../middlewares/auth.middleware";
import {
  createSupportTicketController,
  getSupportTicketsController,
  getSupportTicketByIdController,
  updateSupportTicketStatusController,
} from "./support.controller";

const router = Router();

// Public / authenticated customers can create tickets
router.post("/", protect, createSupportTicketController);

// Admin only
router.get("/", protect, authorizeRoles("admin"), getSupportTicketsController);
router.get("/:id", protect, authorizeRoles("admin"), getSupportTicketByIdController);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateSupportTicketStatusController
);

export default router;