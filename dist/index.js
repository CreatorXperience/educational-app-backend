"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const course_1 = __importDefault(require("./routes/course"));
const db_1 = require("./startup/db");
const app = (0, express_1.default)();
const port = process.env.PORT;
(0, db_1.connectToMongoDB)();
app.listen(port, () => {
    console.log(`it has been connected to port ${port}`);
});
app.use(express_1.default.json());
app.use("/api/courses", course_1.default);
app.get("/", (req, res) => {
    res.send("Hello world");
});
