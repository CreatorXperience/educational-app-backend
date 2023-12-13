import express, { Application } from "express";
require("express-async-errors");
import dotenv from "dotenv";
dotenv.config();
import { MongoMemoryServer } from "mongodb-memory-server";

import winston from "winston";
import setupServer from "./startup/setup-server";
import courses from "./routes/course";
import users from "./routes/user";
import auth from "./routes/auth";
import error from "./middleware/error";
import routesMiddlewares from "./startup/express-server-routes";

const app: Application = express();

app.use(express.json());
const port = process.env.PORT;
let mongoServer: MongoMemoryServer;

const exceptionHandler = winston.createLogger({
  transports: [new winston.transports.File({ filename: "combined.log" })],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
  ],
});

const rejectionHandler = winston.createLogger({
  level: "info",
  rejectionHandlers: [
    new winston.transports.File({ filename: "rejection.log" }),
  ],
});

setupServer(app, port).then((server) => {
  mongoServer = server;
});

if (!process.env.EDU_KEY) {
  process.exit(1);
}

app.use("/api/courses", courses);
app.use("/auth/users", users);
app.use("/auth/user", auth);
app.use(error);

export { app, mongoServer };
