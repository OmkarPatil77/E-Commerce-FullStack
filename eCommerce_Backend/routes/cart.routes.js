import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cart.controller.js";
import isAuthenticated from "../middlewares/auth.middeware.js"

const router = express.Router();

router.post("/add", isAuthenticated, addToCart);
router.get("/", isAuthenticated, getCart);
router.put("/update", isAuthenticated, updateCartItem);
router.delete("/remove/:itemId", isAuthenticated, removeCartItem);
router.delete("/clear", isAuthenticated, clearCart);


export default router;