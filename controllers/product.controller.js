const express = require('express')
const productModel = require('../models/product.model.js')
const cloudinary = require('cloudinary').v2


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

const createProduct = async (req, res) => {
    try {
        const { name, price, description, stock, discount, category, material, image, inStock, colors, sizes } = req.body;

        // Upload images to Cloudinary
        const images = [];
        if (req.files) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                images.push({ url: result.secure_url, public_id: result.public_id });
            }
        }

        const product = await productModel.create({
            name,
            price,
            description,
            stock,
            discount,
            category,
            image,
            material,
            sizes,
            colors,
            inStock,
            lastUpdated
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await productModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);


        if (product.images.length > 0) {
            for (const image of product.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        await product.deleteOne();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error deleting product', error: error.message })
    }
}

module.exports = { addProduct, getAllProducts, getProductById, deleteProduct, createProduct, updateProduct }


