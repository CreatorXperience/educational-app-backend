"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../../../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
test("expect a pass", () => {
    const newUser = new userModel_1.default({
        _id: new mongoose_1.default.Types.ObjectId().toHexString(),
        firstname: "Habeeb",
        lastname: "Muhydeen",
        password: "1234567890%Ab",
        isAdmin: true,
    });
    const token = newUser.generateAuthToken();
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get("edu-secret-key"));
    expect(decoded).toMatchObject({
        _id: new mongoose_1.default.Types.ObjectId(newUser._id).toHexString(),
    });
});
