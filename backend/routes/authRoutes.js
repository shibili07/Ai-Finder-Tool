import express from "express";
import { signup } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/signup", signup);


export default router;
