const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const handleMongooseError = require("../helpers/handleMongooseError");
//-----------------------------------
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
postSchema.post("save", handleMongooseError);
const Post = model("post", postSchema);
module.exports = { Post };
