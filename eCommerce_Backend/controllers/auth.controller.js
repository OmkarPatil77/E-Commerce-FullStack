import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateToken } from "../utils/jwt.js";
import { isValidEmail } from "../utils/validators.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Register Controller
export const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    if (!isValidEmail(email)) {
      throw new ApiError(400, "Please enter a valid email address (e.g., xyz@gmail.com)");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role === "ADMIN" ? "ADMIN" : "USER",
    });

    const token = generateToken(user);

    res.status(201).json(
      new ApiResponse(
        201, 
        {
          token,
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        "User registered successfully",
      )
    );
  } catch (error) {
    next(error);
  }
};

// Login Controller
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    if (!isValidEmail(email)) {
      throw new ApiError(400, "Please enter a valid email address");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "Account does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Incorrect password");
    }

    const token = generateToken(user);

    res.status(200).json(
      new ApiResponse(
        200, 
        {
          token,
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        "Login successful",
      )
    );
  } catch (error) {
    next(error);
  }
};

// Logout Controller
export const logout = async (req, res, next) => {
  try {
    // Nothing to do on backend, using localStorage

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      throw new ApiError(400, "Please enter a valid email address");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "No user found with this email");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_BASE_URL}/reset-password/${resetToken}`;

    // Later: send resetURL via email
    res.status(200).json(
      new ApiResponse(200, {
        message: "Password reset link generated successfully",
        resetURL,
      })
    );
  } catch (error) {
    next(error);
  }
};

// Reset Password Controller
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      throw new ApiError(400, "Token and new password are required");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Token is invalid or has expired");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json(
      new ApiResponse(200, {
        message: "Password reset successful. You can now log in.",
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get User Profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
  } catch (error) {
    next(error);
  }
};

// Update User Profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.status(200).json(
      new ApiResponse(200, {
        id: user._id,
        username: user.username,
        email: user.email,
        // role: user.role, NO USE OF THIS LINE FOR NOW !
      }, "User profile updated")
    );
  } catch (error) {
    next(error);
  }
};
