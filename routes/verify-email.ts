import express from "express";
import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
import OtpModel from "../models/verification-email";

const Router = express.Router();
const validateReqPayload = (payload: { otp: string; id: string }) => {
  const payloadSchema = Joi.object({
    otp: Joi.string().required().max(4).min(4),
    id: Joi.string().required(),
  });
  return payloadSchema.validate(payload);
};

Router.post("/", async (req, res) => {
  const { error } = validateReqPayload(req.body);
  if (error) {
    return res.status(404).send({ message: error.details[0].message });
  }
  let { otp, id } = req.body;

  if (!mongoose.isValidObjectId(id))
    return res.status(404).send({ message: "Invalid course id" });

  let userOtpPayloads = await OtpModel.find({ userId: id });
  if (userOtpPayloads.length > 0) {
    return userOtpPayloads.forEach(async (otpPayload) => {
      if (!otpPayload) {
        return res.send("Otp not found");
      }

      let currentTime = new Date(Date.now());
      let expiryDate = new Date(otpPayload.expiresAt);

      if (currentTime > expiryDate) {
        return res.send("Otp already expires");
      }

      let isEqual = await bcrypt.compare(otp, otpPayload.otp);

      if (isEqual) {
        let user = await UserModel.findByIdAndUpdate(id, {
          $set: { verified: true },
        });
        if (user) {
          await user.save();
          return res.send({ message: "email verified successfully" });
        }
        return res.send(404).send({ message: "user not found" });
      }
      return res.status(404).send("invalid otp");
    });
  }
  return res.status(404).send({ message: "invalid id or otp" });
});

export default Router;
