import request from "supertest";
import { app, mongoServer } from "../../../index";
import mongoose from "mongoose";
import insertDocInMongodbMockServer from "../../../utils/course/testsUtils/Insert";
import { TCourse } from "../../../models/types/course-type";
import createUser from "../../../utils/user/createUser";
import _ from "lodash";
import { TUser } from "../../../types/userType";
import coursePayload from "../test-payload/coursePayload";

let courseId: string;

const postNewUser = async (userPayload: TUser) => {
  let user = await createUser(userPayload);
  const res = await request(app)
    .post("/auth/user")
    .send(_.pick(userPayload, ["email", "password"]));

  let token = res.header["x-auth-token"];

  return { res, token };
};

describe("/api/courses", () => {
  beforeAll(async () => {
    await insertDocInMongodbMockServer(coursePayload);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe("GET /", () => {
    test("should retrieve all courses in the DB", async () => {
      const response = await request(app).get("/api/courses");
      courseId = response.body[0]._id;
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(
        response.body.some((res: TCourse) => res.author.name === "Adam Smith")
      ).toBeTruthy();
    });
  });

  describe("Get /:id", () => {
    test("should retrieve course with a given id", async () => {
      const response = await request(app).get(`/api/courses/${courseId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", courseId);
    });

    test("should return 404 if passed with invalid id", async () => {
      let invalidId = "123";
      const response = await request(app).get(`/api/courses/${123}`);
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ message: "Invalid object id" });
    });

    test("should return 404 error if request a a valid id but with no data associated with the id in the database", async () => {
      let validData = "6565fdee473fa8c1a4b29503";
      const response = await request(app).get(`/api/courses/${validData}`);
      expect(response.status).toBe(404);

      expect(response.body).toMatchObject({
        message: "The course with the specified ID doesn't exist",
      });
    });
  });

  describe("POST /api/courses", () => {
    test("should return a 401 error if user is not logged in", async () => {
      const response = await request(app)
        .post("/api/courses")
        .send({ name: "hi" });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/no token provided/i);
    });

    test("should return a 401 error if user is logged in but not an admin", async () => {
      let userPayload = {
        fullname: "Habeeb Ayinde Alabi",
        email: "thebigboy@gmail.com",
        password: "12345678@Ab",
      };

      let { res, token } = await postNewUser(userPayload);
      expect(res.status).toBe(200);

      const response = await request(app)
        .post("/api/courses")
        .send(coursePayload)
        .set("x-auth-token", token);

      expect(response.status).toBe(401);
      // expect(response.body.message).toBe()
    });

    describe("Admin POST to /api/course", () => {
      let res: request.Response, token: string;

      beforeAll(async () => {
        let userPayload = {
          fullname: "Habeeb Ayinde Alabi",
          email: "testUser@gmail.com",
          password: "12345678@Ab",
          admin: true,
        };

        let { res: Res, token: Token } = await postNewUser(userPayload);
        res = Res;
        token = Token;
      });

      test("should return a 404 error if user is logged in and an admin but invalid payload", async () => {
        const response = await request(app)
          .post("/api/courses")
          .send({ name: "test" })
          .set("x-auth-token", token);

        expect(response.body.message).toMatch(/[^. is required]/i);
        expect(response.status).toBe(404);
      });

      test("should return a 200 success status if user is logged in and an admin with the valid payload", async () => {
        const response = await request(app)
          .post("/api/courses")
          .send(coursePayload)
          .set("x-auth-token", token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("author");
      });
    });

    describe("PUT /api/courses", () => {
      // beforeAll(async () => {

      // });

      const createNewUserAndUpdateCourse = async (payload: {
        fullname: string;
        password: string;
        email: string;
        admin?: boolean;
      }) => {
        let { token } = await postNewUser(payload);

        let response = await request(app)
          .put(`/api/courses/${courseId}`)
          .send({
            category: "Anaconda",
          })
          .set("x-auth-token", token);

        return { response };
      };

      test("PUT /api/courses/:id", async () => {
        let userPayload = {
          fullname: "tester",
          password: "12345678As@",
          email: "tester000@gmail.com",
        };

        const { response } = await createNewUserAndUpdateCourse(userPayload);

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/not admin/i);
      });

      test("PUT /api/courses/:id return 200 if user is an admin", async () => {
        let userPayload = {
          fullname: "tester",
          password: "12345678As@",
          email: "tester689@gmail.com",
          admin: true,
        };

        const { response } = await createNewUserAndUpdateCourse(userPayload);
        expect(response.status).toBe(200);
        expect(response.body.modifiedCount).toBe(1);
      });
    });
  });
});
