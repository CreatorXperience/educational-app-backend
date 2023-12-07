import mongoose from "mongoose";
import UserModel from "../../models/userModel";
import jwt from "jsonwebtoken";
import config from "config";
test("expect a pass", () => {
  const newUser = new UserModel({
    _id: new mongoose.Types.ObjectId().toHexString(),
    firstname: "Habeeb",
    lastname: "Muhydeen",
    password: "1234567890%Ab",
    isAdmin: false,
  });

  const token = newUser.generateAuthToken();
  const decoded = jwt.verify(token, config.get("edu-secret-key"));

  expect(decoded).toMatchObject({
    _id: new mongoose.Types.ObjectId(newUser._id).toHexString(),
  });
});
