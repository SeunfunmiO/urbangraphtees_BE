const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const ejs = require('ejs')
const path = require('path')
const app = express()
const UserModel = require('../models/user.model.js')
const productModel = require('../models/product.model.js')
const orderModel = require('../models/order.model.js')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const AdminOnly = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const totalProducts = await productModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();

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

module.exports = {AdminOnly}