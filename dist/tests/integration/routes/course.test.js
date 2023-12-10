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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../../index");
const mongoose_1 = __importDefault(require("mongoose"));
const Insert_1 = __importDefault(require("../../../utils/course/testsUtils/Insert"));
const coursePayload = {
    author: {
        name: "Adam Smith",
        post: "Python Developer",
        bio: "Created a ongodb database with som small data init. ain't she beautiful init",
    },
    category: "Python",
    topic: [
        {
            description: "Learn the basics of Python for finance and algorithmic trading. This course will teach you the fundamentals of Python programming and its applications in finance.",
            title: "Introduction to Python for Finance",
            youtubeId: "https://www.youtube.com/watch?v=abcdef12345",
            coverImage: "my Image is on it way",
        },
        {
            description: "Learn how to use Python for financial analysis and algorithmic trading. This course will teach you the fundamentals of Python programming and its applications in finance.",
            title: "Python for Financial Analysis",
            youtubeId: "https://www.youtube.com/watch?v=abcdef12345",
            coverImage: "my Image is on it way",
        },
        {
            description: "Learn how to use Python for algorithmic trading. This course will teach you the fundamentals of Python programming and its applications in finance.",
            title: "Python for Algorithmic Trading",
            youtubeId: "https://www.youtube.com/watch?v=abcdef12345",
            coverImage: "my Image is on it way",
        },
    ],
    courseDescription: "This comprehensive course covers Python's applications in financial analysis and algorithmic trading. Learn data analysis, statistical modeling, and trading strategies in Python.",
    coverImage: "https://i.pinimg.com/564x/34/01/ee/3401ee2dbb27776d850e77c6a2bee3d2.jpg",
    coverTitle: "Python for Financial Analysis Next and Algorithmic Trading",
    stars: 3,
};
let courseId;
describe("/api/courses", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, Insert_1.default)(coursePayload);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield index_1.mongoServer.stop();
    }));
    describe("GET /", () => {
        test("should retrieve all courses in the DB", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).get("/api/courses");
            courseId = response.body[0]._id;
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body.some((res) => res.author.name === "Adam Smith")).toBeTruthy();
        }));
    });
    describe("Get /:id", () => {
        test("should retrieve course with a given id", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).get(`/api/courses/${courseId}`);
            expect(response.status).toBe(200);
            console.log(response.body);
            expect(response.body).toHaveProperty("_id", courseId);
        }));
        test("should return 404 if passed with invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            let invalidId = "123";
            const response = yield (0, supertest_1.default)(index_1.app).get(`/api/courses/${123}`);
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ message: "Invalid object id" });
        }));
        test("should return 404 if passed with a valid id but with data associated with the id in our database", () => __awaiter(void 0, void 0, void 0, function* () {
            let invalidId = "65751bi3193a16af55ab7626";
            const response = yield (0, supertest_1.default)(index_1.app).get(`/api/courses/${123}`);
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: "Invalid object id",
            });
            // expect(response.body).toHaveProperty("message", courseId);
        }));
    });
});
