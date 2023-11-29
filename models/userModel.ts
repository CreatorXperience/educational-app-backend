import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
  Email: {
    type: String,
    unique: true,
    required: true,
    maxLength: 50,
  },
  Password: { type: String, maxLength: 500, min: 10, required: true },
  Fullname: { type: String, minLength: 5, maxLength: 50, required: true },
});

let UserModel = mongoose.model("users", userSchema);

export default UserModel;
