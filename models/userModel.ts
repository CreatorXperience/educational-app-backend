import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "config";

let userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      maxLength: 50,
    },
    password: { type: String, maxLength: 500, minLength: 10, required: true },
    fullname: { type: String, minLength: 5, maxLength: 50, required: true },
    admin: { type: Boolean, default: false },
    verified: { type: String, default: false },
  },
  {
    methods: {
      generateAuthToken() {
        let token = jwt.sign({ _id: this._id }, config.get("edu-secret-key"));
        return token;
      },
    },
  }
);

let UserModel = mongoose.model("users", userSchema);

export default UserModel;
