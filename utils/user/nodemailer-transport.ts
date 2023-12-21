import nodemailer from "nodemailer";

const mailTransport = () => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.GMAIL_ACC,
      pass: process.env.GMAIL_PASS,
    },
  });

  return transporter;
};

export default mailTransport;
