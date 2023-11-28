import mongoose from "mongoose";

let authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  post: { type: String, required: true },
  bio: { type: String, required: true, minLength: 30, maxlength: 1000 },
});

export default authorSchema;
