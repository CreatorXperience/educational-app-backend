import mongoose from "mongoose";
import UserModel from "../models/userModel";
import winston from "winston";
import dotenv from "dotenv";
dotenv.config();

const migrateErrorLogger = winston.createLogger({
  level: "info",
  exceptionHandlers: [
    new winston.transports.File({ filename: "migration.log" }),
  ],
});

const URI = process.env.URI as string;
console.log(URI);
const updateCourseSchema = () => {
  mongoose
    .connect(URI)
    .then(() => {
      console.log(
        "connected to mongoDb Database Successfully from migration file"
      );
    })
    .then(() => {
      migrateUp();
    })
    .catch(() => {
      console.log(
        "error occured while connecting to database from migration file"
      );
    });
};

const migrateUp = async () => {
  let users = await UserModel.find({ verified: { $exists: false } });

  if (users) {
    return users.forEach(async (user) => {
      user.verified = "false";
      await user.save();
    });
  }

  return;
};

const migrateDown = async () => {
  let user = await UserModel.updateMany(
    { verified: { $exists: true } },
    { $unset: { verified: "" } }
  );
};

updateCourseSchema();
