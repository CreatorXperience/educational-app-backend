import mongoose from "mongoose";
import { app, mongoServer } from "../../..";
import createUser from "../../../utils/user/createUser";
import request from "supertest";
import _ from "lodash";
import coursePayload from "../test-payload/coursePayload";

let userPayload = {
  email: "user1@gmail.com",
  fullname: "kelvin patrick",
  password: "12345t672As",
  admin: true,
};

describe("/auth/user", () => {
  let token: string;

  const registerUser = async () => {
    let user = await createUser(userPayload);
  };

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeAll(async () => {
    await registerUser();
  });

  beforeEach(async () => {
    const response = await request(app)
      .post("/auth/user")
      .send(_.pick(userPayload, ["email", "password"]));

    token = response.header["x-auth-token"];
  });

  describe("POST /auth/user", () => {
    test("should return 401 error if no token provided", async () => {
      let response = await request(app)
        .post("/api/courses")
        .send(coursePayload);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/permission denied./i);
    });

    test("should return 401 response status if token is invalid", async () => {
      let invalidToken = "1234";
      let response = await request(app)
        .post("/api/courses")
        .set("x-auth-token", invalidToken)
        .send(coursePayload);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid token provided/i);
    });

    test("should return 200 response status if token is valid", async () => {
      let response = await request(app)
        .post("/api/courses")
        .set("x-auth-token", token)
        .send(coursePayload);

      expect(response.status).toBe(200);
    });

    describe("POST /admin", () => {
      let newToken: string;
      let newUserPayload = {
        email: "tester123@gmail.com",
        fullname: "testee do",
        password: "1345t672Ad",
      };

      beforeEach(async () => {
        let user = await createUser(newUserPayload);

        const response = await request(app)
          .post("/auth/user")
          .send(_.pick(newUserPayload, ["email", "password"]));

        newToken = response.header["x-auth-token"];
      });

      test("should  return 401 response if user is not an admin", async () => {
        let response = await request(app)
          .post("/api/courses")
          .set("x-auth-token", newToken)
          .send(coursePayload);

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/unauthorized/i);
      });
    });
  });
});
