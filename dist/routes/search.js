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
const course_model_1 = __importDefault(require("../models/course-model"));
const router = express_1.default.Router();
const validatePayload = (payload) => {
    const validation = joi_1.default.object({
        searchterm: joi_1.default.string().required(),
    });
    return validation.validate(payload);
};
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { count } = req.query;
    let { error } = validatePayload(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }
    let pipeline = [
        {
            $search: {
                index: "courses-search",
                text: {
                    query: req.body.searchterm,
                    path: {
                        wildcard: "*",
                    },
                    fuzzy: {},
                },
            },
        },
        {
            $skip: Number(count) * 6,
        },
        {
            $limit: 6,
        },
    ];
    let course = yield course_model_1.default.aggregate(pipeline, {
        allowDiskUse: true,
    });
    if (!course) {
        return res.status(404).send({ message: "no course found" });
    }
    res.send(course);
}));
exports.default = router;
