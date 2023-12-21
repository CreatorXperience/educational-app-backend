import CourseModel from "../../../models/course-model";
import { TCourse } from "../../../models/types/course-type";

const insertDocInMongodbMockServer = async (CoursePayload: TCourse) => {
  let course = new CourseModel(CoursePayload);
  await course.save();
};

export default insertDocInMongodbMockServer;
