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
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const lodash_1 = __importDefault(require("lodash"));
const createUser = (userPayload) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser = new userModel_1.default(lodash_1.default.pick(userPayload, ["fullname", "email", "password"]));
    let salt = yield bcryptjs_1.default.genSalt(10);
    let passwordHash = yield bcryptjs_1.default.hash(newUser.password, salt);
    newUser.password = passwordHash;
    let user = yield newUser.save();
    return user;
});
exports.default = createUser;
