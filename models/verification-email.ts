import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: String,
  createdAt: { type: Date, default: Date.now() },
  expiresAt: { type: Date, default: Date.now() + 3600000 },
  otp: { type: String, required: true, min: 10 },
});

const OtpModel = mongoose.model("otps", otpSchema);

export default OtpModel;
