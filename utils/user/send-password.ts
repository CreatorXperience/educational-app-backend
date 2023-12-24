import { Response } from "express";
import mailTransport from "./nodemailer-transport";

const sendPasswordLink = async (payload: { email: string; res: Response }) => {
  const transporter = mailTransport();

  const mailOptions = {
    from: process.env.GMAIL_ACC,
    to: payload.email,
    subject: `Forgot Password`,
    text: `<p>Click on this link <a>http://changeyourpass.com</a> to verify your password</p> `,
  };

  transporter.sendMail(mailOptions, async (err, data) => {
    if (err) {
      return payload.res.status(404).send({ message: err });
    }

    return payload.res.send("email sent successfully");
  });
};

export default sendPasswordLink;
