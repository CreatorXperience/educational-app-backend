import express from "express";
import UserModel from "../models/userModel";
import PasswordComplexity from "joi-password-complexity";
import _ from "lodash";

import Joi from "joi";
import type { TUser } from "../types/userType";

const router = express.Router();

const validateUser = (userPayload: TUser) => {
  let userSchema = Joi.object({
    Fullname: Joi.string().min(5).max(50).required(),
    Password: Joi.string().max(500).min(10),
    Email: Joi.string().required().min(5).email(),
  });

  return userSchema.validate(userPayload);
};

router.post("/", async (req, res) => {
  let { error } = validateUser(req.body);
  if (error) {
    return res.status(404).send({ message: error.details[0].message });
  }

  let passwordOptions = {
    min: 10,
    max: 500,
    symbol: 1,
    numeric: 1,
    upperCase: 1,
    lowerCase: 1,
  };

  let { error: passwordError } = PasswordComplexity(passwordOptions).validate(
    req.body.Password
  );

  if (passwordError) {
    return res.status(404).send({ message: passwordError.details[0].message });
  }

  let newUser = new UserModel(
    _.pick(req.body, ["Fullname", "Email", "Password"])
  );
  let user = await newUser.save();

  if (user) {
    return res.send(user);
  }
  res.status(500).send("Internal Server Error");
});

export default router;
