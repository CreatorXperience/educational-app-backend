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
const express_1 = require("express");
const course_model_1 = __importDefault(require("../models/course-model"));
const validateCourse_1 = __importDefault(require("../utils/course/validateCourse"));
const validateUpdateCourse_1 = __importDefault(require("../utils/course/validateUpdateCourse"));
const createCourse_1 = __importDefault(require("../utils/course/createCourse"));
const courseAuth_1 = __importDefault(require("../middleware/courseAuth"));
const validateId_1 = __importDefault(require("../middleware/validateId"));
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const countValidation = (countPayload) => {
    const count = joi_1.default.object({
        count: joi_1.default.string().required(),
    });
    return count.validate(countPayload);
};
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let count = { count: req.query.count };
    const { error } = countValidation(count);
    if (!error) {
        const limit = 20;
        let courses = yield course_model_1.default.find()
            .skip(Number(req.query.count) * limit)
            .limit(limit);
        if (courses) {
            return res.send(courses);
        }
        return res.status(404).send({ message: "course not found" });
    }
    return res.status(404).send({ message: error.details[0].message });
}));
router.get("/:id", validateId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield course_model_1.default.findById(req.params.id);
    if (!course) {
        return res
            .status(404)
            .send({ message: "The course with the specified ID doesn't exist" });
    }
    res.send(course);
}));
router.post("/", [courseAuth_1.default], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let file = req.file;
    console.log(file);
    let { error } = (0, validateCourse_1.default)(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    return (0, createCourse_1.default)(req.body, res);
}));
router.put("/:id", [courseAuth_1.default, validateId_1.default], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { error } = (0, validateUpdateCourse_1.default)(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let course = yield course_model_1.default.updateOne({ _id: id }, {
        $set: Object.assign({}, req.body),
    });
    if (!course) {
        return res.status(404).send("Course with the given id does not exist");
    }
    return res.send(course);
}));
router.delete("/:id", [courseAuth_1.default, validateId_1.default], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let course = yield course_model_1.default.findByIdAndDelete(id);
    if (!course) {
        return res.status(404).send({ message: "course not found" });
    }
    res.send(course);
}));
exports.default = router;
