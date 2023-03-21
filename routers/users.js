const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Welcome to userRouter");
});
// app.get("/users", (req, res) => {
//   res.send("Welcome to user");
// });
module.exports = router;
