const express = require('express');
const { getCart, addToCart, updateCartItem, clearCart, removeCartItem } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove/:productId', protect,removeCartItem)
router.delete('/clear', protect, clearCart);

module.exports = router;