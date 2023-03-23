const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("../models/user");
const { Post } = require("../models/post");
const HttpError = require("../helpers/HttpError");
//-----------------------------
//create a post

router.post("/", async (req, res, next) => {
  try {
    // const { _id: owner } = req.user;
    // console.log(req.user);
    const savedPost = await Post.create(req.body);
    res.status(200).json(savedPost);
  } catch (err) {
    next(err);
  }
});

//update a post
router.put("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const result = await post.updateOne({ $set: req.body });
      if (!result) {
        throw HttpError(404, "Not found ");
      }
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    next(err);
  }
});
//delete a post
router.delete("/:id", async (req, res, next) => {
  console.log("id", req.params.id);
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    console.log("id", req.params.id);
    next(err);
  }
});
//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//--------------------------
module.exports = router;
