"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let fileSchema = new mongoose_1.default.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    length: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
let FileModel = mongoose_1.default.model("courses-image", fileSchema);
exports.default = FileModel;
