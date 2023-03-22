const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const HttpError = require("../helpers/HttpError");
// ---------------------------------
//REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});
// -----------------------
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "user not found");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw HttpError(401, "wrong password");
    }
    // !user && res.status(404).json("user not found");
    // const validPassword = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );

    // !validPassword && res.status(400).json("wrong password");

    // res.status(200).json(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
module.exports = router;
