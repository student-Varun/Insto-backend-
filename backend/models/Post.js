// const mongoose = require("mongoose");
// const postSchema = new mongoose.Schema({

  
//   content: { type: String, required: true },
//   imageUrl: { type: String },
//   likes: { type: Number, default: 0 },
//   dislikes: { type: Number, default: 0 },
// }, { timestamps: true });

// module.exports = mongoose.model("Post", postSchema);

// models/Post.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema({
  content: String,
  imageUrl: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [commentSchema],
});

module.exports = mongoose.model("Post", postSchema);

