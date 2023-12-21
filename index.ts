import express, { Application } from "express";
require("express-async-errors");
import dotenv from "dotenv";
dotenv.config();
import { MongoMemoryServer } from "mongodb-memory-server";

import setupServer from "./startup/setup-server";
import routesMiddlewares from "./startup/express-server-routes";
import winstonErrorhandler from "./startup/winston-handler";

const app: Application = express();

const port = process.env.PORT;

winstonErrorhandler();

let mongoServer: MongoMemoryServer;

setupServer(port).then((server) => {
  mongoServer = server;
});

if (!process.env.EDU_KEY) {
  process.exit(1);
}

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`it has been connected to port ${port}`);
  });
}

routesMiddlewares(app);

export { app, mongoServer };
