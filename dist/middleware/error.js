"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const error = (err, req, res, next) => {
    const errLogger = winston_1.default.createLogger({
        level: "info",
        transports: [
            new winston_1.default.transports.File({
                filename: "errorLogger.log",
            }),
        ],
    });
    errLogger.error("error:", err);
};
exports.default = error;
