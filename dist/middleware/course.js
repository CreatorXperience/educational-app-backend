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
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const courseAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = req.header("x-auth-token");
    if (!token) {
        return res
            .status(401)
            .send({ message: "Permisson denied. No token provided" });
    }
    try {
        let userPayload = jsonwebtoken_1.default.verify(token, config_1.default.get("edu-secret-key"));
        req.user = userPayload;
        const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (user === null || user === void 0 ? void 0 : user.admin) {
            console.log("user is an admin");
            return next();
        }
        return res.status(401).send({ message: "unauthorized. user is not admin" });
    }
    catch (e) {
        return res.status(400).send({ message: "Invalid token provided" });
    }
});
exports.default = courseAuth;
