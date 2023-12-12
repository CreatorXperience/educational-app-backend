import { app } from "../../..";
import createUser from "../../../utils/user/createUser";
import request from "supertest";
import _ from "lodash";

describe("auth middleware", () => {
  let authtoken: string;
  let userPayload = {
    fullname: "Habeeb Muhydeen success",
    email: "hacker5244@gmail.com",
    password: "1234567890As@",
  };

  describe("test auth middleware", () => {
    beforeAll(async () => {
      //   let user = await createUser(userPayload);
      let response = await request(app)
        .post("/auth/user")
        .send(_.pick(userPayload, ["email", "password"]));
      let token = response.header["x-auth-token"];
      authtoken = token;
    });

    test("auth", () => {});
  });
});
