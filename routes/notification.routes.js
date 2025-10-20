const express = require('express');
const router = express.Router();
const { createNotification, getUserNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications, markAsUnread } = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');


router.post('/', protect, createNotification);
router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/unread', protect, markAsUnread);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);
router.delete('/clear-all', protect, clearAllNotifications);

module.exports = router;