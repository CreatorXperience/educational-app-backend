import config from "config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/userModel";

const courseAuth = async (
  req: Request & { user?: jwt.JwtPayload },
  res: Response,
  next: NextFunction
) => {
  let token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ message: "Permission denied. No token provided" });
  }

  try {
    let userPayload = jwt.verify(token, config.get("edu-secret-key"));
    req.user = userPayload as JwtPayload;
    const user = await UserModel.findById(req.user?._id);
    if (user?.admin) {
      return next();
    }

    return res.status(401).send({ message: "unauthorized. user is not admin" });
  } catch (e) {
    return res.status(400).send({ message: "Invalid token provided" });
  }
};

export default courseAuth;
