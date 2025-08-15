import express from "express";
import { register,login,forgotPassword,resetPassword,getUserProfile,updateUserProfile } from "../controllers/auth.controller.js";
import isAuthenticated from "../middlewares/auth.middeware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//  Protected Profile Routes
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);

export default router;