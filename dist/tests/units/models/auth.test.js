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
const __1 = require("../../..");
const supertest_1 = __importDefault(require("supertest"));
const lodash_1 = __importDefault(require("lodash"));
describe("auth middleware", () => {
    let authtoken;
    let userPayload = {
        fullname: "Habeeb Muhydeen success",
        email: "hacker5244@gmail.com",
        password: "1234567890As@",
    };
    describe("test auth middleware", () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            //   let user = await createUser(userPayload);
            let response = yield (0, supertest_1.default)(__1.app)
                .post("/auth/user")
                .send(lodash_1.default.pick(userPayload, ["email", "password"]));
            let token = response.header["x-auth-token"];
            authtoken = token;
        }));
        test("auth", () => { });
    });
});
