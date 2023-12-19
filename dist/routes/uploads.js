"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const fileschema_1 = __importDefault(require("../models/fileschema"));
const stream_1 = require("stream");
const Router = express_1.default.Router();
let storage = multer_1.default.memoryStorage();
let upload = (0, multer_1.default)({ storage });
const connection = mongoose_1.default.connection;
connection.once("open", () => {
    console.log("CONNECTION IS OPEN OOOOO");
    let bucket = new mongoose_1.default.mongo.GridFSBucket(connection.db);
    Router.get("/:imageId", (req, res) => {
        let { imageId } = req.params;
        let downlaodStream = bucket.openDownloadStream(new mongoose_1.default.Types.ObjectId(imageId));
        downlaodStream.on("file", (file) => {
            res.set("Content-Type", file.contentType);
        });
        downlaodStream.pipe(res);
    });
    Router.post("/", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { file } = req;
        //   @ts-ignore
        let { fieldname, originalname, mimetype, buffer } = file;
        let newFile = new fileschema_1.default({
            contentType: mimetype,
            filename: originalname,
            length: buffer.length,
        });
        let uploadStream = bucket.openUploadStream(fieldname);
        let Reader = new stream_1.Readable();
        Reader.push(buffer);
        Reader.push(null);
        try {
            yield new Promise((resolve, reject) => {
                Reader.pipe(uploadStream).on("finish", resolve).on("error", reject);
            });
            newFile.id = uploadStream.id;
            let savedFile = yield newFile.save();
            if (!savedFile) {
                return res.status(404).send({ message: "error while saving file" });
            }
            res.setHeader("imageLink", uploadStream.id.toString());
            res.send({ message: "file was uploaded successfully" });
        }
        catch (e) {
            return res.status(404).send({ message: "error while saving", e: e });
        }
    }));
});
exports.default = Router;
