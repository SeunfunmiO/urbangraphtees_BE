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

// const getAllUsers = async (req, res) => {
//     try {
//         const users = await UserModel.find().select("-password");
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching users" });
//     }
// };
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        const query = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        };

        const totalUsers = await UserModel.countDocuments(query);
        const users = await UserModel.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};


const updateUserRole = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = user.role === "admin" ? "user" : "admin";
        await user.save();

        res.status(200).json({ message: "User role updated", role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Error updating role" });
    }
}
const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id; 
        const { name, email } = req.body;

        const updatedAdmin = await UserModel.findByIdAndUpdate(
            adminId,
            { name, email },
            { new: true }
        ).select("-password");

        res.status(200).json({ message: "Profile updated successfully", admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
};

const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const admin = await UserModel.findById(adminId);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await admin.matchPassword(currentPassword);
        if (!isMatch)
            return res.status(400).json({ message: "Current password is incorrect" });

        admin.password = newPassword;
        await admin.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error changing password" });
    }
};
module.exports = { AdminOnly, getAllUsers, deleteUser, updateUserRole , updateAdminProfile, changeAdminPassword }