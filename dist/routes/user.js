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
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
const validateUser = (userPayload) => {
    let userSchema = joi_1.default.object({
        Fullname: joi_1.default.string().min(5).max(50).required(),
        Password: joi_1.default.string().max(500).min(10),
        Email: joi_1.default.string().required().min(5).email(),
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
    let { error: passwordError } = (0, joi_password_complexity_1.default)(passwordOptions).validate(req.body.Password);
    if (passwordError) {
        return res.status(404).send({ message: passwordError.details[0].message });
    }
    let newUser = new userModel_1.default(lodash_1.default.pick(req.body, ["Fullname", "Email", "Password"]));
    let user = yield newUser.save();
    if (user) {
        return res.send(user);
    }
    res.status(500).send("Internal Server Error");
}));
exports.default = router;
