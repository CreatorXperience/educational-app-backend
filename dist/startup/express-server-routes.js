"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_1 = __importDefault(require("../routes/course"));
const user_1 = __importDefault(require("../routes/user"));
const auth_1 = __importDefault(require("../routes/auth"));
const error_1 = __importDefault(require("../middleware/error"));
const routesMiddlewares = (app) => {
    app.use("/api/courses", course_1.default);
    app.use("/auth/users", user_1.default);
    app.use("/auth/user", auth_1.default);
    app.use(error_1.default);
};
exports.default = routesMiddlewares;
