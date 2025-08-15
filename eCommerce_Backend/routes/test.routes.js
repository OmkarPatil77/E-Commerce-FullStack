import express from "express";
import {testSuccess, testFailure} from "../controllers/test.controller.js";

const router = express.Router();

router.get("/success",testSuccess)
router.get("/failure",testFailure)

export default router;