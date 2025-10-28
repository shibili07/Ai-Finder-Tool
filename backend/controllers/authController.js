import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// ✅ Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    console.log(req.body)
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
     
    });
    
    res.status(201).json({ message: "User created. Verify OTP to activate." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
  