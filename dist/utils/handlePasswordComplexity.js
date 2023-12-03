"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
const complexPassword = (userPass, options) => {
    if (options) {
        return (0, joi_password_complexity_1.default)(options).validate(userPass);
    }
    let passwordOptions = {
        min: 10,
        max: 500,
        symbol: 1,
        numeric: 1,
        upperCase: 1,
        lowerCase: 1,
    };
    return (0, joi_password_complexity_1.default)(passwordOptions).validate(userPass);
};
exports.default = complexPassword;
