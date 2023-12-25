import { Application } from "express";
import courses from "../routes/course";
import upload from "../routes/uploads";
import users from "../routes/user";
import auth from "../routes/auth";
import email from "../routes/sendmail";
import verifyEmail from "../routes/verify-email";
import forgotpassword from "../routes/forgot-password";
import resetPassword from "../routes/resetPassword";
import search from "../routes/search"
import error from "../middleware/error";
import express from "express";
import cors from "cors"

const routesMiddlewares = (app: Application) => {
  app.use(cors())
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/courses", courses);
  app.use("/auth/users", users);
  app.use("/auth/user", auth);
  app.use("/uploads", upload);
  app.use("/send-email", email);
  app.use("/verify-email", verifyEmail);
  app.use("/auth/reset-password", resetPassword);
  app.use('/search', search)
  app.use("/forgot-password", forgotpassword);
  app.use(error);
};

export default routesMiddlewares;
