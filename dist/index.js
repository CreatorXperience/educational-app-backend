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
exports.mongoServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const setup_server_1 = __importDefault(require("./startup/setup-server"));
const express_server_routes_1 = __importDefault(require("./startup/express-server-routes"));
const winston_handler_1 = __importDefault(require("./startup/winston-handler"));
const course_model_1 = __importDefault(require("./models/course-model"));
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 3030;
(0, winston_handler_1.default)();
let mongoServer;
(0, setup_server_1.default)(port).then((server) => {
    exports.mongoServer = mongoServer = server;
});
if (!process.env.EDU_KEY) {
    process.exit(1);
}
(0, express_server_routes_1.default)(app);
app.get("/", (req, res) => {
    res.send("<h1>Welcome to this API </h1>");
});
app.get("/findcourse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pipeline = [{ $search: {
                index: "courses-search",
                text: {
                    query: "Python",
                    path: {
                        wildcard: "*"
                    }
                }
            } }];
    let courses = yield course_model_1.default.aggregate(pipeline, { allowDiskUse: true });
    if (!courses) {
        return res.status(404).send("couldn't find course");
    }
    res.send(courses);
}));
