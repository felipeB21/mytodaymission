import { User } from "../models/User.js";
import crypto from "crypto";
import { hash, compare } from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/token.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

export const createUser = async (req, res) => {
  const { email, name, username, password } = req.body;
  try {
    if (!email || !name || !username || !password) {
      throw new Error("All inputs are required");
    }

    if (username.includes(" ") || username.length < 2 || username.length > 20) {
      throw new Error(
        "Username must not contain spaces and must be between 2 and 20 characters long"
      );
    }
    if (password.includes(" ") || password.length < 6 || password.length > 50) {
      throw new Error(
        "Password must not contain spaces and must be between 6 and 50 characters long"
      );
    }

    const emailAlreadyExists = await User.findOne({
      email,
    });
    if (emailAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const usernameAlreadyExists = await User.findOne({
      username,
    });
    if (usernameAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await hash(password, 10);

    const createUser = await User.create({
      email,
      name,
      username,
      password: hashedPassword,
    });

    await createUser.save();

    generateTokenAndSetCookie(res, createUser._id);

    res.status(201).json({
      success: true,
      message: "User created",
      data: {
        createUser: {
          ...createUser._doc,
          password: undefined,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    if (!code) throw new Error("Code is required");
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) throw new Error("All inputs are required");

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: "Logged in succesfully",
      data: {
        user: {
          ...user._doc,
          password: undefined,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out succesfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) throw new Error("Email is required");
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiredAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiredAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (!password) throw new Error("Password is required");
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });

    const hashedPassword = await hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    return res
      .status(200)
      .json({ success: true, message: "Password reset succesfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          ...user._doc,
          password: undefined,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
