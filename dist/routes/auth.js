"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAuth_1 = __importDefault(require("../utils/user/userAuth"));
const router = (0, express_1.Router)();
router.post("/", (req, res) => {
    (0, userAuth_1.default)(req.body, res);
});
exports.default = router;
