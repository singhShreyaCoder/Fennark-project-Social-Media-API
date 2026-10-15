import Post from "../models/postModel.js";

// Like a post
export async function likePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user.userId;

    // Prevent duplicate likes
    if (post.likes.some((id) => id.toString() === userId.toString())) {
      return res.status(400).json({
        message: "You have already liked this post",
      });
    }

    post.likes.push(userId);
    await post.save();

    return res.status(200).json({
      message: "Post liked successfully",
      likesCount: post.likes.length,
      post,
    });
  } catch (error) {
    console.error("Error liking post:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Unlike a post
export async function unlikePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user.userId;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString(),
    );

    if (!alreadyLiked) {
      return res.status(400).json({
        message: "You have not liked this post",
      });
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());

    await post.save();

    return res.status(200).json({
      message: "Post unliked successfully",
      likesCount: post.likes.length,
      post,
    });
  } catch (error) {
    console.error("Error unliking post:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
