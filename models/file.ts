import mongoose from "mongoose";
import { TFile } from "./types/file-type";

let FileSchema = new mongoose.Schema<TFile>({
  filename: String,
  contentType: String,
  date: { type: Date, default: Date.now },
});
