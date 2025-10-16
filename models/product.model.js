const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: [{ url: String, public_id: String }],
    description: { type: String, required: true },
    material: { type: String, required: true },
    sizes: { type: String, required: true },
    colors: { type: String, required: true },
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    discount: { type: Number, default: 0 }, // e.g., 2% off
    category: { type: String },
    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true })

let productModel = mongoose.model('Product', productSchema)
module.exports = productModel
