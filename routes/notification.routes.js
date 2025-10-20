const express = require('express');
const router = express.Router();
const { createNotification, getUserNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');


router.post('/', protect, createNotification);
router.get('/', protect, getUserNotifications);
router.put('/read/:id', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);
router.delete('/', protect, clearAllNotifications);

module.exports = router;