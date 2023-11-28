"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let authorSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    post: { type: String, required: true },
    bio: { type: String, required: true, minLength: 30, maxlength: 1000 },
});
exports.default = authorSchema;
