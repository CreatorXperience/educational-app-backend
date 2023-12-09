import CourseModel from "../../../models/course-model";
import TCourse from "../../../models/types/course-type";

const insertDocInMongodbMockServer = async (CoursePayload: TCourse) => {
  await CourseModel.collection.insertOne(CoursePayload);
};

export default insertDocInMongodbMockServer;
