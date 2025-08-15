import express from "express";
import {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} from "../controllers/order.controller.js";

import isAuthenticated from "../middlewares/auth.middeware.js"
import authorizeRoles from "../middlewares/roles.middleware.js"

const router = express.Router();

router.post("/place", isAuthenticated, placeOrder); // Place Order
router.get("/my", isAuthenticated, getMyOrders); // Get Logged-in-user's orders

// Admin Routes
router.get("/", isAuthenticated, authorizeRoles("ADMIN", getAllOrders)); // Admin: All orders
router.put("/:id", isAuthenticated, authorizeRoles("ADMIN", updateOrderStatus)); // Admin: Update order

export default router;