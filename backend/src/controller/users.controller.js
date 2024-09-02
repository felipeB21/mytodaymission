import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

export const findUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username })
      .select(
        "-password -lastLogin -isVerified -email -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt"
      )
      .populate({
        path: "followers",
        select: "username name avatar",
      })
      .lean()
      .exec();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const posts = await Post.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select("videoUrl description likes comments createdAt")
      .populate({
        path: "comments.userId",
        select: "username name avatar",
      })
      .lean()
      .exec();

    const userWithPosts = {
      ...user,
      posts,
      followerCount: user.followers ? user.followers.length : 0,
    };

    return res
      .status(200)
      .json({ success: true, data: { user: userWithPosts } });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};
