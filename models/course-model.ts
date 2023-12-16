import mongoose from "mongoose";
import { TCourse } from "./types/course-type";
import authorSchema from "./authorSchema";

let courseSchema = new mongoose.Schema<TCourse>({
  category: { type: String, required: true, minLength: 5, maxLength: 20 },
  author: authorSchema,
  topic: {
    type: [
      {
        description: { type: String, required: true },
        youtubeId: { type: String, required: true },
        title: { type: String, required: true },
        coverImage: { type: String, required: true },
      },
    ],
    default: [],
    required: true,
  },
  courseDescription: { type: String, required: true, minlength: 15 },
  coverImage: { type: String, required: true },
  coverTitle: { type: String, required: true },
  stars: { type: Number, required: true, min: 0, max: 5 },
});

let CourseModel = mongoose.model("courses", courseSchema);

export default CourseModel;
