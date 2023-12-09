import mongoose from "mongoose";

async function connectToMongoDB(mongoURI: string) {
  mongoose
    .connect(mongoURI)
    .then(() => console.log(`connected successfully to ${mongoURI}`))
    .catch(() => {
      console.log("error occured while connecting to mongodb");
    });
}

export { connectToMongoDB };
