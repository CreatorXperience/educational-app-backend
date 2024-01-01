import express from "express";
import Joi from "joi";
import CourseModel from "../models/course-model";

const router = express.Router();

const validatePayload = (payload: { searchTerm: string }) => {
  const validation = Joi.object({
    searchterm: Joi.string().required(),
  });

  return validation.validate(payload);
};

router.post("/", async (req, res) => {
  let { count } = req.query;

  let { error } = validatePayload(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  let pipeline = [
    {
      $search: {
        index: "courses-search",
        text: {
          query: req.body.searchterm,
          path: {
            wildcard: "*",
          },
          fuzzy: {},
        },
      },
    },
    {
      $skip: Number(count) * 6,
    },
    {
      $limit: 6,
    },
  ];

  let course = await CourseModel.aggregate(pipeline, {
    allowDiskUse: true,
  });

  if (!course) {
    return res.status(404).send({ message: "no course found" });
  }
  res.send(course);
});

export default router;
