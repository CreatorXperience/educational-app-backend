import mongoose from "mongoose";
import CourseModel from "../models/course-model";
const winston = require("winston");

const migrateErrorLogger = winston.createLogger({
  level: "info",
  exceptionHandlers: [
    new winston.transports.File({ filename: "migration.log" }),
  ],
});

const URI = process.env.URI as string;
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
  let courses = await CourseModel.find({ image: { $exists: false } });
  let imagePayload = {
    filename: "",
    contentType: "",
  };
  courses.forEach(async (course) => {
    // course.image = imagePayload;
    await course.save();
  });
};

const migrateDown = async () => {
  let courses = await CourseModel.updateMany(
    { image: { $exists: true } },
    { $unset: { image: "" } }
  );
};

updateCourseSchema();
