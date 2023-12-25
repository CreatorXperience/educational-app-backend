"use strict";
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
        searchterm: joi_1.default.string().required()
    });
    return validation.validate(payload);
};
router.post("/", (req, res) => {
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
                        wildcard: "*"
                    }
                }
            }
        }
    ];
    let course = course_model_1.default.aggregate(pipeline, { allowDiskUse: true });
    if (!course) {
        return res.status(404).send({ message: "no course found" });
    }
    res.send(course);
});
exports.default = router;
