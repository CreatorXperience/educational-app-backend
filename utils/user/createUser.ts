import UserModel from "../../models/userModel";
import bcrypt from "bcryptjs";
import { TUser } from "../../types/userType";
import _ from "lodash";

const createUser = async (userPayload: TUser) => {
  let newUser = new UserModel(
    _.pick(userPayload, ["fullname", "email", "password"])
  );

  let salt = await bcrypt.genSalt(10);
  let passwordHash = await bcrypt.hash(newUser.password, salt);
  newUser.password = passwordHash;

  return await newUser.save();
};

export default createUser;
