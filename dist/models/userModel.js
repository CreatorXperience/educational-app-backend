"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let userSchema = new mongoose_1.default.Schema({
    Email: {
        type: String,
        unique: true,
        required: true,
        maxLength: 50,
    },
    Password: { type: String, maxLength: 500, min: 10, required: true },
    Fullname: { type: String, minLength: 5, maxLength: 50, required: true },
});
let UserModel = mongoose_1.default.model("users", userSchema);
exports.default = UserModel;
