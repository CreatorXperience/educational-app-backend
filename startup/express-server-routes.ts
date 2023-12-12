import { Application } from "express";
import express from "express";
import courses from "../routes/course";
import users from "../routes/user";
import auth from "../routes/auth";
import error from "../middleware/error";

const routesMiddlewares = (app: Application) => {
  app.use(express.json());
  app.use("/api/courses", courses);
  app.use("/auth/users", users);
  app.use("/auth/user", auth);
  app.use(error);
};

export default routesMiddlewares;
