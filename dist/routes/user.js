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
const lodash_1 = __importDefault(require("lodash"));
const handlePasswordComplexity_1 = __importDefault(require("../utils/user/handlePasswordComplexity"));
const validateUser_1 = __importDefault(require("../utils/user/validateUser"));
const createUser_1 = __importDefault(require("../utils/user/createUser"));
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, validateUser_1.default)(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let { error: passwordError } = (0, handlePasswordComplexity_1.default)(req.body.password);
    if (passwordError) {
        return res.status(404).send({ message: passwordError.details[0].message });
    }
    let isUserExist = yield userModel_1.default.find({ email: req.body.email });
    if (isUserExist.length > 0) {
        return res.send({ message: "User already exist" });
    }
    let user = yield (0, createUser_1.default)(req.body);
    if (user) {
        let userPayload = lodash_1.default.pick(user, ["fullname", "email"]);
        return res.send(userPayload);
    }
    res.status(500).send("Internal Server Error");
}));
exports.default = router;
