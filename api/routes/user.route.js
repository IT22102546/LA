import express from "express";
import {
  getAllUsers,
  getUserById,
  createAdminUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats
} from "../controllers/user.controller.js";
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js";
// Import bypass auth middlewares (for development only)
import { bypassVerifyToken, bypassVerifyAdmin } from "../utils/bypassAuth.js";

// Set to true for development, false for production
const BYPASS_AUTH = process.env.NODE_ENV !== 'production';

const router = express.Router();

// Choose auth middleware based on environment
const authMiddleware = BYPASS_AUTH ? bypassVerifyToken : verifyToken;
const adminMiddleware = BYPASS_AUTH ? bypassVerifyAdmin : verifyAdmin;

// Routes that require admin privileges
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.get("/stats", authMiddleware, adminMiddleware, getUserStats);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);
router.post("/admin", authMiddleware, adminMiddleware, createAdminUser);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.patch("/:id/toggle-status", authMiddleware, adminMiddleware, toggleUserStatus);

export default router;
