import express, { Application } from "express";
import config from "config";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
dotenv.config();
import { connectToMongoDB } from "./startup/db";
import courses from "./routes/course";
import users from "./routes/user";
import auth from "./routes/auth";

const app: Application = express();

const port = process.env.PORT;

let mongoServer: MongoMemoryServer;

const mockServerURI = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  return mongoUri;
};

const getUri = async (connect: (uri: string) => Promise<void>) => {
  let uri: string =
    process.env.NODE_ENV === "test"
      ? await mockServerURI()
      : (process.env.URI as string);

  connect(uri);
};

getUri(connectToMongoDB);

if (process.env.NODE_ENV !== "test") {
  const server = app.listen(port, () => {
    console.log(`it has been connected to port ${port}`);
  });
}

if (!config.get("edu-secret-key")) {
  // throw new Error("No key provided");
  process.exit(1);
}

app.use(express.json());
app.use("/api/courses", courses);
app.use("/auth/users", users);
app.use("/auth/user", auth);

export { app, mongoServer };
