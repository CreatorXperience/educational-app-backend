import { Application } from "express";
import { connectToMongoDB } from "./db";
import getUri from "./getUri";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
dotenv.config();

async function setupServer(app: Application, port: string | undefined) {
  let mongoServer: MongoMemoryServer = await getUri(connectToMongoDB);

  if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
      console.log(`it has been connected to port ${port}`);
    });
  }

  return mongoServer;
}

export default setupServer;
