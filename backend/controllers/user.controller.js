import bcrypt from 'bcryptjs';
import crypto from "crypto";
import User from '../models/users.model.js';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import {sendVerificationEmail} from '../utils/verification_mail.js'

export const signup = async (req, res) => {
  const { userMail, userName, password, passwordConfirm } = req.body;

  try {
    if (!userMail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const existingUser = await User.findOne({ userMail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const user = new User({
      userName,
      userMail,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000 // 10 mins
    });

    await user.save();

    try {
      await sendVerificationEmail(userMail, verificationCode);
    } catch (err) {
      console.error('Email send error:', err);
    }

    req.app.get('io')?.emit('userSignedUp', { id: user._id, userName: user.userName, userMail: user.userMail });

    res.status(201).json({ success: true, message: 'User created successfully. Please check your email to verify your account.', user: { id: user._id, userName, userMail } });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const login = async (req, res) => {
  const { userMail, password } = req.body;

  try {
    const user = await User.findOne({ userMail }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: "Please verify your email before logging in." });
    }



    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    req.app.get('io')?.emit('userLoggedIn', { id: user._id, userName: user.userName });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id: user._id, name: user.userName, email: user.userMail },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
  });

  if (req.user) {
    req.app.get('io')?.emit('userLoggedOut', { id: req.user._id });
  }

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid user' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');

    req.app.get('io')?.emit('userUpdated', { id: updatedUser._id, userName: updatedUser.userName });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie('token');

    req.app.get('io')?.emit('userDeleted', { id: req.user._id });

    res.status(200).json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyUser= async(req,res)=>{
try {
  const { userMail, code } = req.body;
  const user = await User.findOne({ userMail });


  if (!user) return res.status(400).json({ message: "User not found" });
  if (user.isVerified) return res.json({ message: "Already verified" });

  if (user.verificationCode !== code) {
    return res.status(400).json({ message: "Invalid code" });
  }

  if (user.verificationCodeExpires < Date.now()) {
    return res.status(400).json({ message: "Code expired" });
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
} catch (error) {
  console.error('Delete User Error:', error);
  res.status(500).json({ success: false, message: 'Server error' });
}
};

export const forgotPassword = async (req, res) => {
  try {
    const { userMail } = req.body;

    if (!userMail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ userMail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    try {
      await sendVerificationEmail(userMail, resetCode);
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({ message: "Failed to send email" });
    }

    res.json({ message: "Verification code sent to your email" });
  } catch (err) {
    console.error("Forgot Password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { userMail, code } = req.body;

    if (!userMail || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await User.findOne({ userMail });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.resetPasswordCode || !user.resetPasswordExpires) {
      return res.status(400).json({ message: "No reset request found" });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Code expired" });
    }

    if (user.resetPasswordCode !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const resetToken = jwt.sign(
      { id: user._id, purpose: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" } 
    );

    res.json({ message: "Code verified", resetToken });
  } catch (err) {
    console.error("verifyResetCode error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { userMail, newPassword, newPasswordConfirm } = req.body;

    if (!userMail) return res.status(400).json({ message: "Email is required" });
    if (!newPassword || !newPasswordConfirm) {
      return res.status(400).json({ message: "New password and confirmation are required" });
    }
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ userMail }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = new Date();

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
