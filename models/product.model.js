const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    image: String,
    description: String,
    material: String,
    sizes: String,
    colors: String,
}, { timestamps: true })

let productModel = mongoose.model('Product', productSchema)
module.exports = productModel