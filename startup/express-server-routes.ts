import { Application } from "express";
import courses from "../routes/course";
import upload from "../routes/uploads";
import users from "../routes/user";
import auth from "../routes/auth";
import error from "../middleware/error";
import express from "express";

const routesMiddlewares = (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/courses", courses);
  app.use("/auth/users", users);
  app.use("/auth/user", auth);
  app.use("/uploads", upload);
  app.use(error);
};

export default routesMiddlewares;
