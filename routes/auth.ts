import { Router } from "express";
import userAuth from "../utils/user/userAuth";

const router = Router();

router.post("/", (req, res) => {
  userAuth(req.body, res);
});

export default router;
