import { Post } from "../models/Post.js";
import upload from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  upload.single("video")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file uploaded.",
      });
    }

    const { description } = req.body;
    const videoUrl = req.file.path;

    if (!videoUrl) throw new Error("Video is required");

    try {
      const newPost = new Post({
        videoUrl,
        description,
        userId: req.userId,
      });
      await newPost.save();

      const populatedPost = await Post.findById(newPost._id)
        .populate({
          path: "userId",
          select: "-email -password -lastLogin -isVerified",
        })
        .exec();

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: populatedPost,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name username avatar"); // Add other fields you want from the User model

    if (!posts.length)
      return res
        .status(400)
        .json({ success: false, message: "Posts not available" });

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
