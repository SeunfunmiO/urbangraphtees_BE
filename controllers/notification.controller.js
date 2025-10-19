const notificationModel = require('../models/notification.model.js');

const createNotification = async (req, res) => {
  try {
    const { message, type } = req.body;
    const userId = req.user._id;

    const notification = await notificationModel.create({
      userId,
      message,
      type: type || 'info'
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await notificationModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await notificationModel.updateMany({ userId }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await notificationModel.deleteMany({ userId });
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
};