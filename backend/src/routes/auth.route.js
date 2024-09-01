import { Router } from "express";
const router = Router();

import {
  checkAuth,
  createUser,
  forgotPassword,
  loginUser,
  logoutUser,
  resetPassword,
  verifyEmail,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/verify.js";

// GET
router.get("/me", verifyToken, checkAuth);

// POST
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// EMAIL
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
