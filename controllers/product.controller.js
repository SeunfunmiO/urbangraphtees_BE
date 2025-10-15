const express = require('express')
const productModel = require('../models/product.model.js')

const addProduct = async (req, res) => {
    try {
        const newProduct = new productModel(req.body);
        await newProduct.save()
        message = 'Product Confirmed';
        res.status(201).json({ message: 'Product added successfully', product: newProduct })
    } catch (error) {
        res.status(500).json({ message: 'Error adding products', error: error.message })
    }
}
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find().sort({ createdAt: -1 })
        res.status(201).json(products)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found ' })
        } else {
            return res.status(200).json(product)
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error fetching product', error: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found ' })
        } else {
            return res.status(200).json({ message: 'Product deleted successfully' })
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error deleting product', error: error.message })
    }
}


module.exports = { addProduct, getAllProducts, getProductById, deleteProduct }


