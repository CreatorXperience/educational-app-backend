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
const mongoose_1 = __importDefault(require("mongoose"));
const course_model_1 = __importDefault(require("../models/course-model"));
const winston = require("winston");
const migrateErrorLogger = winston.createLogger({
    level: "info",
    exceptionHandlers: [
        new winston.transports.File({ filename: "migration.log" }),
    ],
});
const URI = process.env.URI;
const updateCourseSchema = () => {
    mongoose_1.default
        .connect(URI)
        .then(() => {
        console.log("connected to mongoDb Database Successfully from migration file");
    })
        .then(() => {
        migrateUp();
    })
        .catch(() => {
        console.log("error occured while connecting to database from migration file");
    });
};
const migrateUp = () => __awaiter(void 0, void 0, void 0, function* () {
    let courses = yield course_model_1.default.find({ image: { $exists: false } });
    let imagePayload = {
        filename: "",
        contentType: "",
    };
    courses.forEach((course) => __awaiter(void 0, void 0, void 0, function* () {
        course.image = imagePayload;
        yield course.save();
    }));
});
const migrateDown = () => __awaiter(void 0, void 0, void 0, function* () {
    let courses = yield course_model_1.default.updateMany({ image: { $exists: true } }, { $unset: { image: "" } });
});
updateCourseSchema();
