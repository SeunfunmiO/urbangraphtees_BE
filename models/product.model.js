const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ url: String, public_id: String }],
    description: { type: String, required: true },
    material: { type: String, required: true },
    sizes: { type: String, required: true },
    colors: { type: String, required: true },
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    category: { type: String },
    tag: {
        type: String,
        enum: ["new", "trending", "best-seller", "none"],
        default: "none"
    },
    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true })

let productModel = mongoose.model('Product', productSchema)
module.exports = productModel
