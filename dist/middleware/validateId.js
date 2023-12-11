"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validateId = (req, res, next) => {
    let { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(404).send({ message: "Invalid object id" });
    }
    next();
};
exports.default = validateId;
