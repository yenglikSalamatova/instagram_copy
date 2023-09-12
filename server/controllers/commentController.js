const User = require("../models/User");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
require("../models/associations");

const addCommentToPost = async (req, res) => {
  try {
    console.log(req.body);

    const post = await Post.findOne({ where: { id: req.body.postId } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log(post);

    const comment = await Comment.create({
      text: req.body.text,
      userId: req.user.id,
      postId: req.body.postId,
    });

    return res
      .status(201)
      .json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }

    await comment.destroy();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCommentBypostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.findAll({
      where: {
        postId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "password",
              "isVerified",
              "phone",
              "email",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });
    if (!comments) {
      return res.status(404).json({ error: "Comments not found" });
    }
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error when get all comments by postId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addCommentToPost,
  deleteComment,
  getAllCommentBypostId,
};
