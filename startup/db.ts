import mongoose from "mongoose";
import config from "config";

let uri: string = config.get("db");

async function connectToMongoDB() {
  mongoose
    .connect(uri)
    .then(() => console.log(`connected successfully to ${uri}`))
    .catch(() => {
      console.log("error occured while connecting to mongodb");
    });
}

export { connectToMongoDB };
