import bcrypt from "bcryptjs";

const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 1 * 60 * 1000;

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOtp = async (otp) => {
  return bcrypt.hash(String(otp).trim(), 10);
};

export const verifyOtpHash = async (otp, otpHash) => {
  if (!otp || !otpHash) return false;
  return bcrypt.compare(String(otp).trim(), otpHash);
};

export const getOtpExpiry = () => {
  return new Date(Date.now() + OTP_TTL_MS);
};

export const isOtpExpired = (expiresAt) => {
  return !expiresAt || new Date(expiresAt).getTime() < Date.now();
};

export const getOtpCooldownRemaining = (lastSentAt) => {
  if (!lastSentAt) return 0;

  const elapsed = Date.now() - new Date(lastSentAt).getTime();
  return Math.max(0, OTP_RESEND_COOLDOWN_MS - elapsed);
};
