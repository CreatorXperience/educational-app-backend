import Joi from "joi";
import { TUser } from "../../types/userType";

const validateUser = (userPayload: TUser) => {
  let userSchema = Joi.object({
    fullname: Joi.string().min(5).max(50).required(),
    password: Joi.string().max(500).min(10),
    email: Joi.string().required().min(5).email(),
  });

  return userSchema.validate(userPayload);
};

export default validateUser;
