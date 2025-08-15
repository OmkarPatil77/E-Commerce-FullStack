import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import {
  addReview,
  getProductReviews,
  deleteReview
} from "../controllers/review.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import isAuthenticated from "../middlewares/auth.middeware.js"
import authorizeRoles from "../middlewares/roles.middleware.js"

const router = express.Router();

// Public Routes
router.get("/get", getAllProducts);
router.get("/get/:id", getProductById);

// Protected Admin Routes
router.post("/add", isAuthenticated, authorizeRoles("ADMIN"),upload.single("images"),createProduct);
router.put("/:id", isAuthenticated, authorizeRoles("ADMIN"),upload.single("images"), updateProduct);
router.delete("/:id", isAuthenticated, authorizeRoles("ADMIN"), deleteProduct);

// --- Review Routes ---
router.post("/:productId/addreview", isAuthenticated, addReview);
router.get("/:productId/getreviews", getProductReviews);
router.delete("/:productId/review", isAuthenticated, deleteReview);

export default router;