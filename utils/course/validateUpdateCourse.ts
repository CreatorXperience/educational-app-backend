import { TCourseUpdate } from "../../types/courseType";
import Joi from "joi";

const validateUpdateCoursePayload = (course: TCourseUpdate) => {
  let courseSchema = Joi.object({
    category: Joi.string(),
    author: Joi.object({
      name: Joi.string(),
      post: Joi.string(),
      bio: Joi.string(),
    }),
    topic: Joi.array().items(
      Joi.object({
        description: Joi.string(),
        youtubeId: Joi.string(),
        title: Joi.string(),
        coverImage: Joi.string(),
      })
    ),
    courseDescription: Joi.string().min(15),
    coverImage: Joi.string(),
    coverTitle: Joi.string(),
    stars: Joi.number().min(0).max(5),
  });

  return courseSchema.validate(course);
};

export default validateUpdateCoursePayload;
