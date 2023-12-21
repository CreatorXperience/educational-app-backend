"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    userId: String,
    createdAt: { type: Date, default: Date.now() },
    expiresAt: { type: Date, default: Date.now() + 3600000 },
    otp: { type: String, required: true, min: 10 },
});
const OtpModel = mongoose_1.default.model("otps", otpSchema);
exports.default = OtpModel;
