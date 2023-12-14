import winston from "winston";

const expressLogger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({ filename: "Expresslogger.log" }),
    new winston.transports.Console(),
  ],
});

export default expressLogger;
