import Redis from "ioredis";
import crypto from "crypto";
import {sentOptMail} from "../helper/mailer.js"
const redis = new Redis(process.env.REDIS_URL)


export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body)
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Store hashed OTP with expiry (5 min)
    await redis.set(`otp:${email}`, otpHash, "EX", 300);

    // Send OTP via email
    await sentOptMail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};