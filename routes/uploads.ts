import mongoose from "mongoose";
import multer from "multer";
import express from "express";
import FileModel from "../models/fileschema";
import { Readable } from "stream";

const Router = express.Router();

let storage = multer.memoryStorage();
let upload = multer({ storage });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("CONNECTION IS OPEN OOOOO");

  let bucket = new mongoose.mongo.GridFSBucket(connection.db);
  Router.post("/", upload.single("file"), async (req, res) => {
    let { file } = req;
    //   @ts-ignore
    let { fieldname, originalname, mimetype, buffer } = file;

    let newFile = new FileModel({
      contentType: mimetype,
      filename: originalname,
      length: buffer.length,
    });

    let uploadStream = bucket.openUploadStream(fieldname);

    let Reader = new Readable();
    Reader.push(buffer);
    Reader.push(null);

    try {
      await new Promise((resolve, reject) => {
        Reader.pipe(uploadStream).on("finish", resolve).on("error", reject);
      });

      newFile.id = uploadStream.id;
      let savedFile = await newFile.save();
      if (!savedFile) {
        return res.status(404).send({ message: "error while saving file" });
      }
      res.send({ message: "file was uploaded successfully" });
    } catch (e) {
      return res.status(404).send({ message: "error while saving", e: e });
    }
  });
});

export default Router;
