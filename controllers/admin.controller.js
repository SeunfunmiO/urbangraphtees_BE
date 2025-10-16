const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const ejs = require('ejs')
const path = require('path')
const app = express()
const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");
const Order = require("../models/order.model.js");
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const adminOnly = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        res.json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports = {adminOnly}