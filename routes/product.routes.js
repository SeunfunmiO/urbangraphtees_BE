const express = require('express')
const router = express.Router()
const { getAllProducts, getProductById, deleteProduct, createProduct, updateProduct, getProductsByTag } = require('../controllers/product.controller.js');
const { protect, adminOnly } = require('../middleware/auth.middleware.js');


router.post('/product', protect, adminOnly, createProduct)
router.get('/product', getAllProducts)
router.get('/product/:id', getProductById)
router.get('/tag/:tag', getProductsByTag)
router.put('/product/:id', protect, adminOnly, updateProduct)
router.delete('/delete-product/:id', protect, adminOnly, deleteProduct)


module.exports = router
