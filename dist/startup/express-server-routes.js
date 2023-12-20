"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_1 = __importDefault(require("../routes/course"));
const uploads_1 = __importDefault(require("../routes/uploads"));
const user_1 = __importDefault(require("../routes/user"));
const auth_1 = __importDefault(require("../routes/auth"));
const sendmail_1 = __importDefault(require("../routes/sendmail"));
const verify_email_1 = __importDefault(require("../routes/verify-email"));
const error_1 = __importDefault(require("../middleware/error"));
const express_1 = __importDefault(require("express"));
const routesMiddlewares = (app) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/api/courses", course_1.default);
    app.use("/auth/users", user_1.default);
    app.use("/auth/user", auth_1.default);
    app.use("/uploads", uploads_1.default);
    app.use("/send-email", sendmail_1.default);
    app.use("/verify-email", verify_email_1.default);
    app.use(error_1.default);
};
exports.default = routesMiddlewares;
