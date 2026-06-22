const Task = require('../models/Task');
const Activity = require('../models/Activity');

// Helper to log user activities
const logActivity = async (userId, action, details, taskId) => {
  try {
    const currentUserId = userId._id || userId;
    if (global.isMongoConnected) {
      await Activity.create({
        action,
        details,
        taskId: taskId ? taskId.toString() : null,
        userId: currentUserId,
      });
    } else {
      const { readDB, writeDB } = require('../config/jsonDb');
      const db = readDB();
      const newActivity = {
        _id: Math.random().toString(36).substr(2, 9),
        action,
        details,
        taskId: taskId ? taskId.toString() : null,
        userId: currentUserId.toString(),
        createdAt: new Date().toISOString(),
      };
      db.activities.push(newActivity);
      writeDB(db);
    }
  } catch (err) {
    console.error('Failed to write activity audit log:', err);
  }
};

// @desc    Get user tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const { readDB } = require('../config/jsonDb');
      const db = readDB();
      const currentUserId = req.user._id || req.user.id;
      let userTasks = db.tasks.filter((t) => t.userId.toString() === currentUserId.toString());

      // Filtering by search text
      if (req.query.search) {
        const term = req.query.search.toLowerCase();
        userTasks = userTasks.filter(
          (t) =>
            t.title.toLowerCase().includes(term) ||
            (t.description && t.description.toLowerCase().includes(term))
        );
      }

      // Filtering by status
      if (req.query.status) {
        userTasks = userTasks.filter((t) => t.status === req.query.status);
      }

      // Filtering by priority
      if (req.query.priority) {
        userTasks = userTasks.filter((t) => t.priority === req.query.priority);
      }

      // Sorting options
      if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        const key = parts[0];
        const desc = parts[1] === 'desc';
        userTasks.sort((a, b) => {
          const valA = a[key] || '';
          const valB = b[key] || '';
          if (valA < valB) return desc ? 1 : -1;
          if (valA > valB) return desc ? -1 : 1;
          return 0;
        });
      } else {
        // default sorting by newest
        userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.status(200).json(userTasks);
    }

    const query = { userId: req.user.id };

    // Filtering by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filtering by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Search query on title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // default sorting
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sortOption = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
    }

    const tasks = await Task.find(query).sort(sortOption);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const currentUserId = req.user._id || req.user.id;

    if (!global.isMongoConnected) {
      const { readDB, writeDB } = require('../config/jsonDb');
      const db = readDB();
      const newTask = {
        _id: Math.random().toString(36).substr(2, 9),
        title,
        description: description || '',
        status: status || 'Pending',
        priority: priority || 'Medium',
        dueDate,
        userId: currentUserId.toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.tasks.push(newTask);
      writeDB(db);
      
      // Log Activity
      await logActivity(currentUserId, 'Created', `Task "${title}" was created`, newTask._id);
      
      return res.status(201).json(newTask);
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate,
      userId: req.user.id,
    });

    // Log Activity
    await logActivity(currentUserId, 'Created', `Task "${title}" was created`, task._id);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const currentUserId = req.user._id || req.user.id;

    if (!global.isMongoConnected) {
      const { readDB, writeDB } = require('../config/jsonDb');
      const db = readDB();
      const taskIndex = db.tasks.findIndex((t) => t._id === req.params.id);

      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (db.tasks[taskIndex].userId.toString() !== currentUserId.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this task' });
      }

      const task = db.tasks[taskIndex];
      const oldStatus = task.status;
      
      task.title = title !== undefined ? title : task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status !== undefined ? status : task.status;
      task.priority = priority !== undefined ? priority : task.priority;
      task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
      task.updatedAt = new Date().toISOString();

      db.tasks[taskIndex] = task;
      writeDB(db);

      // Log Activity
      if (status !== undefined && status !== oldStatus) {
        await logActivity(currentUserId, 'Status Changed', `Task "${task.title}" status changed from "${oldStatus}" to "${task.status}"`, task._id);
      } else {
        await logActivity(currentUserId, 'Updated', `Task "${task.title}" details were updated`, task._id);
      }

      return res.status(200).json(task);
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    const oldStatus = task.status;

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status !== undefined ? status : task.status;
    task.priority = priority !== undefined ? priority : task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    const updatedTask = await task.save();

    // Log Activity
    if (status !== undefined && status !== oldStatus) {
      await logActivity(currentUserId, 'Status Changed', `Task "${task.title}" status changed from "${oldStatus}" to "${task.status}"`, task._id);
    } else {
      await logActivity(currentUserId, 'Updated', `Task "${task.title}" details were updated`, task._id);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id;

    if (!global.isMongoConnected) {
      const { readDB, writeDB } = require('../config/jsonDb');
      const db = readDB();
      const task = db.tasks.find((t) => t._id === req.params.id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (task.userId.toString() !== currentUserId.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this task' });
      }

      db.tasks = db.tasks.filter((t) => t._id !== req.params.id);
      writeDB(db);

      // Log Activity
      await logActivity(currentUserId, 'Deleted', `Task "${task.title}" was deleted`, req.params.id);

      return res.status(200).json({ id: req.params.id, message: 'Task removed successfully' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    const deletedTitle = task.title;
    await Task.findByIdAndDelete(req.params.id);

    // Log Activity
    await logActivity(currentUserId, 'Deleted', `Task "${deletedTitle}" was deleted`, req.params.id);

    res.status(200).json({ id: req.params.id, message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
