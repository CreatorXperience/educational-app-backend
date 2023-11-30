"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
let userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        maxLength: 50,
    },
    password: { type: String, maxLength: 500, min: 10, required: true },
    fullname: { type: String, minLength: 5, maxLength: 50, required: true },
}, {
    methods: {
        generateAuthToken() {
            let token = jsonwebtoken_1.default.sign({ _id: this._id }, config_1.default.get("edu-secret-key"));
            return token;
        },
    },
});
let UserModel = mongoose_1.default.model("users", userSchema);
exports.default = UserModel;
