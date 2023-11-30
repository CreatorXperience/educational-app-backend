import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import courses from "./routes/course";
import { connectToMongoDB } from "./startup/db";
import userRouter from "./routes/user";

const app: Application = express();

const port = process.env.PORT;

connectToMongoDB();

app.listen(port, () => {
  console.log(`it has been connected to port ${port}`);
});

app.use(express.json());
app.use("/api/courses", courses);
app.use("/auth/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});
