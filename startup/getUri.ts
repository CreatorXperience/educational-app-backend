import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv"
dotenv.config()

let mongoServer: MongoMemoryServer;

const mockServerURI = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  return mongoUri;
};

const getUri = async (connect: (uri: string) => Promise<void>) => {
  let uri: string =
    process.env.NODE_ENV === "test"
      ? await mockServerURI()
      : (process.env.URI as string);

      console.log(uri)
  connect(uri);
  return mongoServer;
};

export default getUri;
