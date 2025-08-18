import bcrypt from 'bcryptjs';
import User from '../models/users.model.js';
import jwt from 'jsonwebtoken';

// ---------------- Signup ----------------
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
    const user = new User({ userName, userMail, password: hashedPassword });
    await user.save();

    // Emit event via Socket.IO
    req.app.get('io')?.emit('userSignedUp', { id: user._id, userName: user.userName, userMail: user.userMail });

    res.status(201).json({ success: true, message: 'User created successfully', user: { id: user._id, userName, userMail } });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// controllers/user.controller.js

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

// ---------------- Logout ----------------
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

// ---------------- Get Current User ----------------
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

// ---------------- Update User ----------------
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

// ---------------- Delete User ----------------
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
