const express = require('express')
const router = express.Router()
const { addProduct, getAllProducts, getProductById, deleteProduct } = require('../controllers/product.controller.js')



router.post('/product', addProduct)
router.get('/product', getAllProducts)
router.get('/product/:id', getProductById)
router.delete('/delete-product/:id', deleteProduct)


module.exports = router