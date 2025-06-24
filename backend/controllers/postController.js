

const Post = require("../models/Post");
const mongoose = require("mongoose");

// GET all posts
exports.getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// CREATE new post
exports.create = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { content } = req.body;
    const imageUrl = req.file?.path || null; // fallback if no file

    const newPost = await Post.create({ content, imageUrl });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(" Error creating post:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


// LIKE post
exports.like = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes += 1;
    // post.dislikes = Math.max(0, post.dislikes - 1); // Decrease dislike if any
    await post.save();

    res.json({ likes: post.likes, dislikes: post.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Failed to like post" });
  }
};



// DISLIKE post
exports.dislike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.dislikes += 1;
    // post.likes = Math.max(0, post.likes - 1); // Decrease like if any
    await post.save();

    res.json({ likes: post.likes, dislikes: post.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Failed to dislike post" });
  }
};

//REMOVE POST
exports.remove = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};

//ADD COMMENT 
exports.addComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = { text };
    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

//  Edit Comment
exports.editComment =  async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: "Invalid ID(s)" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.text = text;
    await post.save();

    res.json({ message: "Comment updated", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to edit comment" });
  }
};

//  Delete Comment
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: "Invalid ID(s)" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

   post.comments.pull(commentId); 
    await post.save();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

