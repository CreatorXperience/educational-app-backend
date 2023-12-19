import mongoose from "mongoose";
import { TFile } from "./types/file-type";

let fileSchema = new mongoose.Schema<TFile>({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  length: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

let FileModel = mongoose.model("courses-image", fileSchema);

export default FileModel;
