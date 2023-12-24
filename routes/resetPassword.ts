import express from "express";
import Joi from "joi";
import UserModel from "../models/userModel";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import complexPassword from "../utils/user/handlePasswordComplexity";
const Router = express.Router();

const validatePayload = (payload: { email: string }) => {
  let payloadValidation = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string(),
  });
  return payloadValidation.validate(payload);
};

Router.post("/", async (req, res) => {
  let { error } = validatePayload(req.body);
  if (error) {
    return res.status(404).send({ message: error.details[0].message });
  }

  let { error: err } = complexPassword(req.body.password);
  if (err) {
    return res.status(404).send({ message: err.details[0].message });
  }

  let session = await mongoose.startSession();

  await session.withTransaction(async () => {
    let user = await UserModel.find({ email: req.body.email });
    if (!user) {
      res
        .status(404)
        .send({ message: "User with the specified email does not exist" });
      return session.abortTransaction();
    }

    let salt = await bcrypt.genSalt(10);

    let hashedPassword = await bcrypt.hash(req.body.password, salt);
    await UserModel.updateOne(
      { email: req.body.email },
      { $set: { password: hashedPassword } }
    );
    res.send("password changed successfully");
    session.commitTransaction();
  });
});

export default Router;
