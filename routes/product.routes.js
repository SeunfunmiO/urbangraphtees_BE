const express = require('express')
const router = express.Router()
const multer = require("multer");
const upload = multer({ dest: "uploads/" })
const { addProduct, getAllProducts, getProductById, deleteProduct, createProduct, updateProduct } = require('../controllers/product.controller.js');
const { protect } = require('../middleware/auth.middleware.js');


router.post('/add-product', protect, upload.array("image"), createProduct)
router.post('/product', addProduct)
router.get('/product', getAllProducts)
router.get('/product/:id', getProductById)
router.put('/product/:id', protect,updateProduct)
router.delete('/delete-product/:id', protect, deleteProduct)


module.exports = router
