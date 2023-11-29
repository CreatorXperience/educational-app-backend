import { Router } from "express";
import mongoose from "mongoose";
import CourseModel from "../models/course-model";
import validateCourse from "../utils/validateCourse";
import validateUpdateCoursePayload from "../utils/validateUpdateCourse";
import createCourse from "../utils/createCourse";
const router = Router();

router.get("/", async (req, res) => {
  let courses = await CourseModel.find();
  if (courses) {
    return res.send(courses);
  }
  res.status(404).send({ message: "course not found" });
});

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({ message: "Invalid object id" });
  }

  let course = await CourseModel.findById(id);
  if (!course) {
    return res
      .status(404)
      .send({ message: "The course with the specified ID doesn't exist" });
  }
  res.send(course);
});

router.post("/", async (req, res) => {
  let { error } = validateCourse(req.body);

  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  createCourse(req.body, res);
});

router.put("/:id", async (req, res) => {
  let { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({ message: "Invalid ID" });
  }

  let { error } = validateUpdateCoursePayload(req.body);

  if (error) {
    return res.status(404).send({ message: error.details[0].message });
  }

  let course = await CourseModel.updateOne(
    { _id: id },
    {
      $set: {
        ...req.body,
      },
    }
  );

  if (!course) {
    return res.status(404).send("Course with the given id does not exist");
  }

  return res.send(course);
});

export default router;
