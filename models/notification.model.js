const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['success', 'info', 'warning', 'error'], 
    default: 'info' 
  },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const notificationModel = mongoose.model('Notification', notificationSchema);
module.exports = notificationModel; 