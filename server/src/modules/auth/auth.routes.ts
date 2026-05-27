import { Router } from "express";
import { register, login, googleLogin, forgotPassword, resetPassword } from "./auth.controller";
import { protect, authorizeRoles } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

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