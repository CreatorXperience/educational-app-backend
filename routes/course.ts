import { Request, Router } from "express";
import mongoose from "mongoose";
import CourseModel from "../models/course-model";
import validateCourse from "../utils/course/validateCourse";
import validateUpdateCoursePayload from "../utils/course/validateUpdateCourse";
import createCourse from "../utils/course/createCourse";
import courseAuth from "../middleware/course";
import { JwtPayload } from "jsonwebtoken";
const router = Router();

router.get("/", async (req: Request & { user?: JwtPayload }, res) => {
  let courses = await CourseModel.find().sort({ "author.name": -1 });
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

router.post("/", courseAuth, async (req, res) => {
  let { error } = validateCourse(req.body);

  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  createCourse(req.body, res);
});

router.put("/:id", courseAuth, async (req, res) => {
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

router.delete("/:id", courseAuth, async (req, res) => {
  let { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({ message: "Invalid ID" });
  }
  let course = await CourseModel.findByIdAndDelete(id);
  if (!course) {
    return res.status(404).send({ message: "course not found" });
  }

  res.send(course);
});
export default router;
