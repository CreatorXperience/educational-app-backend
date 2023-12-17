"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validateCourse = (course) => {
    let courseSchema = joi_1.default.object({
        category: joi_1.default.string().required(),
        author: joi_1.default.object({
            name: joi_1.default.string().required(),
            post: joi_1.default.string().required(),
            bio: joi_1.default.string().required(),
        }),
        topic: joi_1.default.array().items(joi_1.default.object({
            description: joi_1.default.string().required(),
            youtubeId: joi_1.default.string().required(),
            title: joi_1.default.string().required(),
            coverImage: joi_1.default.string().required(),
        })),
        courseDescription: joi_1.default.string().required().min(15),
        coverImage: joi_1.default.string().required(),
        coverTitle: joi_1.default.string().required(),
        stars: joi_1.default.number().required().min(0).max(5),
        image: joi_1.default.object({
            filename: joi_1.default.string().required(),
            contentType: joi_1.default.string().required(),
        }),
    });
    return courseSchema.validate(course);
};
exports.default = validateCourse;
