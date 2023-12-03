"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validateUser = (userPayload) => {
    let userSchema = joi_1.default.object({
        fullname: joi_1.default.string().min(5).max(50).required(),
        password: joi_1.default.string().max(500).min(10),
        email: joi_1.default.string().required().min(5).email(),
    });
    return userSchema.validate(userPayload);
};
exports.default = validateUser;
