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
const joi_1 = __importDefault(require("joi"));
const send_password_1 = __importDefault(require("../utils/user/send-password"));
const userModel_1 = __importDefault(require("../models/userModel"));
const Router = express_1.default.Router();
const forgotPasswordValidation = (payload) => {
    const forgotPassword = joi_1.default.object({
        email: joi_1.default.string().required().email(),
        id: joi_1.default.string().required(),
    });
    return forgotPassword.validate(payload);
};
Router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = forgotPasswordValidation(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    const { email, id } = req.body;
    const user = yield userModel_1.default.findById(id);
    if (!user) {
        return res.status(404).send({ message: "user not found" });
    }
    yield (0, send_password_1.default)({ email, res, id });
}));
exports.default = Router;
