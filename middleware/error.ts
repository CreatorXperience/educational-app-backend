import { Errback, NextFunction, Request, Response } from "express";
import winston from "winston";

const error = (
  err: Errback,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errLogger = winston.createLogger({
    level: "info",
    transports: [
      new winston.transports.File({
        filename: "errorLogger.log",
      }),
    ],
  });

  errLogger.error("error:", err);
};

export default error;
