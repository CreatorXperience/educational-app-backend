import Joi from "joi";
import { TUser } from "../../types/userType";

const validateUserAuth = (userPayload: Pick<TUser, "password" | "email">) => {
  let userSchema = Joi.object({
    password: Joi.string().max(500).min(10),
    email: Joi.string().required().min(5).email(),
  });

  return userSchema.validate(userPayload);
};

export default validateUserAuth;
