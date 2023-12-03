"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const courseAuth = (req, res, next) => {
    let token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).send({ message: "Permisson denied. Invalid token" });
    }
    try {
        let userPayload = jsonwebtoken_1.default.verify(token, config_1.default.get("edu-secret-key"));
        req.user = userPayload;
        next();
        return;
    }
    catch (e) {
        return res.status(400).send({ message: "Invalid token provided" });
    }
};
exports.default = courseAuth;
