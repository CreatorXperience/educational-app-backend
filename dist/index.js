"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const example_1 = __importDefault(require("./routes/example"));
const winston_1 = __importDefault(require("winston"));
const setup_server_1 = __importDefault(require("./startup/setup-server"));
const course_1 = __importDefault(require("./routes/course"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const error_1 = __importDefault(require("./middleware/error"));
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT;
let mongoServer;
const exceptionHandler = winston_1.default.createLogger({
    transports: [new winston_1.default.transports.File({ filename: "combined.log" })],
    exceptionHandlers: [
        new winston_1.default.transports.File({ filename: "exceptions.log" }),
    ],
});
const rejectionHandler = winston_1.default.createLogger({
    level: "info",
    rejectionHandlers: [
        new winston_1.default.transports.File({ filename: "rejection.log" }),
    ],
});
(0, setup_server_1.default)(app, port).then((server) => {
    exports.mongoServer = mongoServer = server;
});
if (!process.env.EDU_KEY) {
    process.exit(1);
}
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`it has been connected to port ${port}`);
    });
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/courses", course_1.default);
app.use("/auth/users", user_1.default);
app.use("/auth/user", auth_1.default);
app.use("/examples", example_1.default);
app.use(error_1.default);
