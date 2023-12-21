import { Response } from "express";
import { TCourse } from "../../models/types/course-type";
import CourseModel from "../../models/course-model";

const createCourse = async (course: TCourse, res: Response) => {
  const newCourse = new CourseModel(course);
  const savedCourses = await newCourse.save();
  if (savedCourses) {
    return res.send(savedCourses);
  }

  return res.status(500).send("Internal Server error");
};

export default createCourse;
