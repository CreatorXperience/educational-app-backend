import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    maxLength: 50,
  },
  password: { type: String, maxLength: 500, min: 10, required: true },
  fullname: { type: String, minLength: 5, maxLength: 50, required: true },
});

let UserModel = mongoose.model("users", userSchema);

export default UserModel;
