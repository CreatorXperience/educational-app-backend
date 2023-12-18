"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const setup_server_1 = __importDefault(require("./startup/setup-server"));
const express_server_routes_1 = __importDefault(require("./startup/express-server-routes"));
const winston_handler_1 = __importDefault(require("./startup/winston-handler"));
const app = (0, express_1.default)();
exports.app = app;
app.set("view engine", "ejs");
const port = process.env.PORT;
(0, winston_handler_1.default)();
let connection = mongoose_1.default.connection;
let mongoServer;
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
app.get("/", (req, res) => {
    res.render("index");
});
console.log("connection is open");
connection.on("open", () => {
    let bucket = new mongoose_1.default.mongo.GridFSBucket(connection.db);
    // app.post(
    //   "/api/courses",
    //   [courseAuth, upload.single("file")],
    //   async (req: Request, res: Response) => {
    //     let file = req.file;
    //     // @ts-ignore
    //     let {fieldname, originalname,mimetype, buffer} = file as File
    //     let coursePayload = {
    //       ...req.body,
    //       image: fieldname, originalname, mimetype, buffer
    //     }
    //     let { error } = validateCourse(coursePayload);
    //     if (error) {
    //       return res.status(404).send({ message: error.details[0].message });
    //     }
    //     return createCourse(coursePayload, res);
    //   }
    // );
});
(0, express_server_routes_1.default)(app);
