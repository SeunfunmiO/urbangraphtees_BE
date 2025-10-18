const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                image: { type: String },
                sizes: { type: String, required: true },
                colors: { type: String, required: true },
                orderDate: { type: Date, default: Date.now }
            },
        ],
        shippingAddress: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            address: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            zip: { type: Number },
            birthday: { type: String },
            city: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: Number, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["card", "cash_on_delivery"],
        },
        paymentStatus: {
            type: String,
            default: "pending",
            enum: ["pending", "paid", "failed"],
        },
        orderStatus: {
            type: String,
            default: "processing",
            enum: ["processing", "shipped", "delivered", "cancelled"],
        },
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);
let orderModel = mongoose.model("Order", orderSchema)
module.exports = orderModel;