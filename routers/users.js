const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("../models/user");
const HttpError = require("../helpers/HttpError");
// ------------------------------------

//Update User
router.put("/:id", async (req, res, next) => {
  //   const { userId } = req.params;
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      if (!user) {
        throw HttpError(404, "Not found");
      }
      res.status(200).json(user); //"Account has been updated",
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});
// Delete User
router.delete("/:id", async (req, res, next) => {
  //   const { userId } = req.params;
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.id });
      console.log("user", user);
      console.log("req.params.id", req.params.id);
      if (!user) {
        throw HttpError(404, "Not found");
      }
      res.status(200).json("Account has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});
//get a User
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("userId", id);
    const user = await User.findOne({ _id: id });

    console.log("user.id", user);
    // const { password, updatedAt, ...other } = user._doc;
    if (!user) {
      throw HttpError(404, "Not found ");
    }
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
