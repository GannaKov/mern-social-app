const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
//REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = User({
    username: username,
    email: email,
    password: password,
  });
  try {
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});
// app.get("/users", (req, res) => {
//   res.send("Welcome to user");
// });

module.exports = router;
