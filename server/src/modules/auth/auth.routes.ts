import { Router } from "express";
import { login, register } from "./auth.controller";
import { protect, authorizeRoles } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  return res.json({
    success: true,
    message: "You are logged in",
    user: req.user,
  });
});

router.get("/admin", protect, authorizeRoles("admin"), (_req, res) => {
  return res.json({
    success: true,
    message: "Admin access granted",
  });
});

export default router;