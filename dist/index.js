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
const config_1 = __importDefault(require("config"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
dotenv_1.default.config();
const db_1 = require("./startup/db");
const course_1 = __importDefault(require("./routes/course"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT;
let mongoServer;
const mockServerURI = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.mongoServer = mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    return mongoUri;
});
const getUri = (connect) => __awaiter(void 0, void 0, void 0, function* () {
    let uri = process.env.NODE_ENV === "test"
        ? yield mockServerURI()
        : process.env.URI;
    connect(uri);
});
getUri(db_1.connectToMongoDB);
if (process.env.NODE_ENV !== "test") {
    const server = app.listen(port, () => {
        console.log(`it has been connected to port ${port}`);
    });
}
if (!config_1.default.get("edu-secret-key")) {
    // throw new Error("No key provided");
    process.exit(1);
}
app.use(express_1.default.json());
app.use("/api/courses", course_1.default);
app.use("/auth/users", user_1.default);
app.use("/auth/user", auth_1.default);
