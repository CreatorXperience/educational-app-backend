import request from "supertest";
import { app, mongoServer } from "../../../index";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("/api/courses", () => {
  describe("GET /", () => {
    beforeAll(async () => {
      // mongoServer = await MongoMemoryServer.create();
      // const mongoUri = mongoServer.getUri();
      // await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    });

    beforeEach(() => {
      mongoose.connection.dropDatabase();
    });
    test("should return all courses", async () => {
      const response = await request(app).get("/api/courses");
      console.log(response.body);
      // expect(response.status).toBe(200);
    });
  });
});
