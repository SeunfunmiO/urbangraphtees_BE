const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            images: [{ url: String, public_id: String }],
            selectedSize: {
                type: String,
            },
            selectedColor: {
                type: String, 
            },
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ],
}, { timestamps: true });

let cartModel = mongoose.model('Cart', cartSchema)
module.exports = cartModel;
// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true,
//     },
//     quantity: {
//         type: Number,
//         default: 1,
//         min: 1,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     name: {
//         type: String,
//     },
//     image: {
//         type: String, // store one main image (URL)
//     },
//     selectedSize: {
//         type: String, // e.g. "S", "M", "L", etc.
//     },
//     selectedColor: {
//         type: String, // e.g. "Black", "White", etc.
//     },
// });

// const cartSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//         },
//         items: [cartItemSchema],
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model('Cart', cartSchema);