import { Response } from "express";
import validateUserAuth from "./validateUserAuth";
import findUser from "./findUser";
import bcrypt from "bcryptjs";
import { TUser } from "../../types/userType";

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

export default userAuth;
