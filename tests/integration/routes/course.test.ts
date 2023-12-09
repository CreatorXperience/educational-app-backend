import request from "supertest";
import { app, mongoServer } from "../../../index";
import mongoose from "mongoose";
import insertDocInMongodbMockServer from "../../../utils/course/testsUtils/Insert";
import TCourse from "../../../models/types/course-type";

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

describe("/api/courses", () => {
  describe("GET /", () => {
    afterAll(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    });

    beforeAll(async () => {
      await insertDocInMongodbMockServer(coursePayload);
    });

    test("should return all courses", async () => {
      const response = await request(app).get("/api/courses");
      console.log(response.body);
      expect(response.body.length).toBe(1);
      expect(
        response.body.some((res: TCourse) => (res.author.name = "Adam Smith"))
      ).toBeTruthy();
    });
  });
});
