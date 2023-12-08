import express, { Request, Response, Application } from "express";
import config from "config";
// import dotenv from "dotenv";
// dotenv.config();
import { connectToMongoDB } from "./startup/db";
import courses from "./routes/course";
import users from "./routes/user";
import auth from "./routes/auth";

const app: Application = express();

const port = config.get("port");

connectToMongoDB();

app.listen(port, () => {
  console.log(`it has been connected to port ${port}`);
});

if (!config.get("edu-secret-key")) {
  // throw new Error("No key provided");
  process.exit(1);
}

app.use(express.json());
app.use("/api/courses", courses);
app.use("/auth/users", users);
app.use("/auth/user", auth);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});
