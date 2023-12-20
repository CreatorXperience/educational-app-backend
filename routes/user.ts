import express, { Response } from "express";
import _ from "lodash";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

import complexPassword from "../utils/user/handlePasswordComplexity";
import validateUser from "../utils/user/validateUser";
import createUser from "../utils/user/createUser";
import findUser from "../utils/user/findUser";

import OtpModel from "../models/verification-email";

dotenv.config();

const router = express.Router();

const verifyEmailAddress = async (email: string, res: Response, id: string) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.GMAIL_ACC,
      pass: process.env.GMAIL_PASS,
    },
  });

  let otp = Math.floor(1000 + Math.random() * 9000);

  const mailOptions = {
    from: process.env.GMAIL_ACC,
    to: email,
    subject: `Verify Email`,
    text: `Verify your email with this otp:  ${otp} if you didn't request for this otp you can safely ignore it. `,
  };

  transporter.sendMail(mailOptions, async (err, data) => {
    if (err) {
      return res.status(404).send({ message: err });
    }

    let salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(otp.toString(), salt);
    let oneTimeModel = new OtpModel({
      otp: hashedPassword,
      userId: id,
    });

    await oneTimeModel.save();
  });
};

router.post("/", async (req, res) => {
  let { error } = validateUser(req.body);

  if (error) {
    return res.status(404).send({ message: error.details[0].message });
  }

  let { error: passwordError } = complexPassword(req.body.password);

  if (passwordError) {
    return res.status(404).send({ message: passwordError.details[0].message });
  }

  let isUserExist = await findUser({ email: req.body.email });
  if (isUserExist) {
    return res.send({ message: "User already exist" });
  }

  let user = await createUser(req.body);

  if (user) {
    let userPayload = _.pick(user, ["fullname", "email", "_id"]);

    await verifyEmailAddress(
      userPayload.email,
      res,
      userPayload._id.toHexString()
    );
    return res.send(userPayload);
  }
  res.status(500).send("Internal Server Error");
});

export default router;
