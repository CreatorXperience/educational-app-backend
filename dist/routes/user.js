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
const lodash_1 = __importDefault(require("lodash"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlePasswordComplexity_1 = __importDefault(require("../utils/user/handlePasswordComplexity"));
const validateUser_1 = __importDefault(require("../utils/user/validateUser"));
const createUser_1 = __importDefault(require("../utils/user/createUser"));
const findUser_1 = __importDefault(require("../utils/user/findUser"));
const verification_email_1 = __importDefault(require("../models/verification-email"));
dotenv_1.default.config();
const router = express_1.default.Router();
const verifyEmailAddress = (email, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.GMAIL_ACC,
            pass: process.env.GMAIL_PASS,
        },
    });
    let otp = Math.floor(1000 + Math.random() * 9000);
    const mailOptions = {
        from: process.env.GMAIL_ACC,
        to: email,
        subject: `Verify Email`,
        text: `Verify your email with this otp:  ${otp} if you didn't request for this otp you can safely ignore it. `,
    };
    transporter.sendMail(mailOptions, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(404).send({ message: err });
        }
        let salt = yield bcryptjs_1.default.genSalt();
        let hashedPassword = yield bcryptjs_1.default.hash(otp.toString(), salt);
        let oneTimeModel = new verification_email_1.default({
            otp: hashedPassword,
            userId: id,
        });
        yield oneTimeModel.save();
    }));
});
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, validateUser_1.default)(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let { error: passwordError } = (0, handlePasswordComplexity_1.default)(req.body.password);
    if (passwordError) {
        return res.status(404).send({ message: passwordError.details[0].message });
    }
    let isUserExist = yield (0, findUser_1.default)({ email: req.body.email });
    if (isUserExist) {
        return res.send({ message: "User already exist" });
    }
    let user = yield (0, createUser_1.default)(req.body);
    if (user) {
        let userPayload = lodash_1.default.pick(user, ["fullname", "email", "_id"]);
        yield verifyEmailAddress(userPayload.email, res, userPayload._id.toHexString());
        return res.send(userPayload);
    }
    res.status(500).send("Internal Server Error");
}));
exports.default = router;
