import express, { Application } from "express";
require("express-async-errors");
import dotenv from "dotenv";
dotenv.config();
import { MongoMemoryServer } from "mongodb-memory-server";

import setupServer from "./startup/setup-server";
import routesMiddlewares from "./startup/express-server-routes";
import winstonErrorhandler from "./startup/winston-handler";

const app: Application = express();

const port = process.env.PORT || 3030;

winstonErrorhandler();

let mongoServer: MongoMemoryServer;

setupServer(port).then((server) => {
  mongoServer = server;
});

if (!process.env.EDU_KEY) {
  process.exit(1);
}

routesMiddlewares(app);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to this API </h1>");
});

export { app, mongoServer };
