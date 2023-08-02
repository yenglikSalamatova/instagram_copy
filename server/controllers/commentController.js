const User = require("../models/User");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Controller function for adding a comment to a post
const addCommentToPost = async (req, res) => {
  try {
    const { text, PostId } = req.body;
    const userId = req.user.id; // Assuming you have implemented authentication and have user data available in req.user

    // Check if the post exists
    const post = await Post.findOne({ where: { id: PostId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create the comment
    const comment = await Comment.create({
      text,
      UserId: userId, // Associate the comment with the user who made it
      PostId: PostId, // Associate the comment with the post it belongs to
    });
    // Optionally, you can associate the comment with the user and post models
    const user = await User.findOne({ where: { id: userId } });
    const postToUpdate = await Post.findOne({ where: { id: PostId } });

    if (user && postToUpdate) {
      await comment.setUser(user);
      await comment.setPost(postToUpdate);
    }
    return res
      .status(201)
      .json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addCommentToPost,
};
