import nodemailer from "nodemailer";
import express from "express";
const Router = express.Router();

Router.post("/", (req, res) => {
  const { subject, recipient } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.GMAIL_ACC,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOption = {
    from: process.env.GMAIL_ACC,
    to: recipient,
    subject,
    text: "Hello This is just for testing purposes",
  };

  transporter.sendMail(mailOption, function (err, data) {
    if (err) {
      return res.status(404).send({ message: "error sending email", e: err });
    }
    res.send("email sent successfully");
  });
});

export default Router;
