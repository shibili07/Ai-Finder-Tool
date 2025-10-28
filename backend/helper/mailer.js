import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
     service: "gmail", // or "outlook", "yahoo" etc.
     host:"smtp.gmail.com",
     secure:true,
     auth: {
       user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
     },
})

export const sentOptMail = async (to, otp)=>{
    await transporter.sendMail({
         from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    })
}