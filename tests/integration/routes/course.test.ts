import request from "supertest";
import { app, mongoServer } from "../../../index";
import mongoose from "mongoose";
import insertDocInMongodbMockServer from "../../../utils/course/testsUtils/Insert";
import TCourse from "../../../models/types/course-type";
import createUser from "../../../utils/user/createUser";
import _ from "lodash";
import { TUser } from "../../../types/userType";

const coursePayload = {
  author: {
    name: "Adam Smith",
    post: "Python Developer",
    bio: "Created a ongodb database with som small data init. ain't she beautiful init",
  },
  category: "Python",

  topic: [
    {
      description:
        "Learn the basics of Python for finance and algorithmic trading. This course will teach you the fundamentals of Python programming and its applications in finance.",
      title: "Introduction to Python for Finance",
      youtubeId: "https://www.youtube.com/watch?v=abcdef12345",
      coverImage: "my Image is on it way",
    },
    {
      description:
        "Learn how to use Python for financial analysis and algorithmic trading. This course will teach you the fundamentals of Python programming and its applications in finance.",
      title: "Python for Financial Analysis",
      youtubeId: "https://www.youtube.com/watch?v=abcdef12345",
      coverImage: "my Image is on it way",
    },
    {
      description:
        "Learn how to use Python for algorithmic trading. This course will teach you the fundamentals of Python programming and its applications in finance.",
      title: "Python for Algorithmic Trading",
      youtubeId: "https://www.youtube.com/watch?v=abcdef12345",
      coverImage: "my Image is on it way",
    },
  ],
  courseDescription:
    "This comprehensive course covers Python's applications in financial analysis and algorithmic trading. Learn data analysis, statistical modeling, and trading strategies in Python.",
  coverImage:
    "https://i.pinimg.com/564x/34/01/ee/3401ee2dbb27776d850e77c6a2bee3d2.jpg",
  coverTitle: "Python for Financial Analysis Next and Algorithmic Trading",
  stars: 3,
};

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
      console.log(response.body);
      expect(response.body).toHaveProperty("_id", courseId);
    });

    test("should return 404 if passed with invalid id", async () => {
      let invalidId = "123";
      const response = await request(app).get(`/api/courses/${123}`);
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ message: "Invalid object id" });
    });

    test("should return 404 if passed with a valid id but with data associated with the id in our database", async () => {
      let invalidId = "65751bi3193a16af55ab7626";
      const response = await request(app).get(`/api/courses/${123}`);
      expect(response.status).toBe(404);

      expect(response.body).toMatchObject({
        message: "Invalid object id",
      });
      // expect(response.body).toHaveProperty("message", courseId);
    });
  });

  describe("POST /", () => {
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
    });

    test("should return a 404 error if user is logged in and an admin but invalid payload", async () => {
      let userPayload = {
        fullname: "Habeeb Ayinde Alabi",
        email: "testUser@gmail.com",
        password: "12345678@Ab",
        admin: true,
      };

      let { res, token } = await postNewUser(userPayload);
      expect(res.status).toBe(200);

      const response = await request(app)
        .post("/api/courses")
        .send({ name: "test" })
        .set("x-auth-token", token);

      console.log(response.body.message);
      expect(response.body.message).toMatch(/[^. is required]/i);
      expect(response.status).toBe(404);
    });
    test("should return a 200 success status if user is logged in and an admin with the valid payload", async () => {
      let userPayload = {
        fullname: "Habeeb Ayinde Alabi",
        email: "newtestUser@gmail.com",
        password: "12345678@Ab",
        admin: true,
      };

      let { res, token } = await postNewUser(userPayload);
      expect(res.status).toBe(200);

      const response = await request(app)
        .post("/api/courses")
        .send(coursePayload)
        .set("x-auth-token", token);

      console.log(response.body.message);
      expect(response.status).toBe(200);
    });
  });
});
