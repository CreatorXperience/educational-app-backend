import express, { Application } from "express";
require("express-async-errors");
import dotenv from "dotenv";
dotenv.config();
import { MongoMemoryServer } from "mongodb-memory-server";

import winston from "winston";
import setupServer from "./startup/setup-server";
import routesMiddlewares from "./startup/express-server-routes";

const app: Application = express();

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

routesMiddlewares(app);

export { app, mongoServer };
