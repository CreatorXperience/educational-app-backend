import mongoose from "mongoose";

let uri = process.env.URI as string;

async function connectToMongoDB() {
  mongoose
    .connect(uri)
    .then(() => console.log("connected successfully"))
    .catch(() => {
      console.log("error occured while connecting to mongodb");
    });
}

export { connectToMongoDB };
