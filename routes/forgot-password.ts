import express from "express";
import Joi from "joi";
import sendPasswordLink from "../utils/user/send-password";
import UserModel from "../models/userModel";

const Router = express.Router();

const forgotPasswordValidation = (payload: { email: string }) => {
  const forgotPassword = Joi.object({
    email: Joi.string().required().email(),
    id: Joi.string().required(),
  });

  return forgotPassword.validate(payload);
};

Router.post("/", async (req, res) => {
  const { error, value } = forgotPasswordValidation(req.body);
  if (error) {
    return res.status(404).send({ message: error.details[0].message });
  }

  const { email, id } = req.body;
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(404).send({ message: "user not found" });
  }
  await sendPasswordLink({ email, res, id });
});

export default Router;
