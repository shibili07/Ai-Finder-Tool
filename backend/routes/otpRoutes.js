import express from "express";
import {sendOtp} from "../controllers/otpController.js"

const router = express.Router();


router.post("/sentOtp",sendOtp);
export default router;
