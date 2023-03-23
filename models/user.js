const { Schema, model } = require("mongoose");

// ----------------------------
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      minLength: [6, "Password must be at least 6 digits"],
      required: [true, "Password is required"],
    },
    profilelPicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { versionKey: false, timestamps: true }
);
const User = model("user", userSchema);
module.exports = { User };
// module.exports = mongoose.model("User", UserSchema);
