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
const createUser_1 = __importDefault(require("../../../utils/user/createUser"));
const lodash_1 = __importDefault(require("lodash"));
const coursePayload_1 = __importDefault(require("../test-payload/coursePayload"));
let courseId;
const createNewUserAndLogin = (userPayload) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, createUser_1.default)(userPayload);
    const res = yield (0, supertest_1.default)(index_1.app)
        .post("/auth/user")
        .send(lodash_1.default.pick(userPayload, ["email", "password"]));
    let token = res.header["x-auth-token"];
    return { res, token };
});
describe("/api/courses", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, Insert_1.default)(coursePayload_1.default);
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
            expect(response.body).toHaveProperty("_id", courseId);
        }));
        test("should return 404 if passed with invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            let invalidId = "123";
            const response = yield (0, supertest_1.default)(index_1.app).get(`/api/courses/${123}`);
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ message: "Invalid object id" });
        }));
        test("should return 404 error if request a a valid id but with no data associated with the id in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            let validData = "6565fdee473fa8c1a4b29503";
            const response = yield (0, supertest_1.default)(index_1.app).get(`/api/courses/${validData}`);
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: "The course with the specified ID doesn't exist",
            });
        }));
    });
    describe("POST /api/courses", () => {
        test("should return a 401 error if user is not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app)
                .post("/api/courses")
                .send({ name: "hi" });
            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/no token provided/i);
        }));
        test("should return a 401 error if user is logged in but not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            let userPayload = {
                fullname: "Habeeb Ayinde Alabi",
                email: "thebigboy@gmail.com",
                password: "12345678@Ab",
            };
            let { res, token } = yield createNewUserAndLogin(userPayload);
            expect(res.status).toBe(200);
            const response = yield (0, supertest_1.default)(index_1.app)
                .post("/api/courses")
                .send(coursePayload_1.default)
                .set("x-auth-token", token);
            expect(response.status).toBe(401);
            // expect(response.body.message).toBe()
        }));
        describe("Admin POST to /api/course", () => {
            let res, token;
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                let userPayload = {
                    fullname: "Habeeb Ayinde Alabi",
                    email: "testUser@gmail.com",
                    password: "12345678@Ab",
                    admin: true,
                };
                let { res: Res, token: Token } = yield createNewUserAndLogin(userPayload);
                res = Res;
                token = Token;
            }));
            test("should return a 404 error if user is logged in and an admin but invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(index_1.app)
                    .post("/api/courses")
                    .send({ name: "test" })
                    .set("x-auth-token", token);
                expect(response.body.message).toMatch(/[^. is required]/i);
                expect(response.status).toBe(404);
            }));
            test("should return a 200 success status if user is logged in and an admin with the valid payload", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(index_1.app)
                    .post("/api/courses")
                    .send(coursePayload_1.default)
                    .set("x-auth-token", token);
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty("author");
            }));
        });
        describe("PUT /api/courses", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { }));
            const createNewUserAndUpdateCourse = (payload, id = courseId) => __awaiter(void 0, void 0, void 0, function* () {
                let { token } = yield createNewUserAndLogin(payload);
                let response = yield (0, supertest_1.default)(index_1.app)
                    .put(`/api/courses/${id}`)
                    .send({
                    category: "Anaconda",
                })
                    .set("x-auth-token", token);
                return { response };
            });
            test("PUT /api/courses/:id should return 401 if user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
                let userPayload = {
                    fullname: "tester",
                    password: "12345678As@",
                    email: "tester000@gmail.com",
                };
                const { response } = yield createNewUserAndUpdateCourse(userPayload);
                expect(response.status).toBe(401);
                expect(response.body.message).toMatch(/not admin/i);
            }));
            test("PUT /api/courses/:id return 200 if user is an admin", () => __awaiter(void 0, void 0, void 0, function* () {
                let userPayload = {
                    fullname: "tester",
                    password: "12345678As@",
                    email: "tester689@gmail.com",
                    admin: true,
                };
                const { response } = yield createNewUserAndUpdateCourse(userPayload);
                expect(response.status).toBe(200);
                expect(response.body.modifiedCount).toBe(1);
            }));
            test("PUT /api/courses/:id return 404  is is not a valid object id", () => __awaiter(void 0, void 0, void 0, function* () {
                let userPayload = {
                    fullname: "tester",
                    password: "12345678As@",
                    email: "tester878@gmail.com",
                    admin: true,
                };
                let invalidCourseId = "a234dv4446s0k08989c";
                const { response } = yield createNewUserAndUpdateCourse(userPayload, invalidCourseId);
                expect(response.status).toBe(404);
                expect(response.body.message).toMatch(/invalid object id/i);
            }));
            test("PUT /api/courses/:id return 404  error if course payload is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
                let userPayload = {
                    fullname: "tester",
                    password: "12345678As@",
                    email: "tester999@gmail.com",
                    admin: true,
                };
                let { token } = yield createNewUserAndLogin(userPayload);
                let response = yield (0, supertest_1.default)(index_1.app)
                    .put(`/api/courses/${courseId}`)
                    .send({
                    invalidPayload: "Anaconda",
                })
                    .set("x-auth-token", token);
                expect(response.status).toBe(404);
                expect(response.body.message).toMatch(/invalidPayload/i);
            }));
        });
        describe("DELETE /api/courses/:id", () => {
            let userToken;
            let courseId;
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                let userPayload = {
                    fullname: "tester",
                    password: "12345678As@",
                    email: "testerone@gmail.com",
                    admin: true,
                };
                let { token } = yield createNewUserAndLogin(userPayload);
                userToken = token;
            }));
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                let response = yield (0, supertest_1.default)(index_1.app)
                    .post("/api/courses")
                    .send(coursePayload_1.default)
                    .set("x-auth-token", userToken);
                courseId = response.body._id;
            }));
            test("DELETE /api/courses/:id should delete a course with a valid id", () => __awaiter(void 0, void 0, void 0, function* () {
                let response = yield (0, supertest_1.default)(index_1.app)
                    .delete(`/api/courses/${courseId}`)
                    .set("x-auth-token", userToken);
                console.log(response.body);
                expect(response.status).toBe(200);
            }));
            test("DELETE /api/courses/:id  should not delete course and should return  a 404 error if id is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
                let invalidId = "sdfgh1363sdfghjklh234";
                let response = yield (0, supertest_1.default)(index_1.app)
                    .delete(`/api/courses/${invalidId}`)
                    .set("x-auth-token", userToken);
                expect(response.status).toBe(404);
                expect(response.body.message).toMatch(/invalid object id/i);
            }));
            test("DELETE /api/courses/:id should not delete course and should return  a 401 permission denied error if no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
                let invalidId = "sdfgh1363sdfghjklh234";
                let response = yield (0, supertest_1.default)(index_1.app).delete(`/api/courses/${invalidId}`);
                expect(response.status).toBe(401);
                expect(response.body.message).toMatch(/Permission denied/i);
            }));
        });
    });
});
