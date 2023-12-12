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
const winston_1 = __importDefault(require("winston"));
const setup_server_1 = __importDefault(require("./startup/setup-server"));
const express_server_routes_1 = __importDefault(require("./startup/express-server-routes"));
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
    // throw new Error("No key provided");
    process.exit(1);
}
(0, express_server_routes_1.default)(app);
