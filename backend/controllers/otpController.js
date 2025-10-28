import Redis from "ioredis";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {sendOtpMail} from "../helper/mailer.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken";
const redis = new Redis(process.env.REDIS_URL)


export const sendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });
    
    console.log(req.body)

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already registered" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store full data (with hashed OTP)
    const payload = JSON.stringify({
      name,
      email,
      password: hashedPassword,
      otpHash,
    });

    // store by email, expires in 5 min
    await redis.set(`verify:${email}`, payload, "EX", 300);

    // Send email
    await sendOtpMail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
      email, // return for frontend use
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "OTP are required" });

    // Fetch stored user data from Redis
    const data = await redis.get(`verify:${email}`);
    if (!data)
      return res.status(400).json({ error: "OTP expired or invalid" });

    const userData = JSON.parse(data);

    // Hash entered OTP and compare
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== userData.otpHash)
      return res.status(400).json({ error: "Incorrect OTP" });

    // Create user in DB
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    

    // Generate JWT token
const token = jwt.sign(
  { id: newUser._id, email: newUser.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
);

// Clean up Redis
    await redis.del(`verify:${email}`);


    res.json({ message: "User registered successfully", token});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OTP verification failed" });
  }
};
