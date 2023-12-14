"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winstonErrorhandler = () => {
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
};
exports.default = winstonErrorhandler;
