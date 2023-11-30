import UserModel from "../../models/userModel";
import { TUser } from "../../types/userType";

const findUser = async (userPayload: Partial<TUser>) => {
  return await UserModel.findOne({ ...userPayload });
};

export default findUser;
