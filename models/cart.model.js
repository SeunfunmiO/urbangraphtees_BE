const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            // name: { type: String, required: true },
            // price: { type: Number, required: true },
            // images: [{ url: String, public_id: String }],
            // sizes: { type: String, required: true },
            // colors: { type: String, required: true },
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
}, { timestamps: true });

let cartModel = mongoose.model('Cart', cartSchema)
module.exports = cartModel;
