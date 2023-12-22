import mongoose from "mongoose";
import logger from "./winston-logger";

async function connectToMongoDB(mongoURI: string) {
  mongoose
    .connect(mongoURI)
    .then(() => logger.info(`connected successfully to ${mongoURI}`))
    .catch(() => {
      logger.error("error occured while connecting to mongodb");
    });
}

export { connectToMongoDB };
