const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    userId: Number,
    type: Sring,
    message: String,
    isRead: Boolean,
    createdAt
})