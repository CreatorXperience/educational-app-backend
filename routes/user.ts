import express from "express";
import _ from "lodash";
import dotenv from "dotenv";

import complexPassword from "../utils/user/handlePasswordComplexity";
import validateUser from "../utils/user/validateUser";
import createUser from "../utils/user/createUser";
import findUser from "../utils/user/findUser";
import sendOtp from "../utils/user/send-otp";

dotenv.config();

const router = express.Router();

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

    await sendOtp({
      email: userPayload.email,
      res,
      id: userPayload._id.toHexString(),
    });
    return res.send(userPayload);
  }
  res.status(500).send("Internal Server Error");
});

export default router;
