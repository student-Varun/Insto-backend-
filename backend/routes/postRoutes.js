const express = require("express");
const multer = require("multer");
const { getAll, create, like, dislike,remove,addComment,
  editComment,
  deleteComment, } = require("../controllers/postController");
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

const router = express.Router();

router.get("/", getAll);
router.post("/", upload.single("image"), create);
router.patch("/:id/like", like);
router.patch("/:id/dislike", dislike);
router.delete("/:id", remove); // 🔥 New route



// COMMENT ROUTES
router.post("/:id/comments", addComment);
router.patch("/:postId/comments/:commentId", editComment);
router.delete("/:postId/comments/:commentId", deleteComment);

module.exports = router;
