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
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const winston_1 = __importDefault(require("winston"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const migrateErrorLogger = winston_1.default.createLogger({
    level: "info",
    exceptionHandlers: [
        new winston_1.default.transports.File({ filename: "migration.log" }),
    ],
});
const URI = process.env.URI;
console.log(URI);
const updateCourseSchema = () => {
    mongoose_1.default
        .connect(URI)
        .then(() => {
        console.log("connected to mongoDb Database Successfully from migration file");
    })
        .then(() => {
        migrateUp();
    })
        .catch(() => {
        console.log("error occured while connecting to database from migration file");
    });
};
const migrateUp = () => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield userModel_1.default.find({ verified: { $exists: false } });
    if (users) {
        return users.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            user.verified = "false";
            yield user.save();
        }));
    }
    return;
});
const migrateDown = () => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield userModel_1.default.updateMany({ verified: { $exists: true } }, { $unset: { verified: "" } });
});
updateCourseSchema();
