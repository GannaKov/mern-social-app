const express = require("express");
const cors = require("cors");
const app = express();
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
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//------------------
// const uploadDir = path.join(process.cwd(), "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); //uploadDir
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    console.log("req.body.name", req.body.name);
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});
const upload = multer({
  storage: storage,
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
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
