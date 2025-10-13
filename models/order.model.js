const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Product'
            },
            quantity: Number,
            price: Number
        }
    ],
    total: Number,
    status: { type: String, default: 'Pending Payment' }
}, { timeStamps: true })

let orderModel = mongoose.model('Order', orderSchema)

module.exports = orderModel