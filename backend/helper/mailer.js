import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER 
const EMAIL_PASS = process.env.EMAIL_PASS 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  }
});

export const sendOtpMail = async (to, otp) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Email credentials are not configured. Cannot send mail.');
  }

  await transporter.sendMail({
    from: `"Auth System" <${EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  });
};
