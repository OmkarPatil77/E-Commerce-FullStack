import express from "express";
import { getAdminDashboardStats } from "../controllers/admin.controller.js";
import isAuthenticated from "../middlewares/auth.middeware.js";
import authorizeRoles from "../middlewares/roles.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  isAuthenticated,
  authorizeRoles("ADMIN"),
  getAdminDashboardStats
);

export default router;
