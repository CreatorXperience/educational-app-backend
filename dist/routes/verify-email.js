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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const verification_email_1 = __importDefault(require("../models/verification-email"));
const Router = express_1.default.Router();
const validateReqPayload = (payload) => {
    const payloadSchema = joi_1.default.object({
        otp: joi_1.default.string().required().max(4).min(4),
        id: joi_1.default.string().required(),
    });
    return payloadSchema.validate(payload);
};
Router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validateReqPayload(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let { otp, id } = req.body;
    if (!mongoose_1.default.isValidObjectId(id))
        return res.status(404).send({ message: "Invalid course id" });
    let userOtpPayloads = yield verification_email_1.default.find({ userId: id });
    if (userOtpPayloads.length > 0) {
        return userOtpPayloads.forEach((otpPayload) => __awaiter(void 0, void 0, void 0, function* () {
            if (!otpPayload) {
                return res.send("Otp not found");
            }
            let currentTime = new Date(Date.now());
            let expiryDate = new Date(otpPayload.expiresAt);
            if (currentTime > expiryDate) {
                return res.send("Otp already expires");
            }
            let isEqual = yield bcryptjs_1.default.compare(otp, otpPayload.otp);
            if (isEqual) {
                let user = yield userModel_1.default.findByIdAndUpdate(id, {
                    $set: { verified: true },
                });
                if (user) {
                    yield user.save();
                    return res.send({ message: "email verified successfully" });
                }
                return res.send(404).send({ message: "user not found" });
            }
            return res.status(404).send("invalid otp");
        }));
    }
    return res.status(404).send({ message: "invalid id or otp" });
}));
exports.default = Router;
