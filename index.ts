import express, { Application } from "express";
import mongoose from "mongoose";
require("express-async-errors");
import dotenv from "dotenv";
dotenv.config();
import { MongoMemoryServer } from "mongodb-memory-server";
import Grid from "gridfs-stream";
import multer from "multer";

import setupServer from "./startup/setup-server";
import routesMiddlewares from "./startup/express-server-routes";
import winstonErrorhandler from "./startup/winston-handler";

const app: Application = express();
app.set("view engine", "ejs");

const port = process.env.PORT;

winstonErrorhandler();

let connection = mongoose.connection;

let mongoServer: MongoMemoryServer;

setupServer(app, port).then((server) => {
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

app.get("/", (req, res) => {
  res.render("index");
});
console.log("connection is open");
connection.on("open", () => {
  let bucket = new mongoose.mongo.GridFSBucket(connection.db);

  // app.post(
  //   "/api/courses",
  //   [courseAuth, upload.single("file")],
  //   async (req: Request, res: Response) => {
  //     let file = req.file;

  //     // @ts-ignore
  //     let {fieldname, originalname,mimetype, buffer} = file as File

  //     let coursePayload = {
  //       ...req.body,
  //       image: fieldname, originalname, mimetype, buffer
  //     }

  //     let { error } = validateCourse(coursePayload);

  //     if (error) {
  //       return res.status(404).send({ message: error.details[0].message });
  //     }
  //     return createCourse(coursePayload, res);
  //   }
  // );
});
routesMiddlewares(app);

export { app, mongoServer };
