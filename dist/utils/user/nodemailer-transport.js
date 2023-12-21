"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailTransport = () => {
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.GMAIL_ACC,
            pass: process.env.GMAIL_PASS,
        },
    });
    return transporter;
};
exports.default = mailTransport;
