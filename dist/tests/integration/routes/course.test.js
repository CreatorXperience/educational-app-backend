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
describe("/api/courses", () => {
    describe("GET /", () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            // mongoServer = await MongoMemoryServer.create();
            // const mongoUri = mongoServer.getUri();
            // await mongoose.connect(mongoUri);
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connection.dropDatabase();
            yield mongoose_1.default.connection.close();
            yield index_1.mongoServer.stop();
        }));
        beforeEach(() => {
            mongoose_1.default.connection.dropDatabase();
        });
        test("should return all courses", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).get("/api/courses");
            console.log(response.body);
            // expect(response.status).toBe(200);
        }));
    });
});
