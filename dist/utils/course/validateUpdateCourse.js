"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validateUpdateCoursePayload = (course) => {
    let courseSchema = joi_1.default.object({
        category: joi_1.default.string(),
        author: joi_1.default.object({
            name: joi_1.default.string(),
            post: joi_1.default.string(),
            bio: joi_1.default.string(),
        }),
        topic: joi_1.default.array().items(joi_1.default.object({
            description: joi_1.default.string(),
            youtubeId: joi_1.default.string(),
            title: joi_1.default.string(),
            coverImage: joi_1.default.string(),
        })),
        courseDescription: joi_1.default.string().min(15),
        coverImage: joi_1.default.string(),
        coverTitle: joi_1.default.string(),
        stars: joi_1.default.number().min(0).max(5),
    });
    return courseSchema.validate(course);
};
exports.default = validateUpdateCoursePayload;
