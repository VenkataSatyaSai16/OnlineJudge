import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST.trim(),
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user: process.env.SMTP_USER.trim(),
      pass: process.env.SMTP_PASS.replace(/\s/g, ""),
    },
  });
};

export const sendVerificationEmail = async (to, otp) => {
  const transporter = createTransporter();

  if (!transporter) {
    return {
      sent: false,
      reason: "SMTP_NOT_CONFIGURED",
    };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM?.trim() || process.env.SMTP_USER.trim(),
    to,
    subject: "Verify your Online Judge email",
    text: `Your verification OTP is ${otp}. It expires in 10 minutes.`,
  });

  return {
    sent: true,
  };
};
