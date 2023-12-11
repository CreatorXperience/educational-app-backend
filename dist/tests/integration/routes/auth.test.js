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
const __1 = require("../../..");
const createUser_1 = __importDefault(require("../../../utils/user/createUser"));
const supertest_1 = __importDefault(require("supertest"));
const lodash_1 = __importDefault(require("lodash"));
const coursePayload_1 = __importDefault(require("../test-payload/coursePayload"));
let userPayload = {
    email: "user1@gmail.com",
    fullname: "kelvin patrick",
    password: "12345t672As",
    admin: true,
};
describe("/auth/user", () => {
    let token;
    const registerUser = () => __awaiter(void 0, void 0, void 0, function* () {
        let user = (0, createUser_1.default)(userPayload);
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.mongoServer.stop();
    }));
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield registerUser();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.app)
            .post("/auth/user")
            .send(lodash_1.default.pick(userPayload, ["email", "password"]));
        token = response.header["x-auth-token"];
    }));
    describe("POST /auth/user", () => {
        test("should return 401 error if no token provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app)
                .post("/api/courses")
                .send(coursePayload_1.default);
            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/permission denied./i);
        }));
        test("should return 401 response status if token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            let invalidToken = "1234";
            let response = yield (0, supertest_1.default)(__1.app)
                .post("/api/courses")
                .set("x-auth-token", invalidToken)
                .send(coursePayload_1.default);
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/invalid token provided/i);
        }));
        test("should return 200 response status if token is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app)
                .post("/api/courses")
                .set("x-auth-token", token)
                .send(coursePayload_1.default);
            expect(response.status).toBe(200);
        }));
        describe("POST /admin", () => {
            let newUserPayload = {
                email: "tester@gmail.com",
                fullname: "test user",
                password: "12345t672As",
            };
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                let user = (0, createUser_1.default)(newUserPayload);
                const response = yield (0, supertest_1.default)(__1.app)
                    .post("/auth/user")
                    .send(lodash_1.default.pick(newUserPayload, ["email", "password"]));
                token = response.header["x-auth-token"];
            }));
            test("should  return 401 response if user is not an admin", () => { });
        });
    });
});
