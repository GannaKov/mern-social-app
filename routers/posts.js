const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("../models/user");
const { Post } = require("../models/post");
const HttpError = require("../helpers/HttpError");
//-----------------------------
// async function findUser(userId) {
//   const user = await User.findOne({ _id: userId });
//   // console.log("user.id", user);
// }

//create a post !check User?
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

//update a post!check User
router.put("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw HttpError(404, "Not found");
    }
    //-----
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw HttpError(404, "User not found ");
    }
    //------
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
//delete a post !check User
router.delete("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw HttpError(404, "Not found");
    }
    //-----
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw HttpError(404, "User not found ");
    }
    //------
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

//like / dislike a post !check exist User
router.put("/:id/like", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw HttpError(404, "Not found");
    }
    //-----
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw HttpError(404, "User not found ");
    }
    //------
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    next(err);
  }
});

//get a post
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

//get timeline posts !change current user, sort posts
router.get("/timeline/:userId", async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    if (!currentUser) {
      throw HttpError(404, "User not found ");
    }
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts)); //res.status(200).json([...userPosts, ...friendPosts]);
  } catch (err) {
    next(err);
  }
});
//get user's all posts !
router.get("/profile/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});
//--------------------------
module.exports = router;
