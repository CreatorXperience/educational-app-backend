import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import CourseModel from "../models/course-model";
import validateCourse from "../utils/course/validateCourse";
import validateUpdateCoursePayload from "../utils/course/validateUpdateCourse";
import createCourse from "../utils/course/createCourse";
import courseAuth from "../middleware/courseAuth";
import validateId from "../middleware/validateId";
import Joi from "joi";

const router = Router();

const countValidation = (countPayload: { count: string }) => {
  const count = Joi.object({
    count: Joi.string().required(),
  });

  return count.validate(countPayload);
};

router.get("/", async (req, res) => {
  let count = { count: req.query.count as string };
  const { error } = countValidation(count);
  if (!error) {
    const limit = 20;
    let courses = await CourseModel.find()
      .skip(Number(req.query.count) * limit)
      .limit(limit);
    if (courses) {
      return res.send(courses);
    }
    return res.status(404).send({ message: "course not found" });
  }

  return res.status(404).send({ message: error.details[0].message });
});

router.get("/:id", validateId, async (req, res) => {
  let course = await CourseModel.findById(req.params.id);
  if (!course) {
    return res
      .status(404)
      .send({ message: "The course with the specified ID doesn't exist" });
  }
  res.send(course);
});

router.post("/", [courseAuth], async (req: Request, res: Response) => {
  let file = req.file;
  console.log(file);
  let { error } = validateCourse(req.body);

  if (error) {
    return res.status(404).send({ message: error.details[0].message });
  }
  return createCourse(req.body, res);
});

router.put(
  "/:id",
  [courseAuth, validateId],
  async (req: Request, res: Response) => {
    let { id } = req.params;

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
  }
);

router.delete(
  "/:id",
  [courseAuth, validateId],
  async (req: Request, res: Response) => {
    let { id } = req.params;

    let course = await CourseModel.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).send({ message: "course not found" });
    }

    res.send(course);
  }
);
export default router;
