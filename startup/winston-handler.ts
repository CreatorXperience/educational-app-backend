import winston from "winston";

const winstonErrorhandler = () => {
  const exceptionHandler = winston.createLogger({
    transports: [new winston.transports.File({ filename: "combined.log" })],
    exceptionHandlers: [
      new winston.transports.File({ filename: "exceptions.log" }),
    ],
  });

  const rejectionHandler = winston.createLogger({
    level: "info",
    rejectionHandlers: [
      new winston.transports.File({ filename: "rejection.log" }),
    ],
  });
};

export default winstonErrorhandler;
