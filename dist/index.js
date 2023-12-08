"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
// import dotenv from "dotenv";
// dotenv.config();
const db_1 = require("./startup/db");
const course_1 = __importDefault(require("./routes/course"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const port = config_1.default.get("port");
(0, db_1.connectToMongoDB)();
app.listen(port, () => {
    console.log(`it has been connected to port ${port}`);
});
if (!config_1.default.get("edu-secret-key")) {
    // throw new Error("No key provided");
    process.exit(1);
}
app.use(express_1.default.json());
app.use("/api/courses", course_1.default);
app.use("/auth/users", user_1.default);
app.use("/auth/user", auth_1.default);
app.get("/", (req, res) => {
    res.send("Hello world");
});
