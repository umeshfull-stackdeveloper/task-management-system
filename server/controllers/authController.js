const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'taskflow_jwt_secret_dev_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Fallback if MongoDB is offline
    if (!global.isMongoConnected) {
      const { readDB, writeDB } = require('../config/jsonDb');
      const bcrypt = require('bcryptjs');
      const db = readDB();
      const userExists = db.users.find((u) => u.email.trim().toLowerCase() === normalizedEmail);

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: Math.random().toString(36).substr(2, 9),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        avatar: '/avatars/avatar1.png',
        defaultPriority: 'Medium',
        emailAlerts: true,
        dueReminders: true,
        createdAt: new Date().toISOString(),
      };

      db.users.push(newUser);
      writeDB(db);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        defaultPriority: newUser.defaultPriority,
        emailAlerts: newUser.emailAlerts,
        dueReminders: newUser.dueReminders,
        token: generateToken(newUser._id),
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Fallback if MongoDB is offline
    if (!global.isMongoConnected) {
      const { readDB } = require('../config/jsonDb');
      const bcrypt = require('bcryptjs');
      const db = readDB();
      const user = db.users.find((u) => u.email.trim().toLowerCase() === normalizedEmail);

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '/avatars/avatar1.png',
          defaultPriority: user.defaultPriority || 'Medium',
          emailAlerts: user.emailAlerts !== undefined ? user.emailAlerts : true,
          dueReminders: user.dueReminders !== undefined ? user.dueReminders : true,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    // Check for user email
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userObj = req.user.toObject ? req.user.toObject() : { ...req.user };
    userObj.dbType = global.isMongoConnected ? 'MongoDB Cloud Atlas' : 'Local JSON Database Fallback';
    res.status(200).json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, avatar, defaultPriority, emailAlerts, dueReminders } = req.body;

    // Fallback if MongoDB is offline
    if (!global.isMongoConnected) {
      const { readDB, writeDB } = require('../config/jsonDb');
      const db = readDB();
      const userId = req.user._id || req.user.id;

      const userIndex = db.users.findIndex((u) => u._id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = {
        ...db.users[userIndex],
        name: name !== undefined ? name : db.users[userIndex].name,
        avatar: avatar !== undefined ? avatar : db.users[userIndex].avatar,
        defaultPriority: defaultPriority !== undefined ? defaultPriority : db.users[userIndex].defaultPriority,
        emailAlerts: emailAlerts !== undefined ? emailAlerts : db.users[userIndex].emailAlerts,
        dueReminders: dueReminders !== undefined ? dueReminders : db.users[userIndex].dueReminders,
      };

      db.users[userIndex] = updatedUser;
      writeDB(db);

      const { password, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    }

    // MongoDB update path
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (defaultPriority !== undefined) user.defaultPriority = defaultPriority;
    if (emailAlerts !== undefined) user.emailAlerts = emailAlerts;
    if (dueReminders !== undefined) user.dueReminders = dueReminders;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar || '/avatars/avatar1.png',
      defaultPriority: updatedUser.defaultPriority,
      emailAlerts: updatedUser.emailAlerts,
      dueReminders: updatedUser.dueReminders,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - Request reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpire = Date.now() + 3600000; // 1 hour expiry

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Fallback if MongoDB is offline
    if (!global.isMongoConnected) {
      const { readDB, writeDB } = require('../config/jsonDb');
      const db = readDB();
      const userIndex = db.users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

      if (userIndex === -1) {
        return res.status(404).json({ message: 'No user found with that email address' });
      }

      db.users[userIndex].resetPasswordToken = resetToken;
      db.users[userIndex].resetPasswordExpire = new Date(resetExpire).toISOString();
      writeDB(db);

      console.log(`\n=== 🔑 PASSWORD RESET REQUEST (JSON DB Fallback) ===`);
      console.log(`User Email: ${email}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log(`====================================================\n`);

      return res.status(200).json({
        success: true,
        message: 'Password reset link generated. Check the server console or see details below.',
        token: resetToken,
        resetUrl,
      });
    }

    // MongoDB path
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address' });
    }

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetExpire;
    await user.save();

    console.log(`\n=== 🔑 PASSWORD RESET REQUEST (MongoDB) ===`);
    console.log(`User Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`============================================\n`);

    return res.status(200).json({
      success: true,
      message: 'Password reset link generated. Check the server console or see details below.',
      token: resetToken,
      resetUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Fallback if MongoDB is offline
    if (!global.isMongoConnected) {
      const { readDB, writeDB } = require('../config/jsonDb');
      const bcrypt = require('bcryptjs');
      const db = readDB();

      const userIndex = db.users.findIndex(
        (u) =>
          u.resetPasswordToken === token &&
          u.resetPasswordExpire &&
          new Date(u.resetPasswordExpire).getTime() > Date.now()
      );

      if (userIndex === -1) {
        return res.status(400).json({ message: 'Invalid or expired password reset token' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.users[userIndex].password = hashedPassword;
      db.users[userIndex].resetPasswordToken = undefined;
      db.users[userIndex].resetPasswordExpire = undefined;
      writeDB(db);

      return res.status(200).json({
        success: true,
        message: 'Password has been reset successfully. Please sign in with your new password.',
      });
    }

    // MongoDB path
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Update password (pre-save hook hashes it automatically)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. Please sign in with your new password.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
};
