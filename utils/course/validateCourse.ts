import TCourse from "../../models/types/course-type";
import Joi from "joi";

const validateCourse = (course: TCourse) => {
  let courseSchema = Joi.object({
    category: Joi.string().required(),
    author: Joi.object({
      name: Joi.string().required(),
      post: Joi.string().required(),
      bio: Joi.string().required(),
    }),
    topic: Joi.array().items(
      Joi.object({
        description: Joi.string().required(),
        youtubeId: Joi.string().required(),
        title: Joi.string().required(),
        coverImage: Joi.string().required(),
      })
    ),
    courseDescription: Joi.string().required().min(15),
    coverImage: Joi.string().required(),
    coverTitle: Joi.string().required(),
    stars: Joi.number().required().min(0).max(5),
  });

  return courseSchema.validate(course);
};

export default validateCourse;
