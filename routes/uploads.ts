import mongoose from "mongoose";
import multer from "multer";
import express from "express";
import FileModel from "../models/file-model";
import { Readable } from "stream";

const Router = express.Router();

let storage = multer.memoryStorage();
let upload = multer({ storage });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("CONNECTION IS OPEN OOOOO");

  let bucket = new mongoose.mongo.GridFSBucket(connection.db);

  Router.get("/:imageId", (req, res) => {
    let { imageId } = req.params;
    let downlaodStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(imageId)
    );
    downlaodStream.on("file", (file) => {
      res.set("Content-Type", file.contentType);
    });
    downlaodStream.pipe(res);
  });

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
      res.setHeader("imageLink", uploadStream.id.toString());
      res.send({ message: "file was uploaded successfully" });
    } catch (e) {
      return res.status(404).send({ message: "error while saving", e: e });
    }
  });
});
export default Router;
