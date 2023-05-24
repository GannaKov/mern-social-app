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
        next(err);
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
router.get("/", async (req, res, next) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    // const { id } = req.params;

    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    if (!user) {
      throw HttpError(404, "Not found ");
    }
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    next(err);
  }
});

//follow a user
router.put("/:id/follow", async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw HttpError(404, "Not found ");
      }

      const currentUser = await User.findById(req.body.userId);
      if (!currentUser) {
        throw HttpError(404, "Not found ");
      }
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw HttpError(404, "Not found ");
      }

      const currentUser = await User.findById(req.body.userId);
      if (!currentUser) {
        throw HttpError(404, "Not found ");
      }
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you are not following this user");
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.status(403).json("you can't unfollow yourself");
  }
});
module.exports = router;
