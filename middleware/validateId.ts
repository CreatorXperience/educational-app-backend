import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const validateId = (req: Request, res: Response, next: NextFunction) => {
  let { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({ message: "Invalid object id" });
  }
  next();
};

export default validateId;
