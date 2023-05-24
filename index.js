const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs").promises;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();
const userRouter = require("./routers/users");
const authRouter = require("./routers/auth");
const postRouter = require("./routers/posts");
const multer = require("multer");
const path = require("path");
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
app.use("/images", express.static(path.join(__dirname, "public/images")));
const storeImage = path.join(path.join(__dirname, "public/images"));

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//------------------

// const fileSuf = Date.now();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); //uploadDir//"public/images"
  },
  filename: (req, file, cb) => {
    // console.log("file.originalname", fileSuf + file.originalname);
    cb(null, file.originalname); //file.originalname//req.body.name
  },
  limits: {
    fileSize: 1048576,
  },
});
const upload = multer({
  storage: storage,
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);
  console.log("storeImage", storeImage);
  const { name } = req.body;
  const { path: temporaryName } = req.file;
  const fileName = path.join(storeImage, name);
  console.log("fileName", fileName); //
  try {
    await fs.rename(temporaryName, fileName);
    return res.status(200).json("File uploaded successfully");
  } catch (err) {
    console.log(err);
  }
});
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
// ------------------
app.use((req, res) => {
  console.log("app.use 1");
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log("app.use 2");
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
