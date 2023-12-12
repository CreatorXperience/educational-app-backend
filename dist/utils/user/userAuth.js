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
const validateUserAuth_1 = __importDefault(require("./validateUserAuth"));
const findUser_1 = __importDefault(require("./findUser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userAuth = (userPayload, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, validateUserAuth_1.default)(userPayload);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let user = yield (0, findUser_1.default)({ email: userPayload.email });
    if (user) {
        let isPasswordEqual = yield bcryptjs_1.default.compare(userPayload.password, user.password);
        if (isPasswordEqual) {
            let token = user.generateAuthToken();
            return res.header("x-auth-token", token).send("successfully logged in");
        }
        return res.status(401).send({ message: "Invalid login or password" });
    }
    res.status(401).send({ message: "user not exist" });
});
exports.default = userAuth;
