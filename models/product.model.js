const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    stock: Number
}, { timestamps: true })

let productModel = mongoose.model('Product', productSchema)
module.exports = productModel