import mongoose from "mongoose";
import { TFile } from "./types/file-type";

let fileSchema = new mongoose.Schema<TFile>({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default fileSchema;
