import { connectToMongoDB } from "./db";
import getUri from "./getUri";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
dotenv.config();

async function setupServer(port: string | undefined | number) {
  let mongoServer: MongoMemoryServer = await getUri(connectToMongoDB);

  return mongoServer;
}

export default setupServer;
