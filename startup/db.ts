import mongoose from "mongoose";
import logger from "./winston-logger";
import { app } from "..";
import dotenv from "dotenv";
dotenv.config();

async function connectToMongoDB(mongoURI: string) {
  const port = process.env.PORT || 3030;
  mongoose
    .connect(mongoURI)
    .then(() => {
      if (process.env.NODE_ENV !== "test") {
        app.listen(port, () => {
          logger.info(`it has been connected to port ${port}`);
        });
      }
      logger.info(`connected successfully to ${mongoURI}`);
    })
    .catch(() => {
      logger.error("error occured while connecting to mongodb");
    });
}

export { connectToMongoDB };
