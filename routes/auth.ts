import { Router } from "express";
import userAuth from "../utils/user/userAuth";

const router = Router();

router.post("/", (req, res) => {
  let user = userAuth(req.body, res);
});

export default router;
