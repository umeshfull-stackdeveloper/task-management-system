const Activity = require('../models/Activity');

// @desc    Get user activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id;

    if (!global.isMongoConnected) {
      const { readDB } = require('../config/jsonDb');
      const db = readDB();
      const userActivities = db.activities
        .filter((a) => a.userId.toString() === currentUserId.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(userActivities.slice(0, 50)); // limit to latest 50
    }

    const activities = await Activity.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActivities,
};
