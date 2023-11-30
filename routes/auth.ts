import { Response } from "express";
import bcrypt from "bcryptjs";
import config from "config";
import jwt from "jsonwebtoken";
import validateUserAuth from "../utils/user/validateUserAuth";
import { TUser } from "../types/userType";
import { Router } from "express";
import findUser from "../utils/user/findUser";

const router = Router();

const userAuth = async (
  userPayload: Pick<TUser, "password" | "email">,
  res: Response
) => {
  let { error } = validateUserAuth(userPayload);
  if (error) {
    return res.status(404).send({ message: error.details[0].message });
  }

  let user = await findUser({ email: userPayload.email });

  if (user) {
    let isPasswordEqual = await bcrypt.compare(
      userPayload.password,
      user.password
    );

    if (isPasswordEqual) {
      let token = user.generateAuthToken();
      return res.header("x-auth-token", token).send("successfully logged in");
    }
    return res.status(401).send({ message: "Invalid login or password" });
  }

  res.status(401).send({ message: "user not exist" });
};

router.post("/", (req, res) => {
  let user = userAuth(req.body, res);
});

export default router;
