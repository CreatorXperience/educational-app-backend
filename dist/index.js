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
const setup_server_1 = __importDefault(require("./startup/setup-server"));
const express_server_routes_1 = __importDefault(require("./startup/express-server-routes"));
const winston_handler_1 = __importDefault(require("./startup/winston-handler"));
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT;
(0, winston_handler_1.default)();
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
(0, express_server_routes_1.default)(app);
