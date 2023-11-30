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
const userModel_1 = __importDefault(require("../models/userModel"));
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
const lodash_1 = __importDefault(require("lodash"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
const validateUser = (userPayload) => {
    let userSchema = joi_1.default.object({
        fullname: joi_1.default.string().min(5).max(50).required(),
        password: joi_1.default.string().max(500).min(10),
        email: joi_1.default.string().required().min(5).email(),
    });
    return userSchema.validate(userPayload);
};
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = validateUser(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let passwordOptions = {
        min: 10,
        max: 500,
        symbol: 1,
        numeric: 1,
        upperCase: 1,
        lowerCase: 1,
    };
    let { error: passwordError } = (0, joi_password_complexity_1.default)(passwordOptions).validate(req.body.password);
    if (passwordError) {
        return res.status(404).send({ message: passwordError.details[0].message });
    }
    let isUserExist = yield userModel_1.default.find({ email: req.body.email });
    if (isUserExist.length > 0) {
        return res.send({ message: "User already exist" });
    }
    let newUser = new userModel_1.default(lodash_1.default.pick(req.body, ["fullname", "email", "password"]));
    let salt = yield bcryptjs_1.default.genSalt(10);
    let passwordHash = yield bcryptjs_1.default.hash(newUser.password, salt);
    newUser.password = passwordHash;
    let user = yield newUser.save();
    if (user) {
        let userPayload = lodash_1.default.pick(user, ["fullname", "email"]);
        return res.send(userPayload);
    }
    res.status(500).send("Internal Server Error");
}));
exports.default = router;
