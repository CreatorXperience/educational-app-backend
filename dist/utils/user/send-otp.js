"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const verification_email_1 = __importDefault(require("../../models/verification-email"));
const nodemailer_transport_1 = __importDefault(require("./nodemailer-transport"));
const sendOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = (0, nodemailer_transport_1.default)();
    let otp = Math.floor(1000 + Math.random() * 9000);
    const mailOptions = {
        from: process.env.GMAIL_ACC,
        to: payload.email,
        subject: `Verify Email`,
        text: `Verify your email with this otp:  ${otp} if you didn't request for this otp you can safely ignore it. `,
    };
    transporter.sendMail(mailOptions, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return payload.res.status(404).send({ message: err });
        }
        let salt = yield bcryptjs_1.default.genSalt();
        let hashedPassword = yield bcryptjs_1.default.hash(otp.toString(), salt);
        let oneTimeModel = new verification_email_1.default({
            otp: hashedPassword,
            userId: payload.id,
        });
        yield oneTimeModel.save();
    }));
});
exports.default = sendOtp;
