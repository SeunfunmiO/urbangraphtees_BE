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
        const { name, price, description, stock, discount, category, material, colors, sizes, image } = req.body;

        let uploadImages = [];

        if (image && image.length > 0) {
            // for (const img of images) {
                const result = await cloudinary.uploader.upload(image, {
                    resource_type: 'image'
                })
                uploadImages.push({ url: result.secure_url, public_id: result.public_id })
            // }
        }

        const product = await productModel.create({
            name,
            price,
            description,
            stock,
            discount,
            category,
            uploadImages,
            material,
            sizes,
            colors,
            inStock: stock > 0 ? true : false,
            lastUpdated: new Date()
        });

        res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

module.exports = { getAllProducts, getProductById, deleteProduct, createProduct, updateProduct }


