import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import initializePassport from "./passportConfig";

import indexRouter from "./routes/index";

dotenv.config();

const app: Application = express();

// MongoDB Setup
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL as string);
}

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
initializePassport(passport);

app.use("/", indexRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("hey app is listening");
});

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json("error");
});

export default app;
