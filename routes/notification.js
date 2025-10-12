const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require('../controllers/notification');

router.get('/', protect, getNotifications);
router.put('/:notificationId/mark-as-read', protect, markAsRead);
router.delete('/:notificationId', protect, deleteNotification);

module.exports = router;
