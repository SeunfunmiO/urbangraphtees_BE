const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/order.controller.js");
const { protect, adminOnly } = require("../middleware/auth.middleware.js");

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/admin", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;