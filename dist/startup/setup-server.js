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
const db_1 = require("./db");
const getUri_1 = __importDefault(require("./getUri"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function setupServer(app, port) {
    return __awaiter(this, void 0, void 0, function* () {
        let mongoServer = yield (0, getUri_1.default)(db_1.connectToMongoDB);
        return mongoServer;
    });
}
exports.default = setupServer;
