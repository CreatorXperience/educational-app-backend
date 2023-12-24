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
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const handlePasswordComplexity_1 = __importDefault(require("../utils/user/handlePasswordComplexity"));
const Router = express_1.default.Router();
const validatePayload = (payload) => {
    let payloadValidation = joi_1.default.object({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string(),
    });
    return payloadValidation.validate(payload);
};
Router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = validatePayload(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let { error: err } = (0, handlePasswordComplexity_1.default)(req.body.password);
    if (err) {
        return res.status(404).send({ message: err.details[0].message });
    }
    let session = yield mongoose_1.default.startSession();
    yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
        let user = yield userModel_1.default.find({ email: req.body.email });
        if (!user) {
            res
                .status(404)
                .send({ message: "User with the specified email does not exist" });
            return session.abortTransaction();
        }
        let salt = yield bcryptjs_1.default.genSalt(10);
        let hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
        yield userModel_1.default.updateOne({ email: req.body.email }, { $set: { password: hashedPassword } });
        res.send("password changed successfully");
        session.commitTransaction();
    }));
}));
exports.default = Router;
