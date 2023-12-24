import bcrypt from "bcryptjs";
import OtpModel from "../../models/verification-email";
import { Response } from "express";
import mailTransport from "./nodemailer-transport";

const sendOtp = async (payload: {
  email: string;
  res: Response;
  id: string;
}) => {
  const transporter = mailTransport();

  let otp = Math.floor(1000 + Math.random() * 9000);

  const mailOptions = {
    from: process.env.GMAIL_ACC,
    to: payload.email,
    subject: `Verify Email`,
    text: `Verify your email with this otp:  ${otp} if you didn't request for this otp you can safely ignore it. `,
  };

  transporter.sendMail(mailOptions, async (err, data) => {
    if (err) {
      return payload.res.status(404).send({ message: err });
    }

    let salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(otp.toString(), salt);
    let oneTimeModel = new OtpModel({
      otp: hashedPassword,
      userId: payload.id,
    });

    await oneTimeModel.save();
  });
};

export default sendOtp;
