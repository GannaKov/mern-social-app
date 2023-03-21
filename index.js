const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();
const userRouter = require("./routers/users");
const authRouter = require("./routers/auth");
// ---------------------
const { DB_HOST } = process.env;
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(8800);
    console.log("Backend server is running");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
