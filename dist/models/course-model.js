"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const authorSchema_1 = __importDefault(require("./authorSchema"));
let courseSchema = new mongoose_1.default.Schema({
    category: { type: String, required: true, minLength: 5, maxLength: 20 },
    author: authorSchema_1.default,
    topic: {
        type: [
            {
                description: { type: String, required: true },
                youtubeId: { type: String, required: true },
                title: { type: String, required: true },
                coverImage: { type: String, required: true },
            },
        ],
        default: [],
        required: true,
    },
    courseDescription: { type: String, required: true, minlength: 15 },
    coverImage: { type: String, required: true },
    coverTitle: { type: String, required: true },
    stars: { type: Number, required: true, min: 0, max: 5 },
});
let CourseModel = mongoose_1.default.model("courses", courseSchema);
exports.default = CourseModel;
