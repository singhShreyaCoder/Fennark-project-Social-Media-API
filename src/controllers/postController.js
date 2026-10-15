import Post from "../models/postModel.js";

export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPost controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPostById(req, res) {
  try {
    const findPost = await Post.findById(req.params.id);
    if (!findPost) res.status(404).json({ message: "Post Not Found" });
    res.status(200).json(findPost);
  } catch (error) {
    console.log("Error in getPostById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createPost(req, res) {
  try {
    const { image, content } = req.body;

    const newPost = new Post({
      image: image,
      content: content,
      author: req.user.userId,
    });

    await newPost.save();

    console.log("Post created successfully");

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.log("Error in createPost controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePost(req, res) {
  try {
    const { image, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check post ownership
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    if (image !== undefined) post.image = image;
    if (content !== undefined) post.content = content;

    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check post ownership
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
