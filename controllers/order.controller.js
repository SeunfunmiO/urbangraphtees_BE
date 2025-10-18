const orderModel = require("../models/order.model.js");
const productModel = require("../models/product.model.js");


const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;
    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "No order items" });

    const order = new orderModel({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders", error: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderModel.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status || order.orderStatus;
    const updated = await order.save();

    res.json({ message: "Order status updated", order: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getMyOrders, updateOrderStatus };