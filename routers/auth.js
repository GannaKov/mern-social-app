const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to authRouter");
});
// app.get("/users", (req, res) => {
//   res.send("Welcome to user");
// });

module.exports = router;
