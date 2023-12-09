import mongoose from "mongoose";

async function connectToMongoDB(mongoURI: string) {
  if (process.env.NODE_ENV === "test") {
    await mongoose.connect(mongoURI);
    return;
  }
  mongoose
    .connect(mongoURI)
    .then(() => console.log(`connected successfully to ${mongoURI}`))
    .catch(() => {
      console.log("error occured while connecting to mongodb");
    });
}

export { connectToMongoDB };
