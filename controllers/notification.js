const Notification = require('../models/Notifications');
const User = require('../models/User');

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) throw new Error('Notification not found');

    // Check if the notification belongs to the user
    if (notification.userId.toString() !== req.user.id) {
      throw new Error('Not authorized to mark this notification as read');
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) throw new Error('Notification not found');

    // Check if the notification belongs to the user
    if (notification.userId.toString() !== req.user.id) {
      throw new Error('Not authorized to delete this notification');
    }

    await notification.remove();
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
