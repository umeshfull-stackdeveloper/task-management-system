const jwt = require('jsonwebtoken');
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

    // Fallback if MongoDB is offline
    if (!global.isMongoConnected) {
      const { readDB, writeDB } = require('../config/jsonDb');
      const bcrypt = require('bcryptjs');
      const db = readDB();
      const userExists = db.users.find((u) => u.email === email);

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: Math.random().toString(36).substr(2, 9),
        name,
        email,
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
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
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

    // Fallback if MongoDB is offline
    if (!global.isMongoConnected) {
      const { readDB } = require('../config/jsonDb');
      const bcrypt = require('bcryptjs');
      const db = readDB();
      const user = db.users.find((u) => u.email === email);

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
    const user = await User.findOne({ email });

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

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
