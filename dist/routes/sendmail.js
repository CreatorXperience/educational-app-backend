"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
Router.post("/", (req, res) => {
    const { subject, recipient } = req.body;
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.GMAIL_ACC,
            pass: process.env.GMAIL_PASS,
        },
    });
    const mailOption = {
        from: process.env.GMAIL_ACC,
        to: recipient,
        subject,
        text: "Hello This is just for testing purposes",
    };
    transporter.sendMail(mailOption, function (err, data) {
        if (err) {
            return res.status(404).send({ message: "error sending email", e: err });
        }
        res.send("email sent successfully");
    });
});
exports.default = Router;
