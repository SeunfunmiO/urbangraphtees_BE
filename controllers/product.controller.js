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
        const { name, price, description, stock, discount, category, material, colors, sizes, images } = req.body;

        let uploadImages = [];

        if (images && images.length > 0) {
            for (const img of images) {
                const result = await cloudinary.uploader.upload(img, {
                    resource_type: 'image'
                })
                uploadImages.push({ url: result.secure_url, public_id: result.public_id })
            }
        }

        const product = await productModel.create({
            name,
            price,
            description,
            stock,
            discount,
            category,
            images: uploadImages,
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
        const { name, price, description, material, sizes, colors, stock, discount, category, inStock, images } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 🔹 If a new image is provided, replace the old ones
        if (oldImage) {

            if (product.oldImage && product.oldImage.length > 0) {
                for (const img of product.images) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }

            const uploadedImage = await cloudinary.uploader.upload(images, {
                folder: "urbangraphtees/products",
                resource_type: "image",
            });

            product.images = [
                {
                    url: uploadedImage.secure_url,
                    public_id: uploadedImage.public_id,
                },
            ];
        }

        if (name) product.name = name;
        if (price) product.price = price;
        if (description) product.description = description;
        if (material) product.material = material;
        if (sizes) product.sizes = sizes;
        if (colors) product.colors = colors;
        if (stock) product.stock = stock;
        if (discount) product.discount = discount;
        if (category) product.category = category;
        if (typeof inStock !== "undefined") product.inStock = inStock;
        if (images) product.images = uploadedImage

        const updatedProduct = await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            updatedProduct,
        });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ message: "Error updating product", error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Products not found' })
        }
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        await productModel.findByIdAndDelete(id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error deleting product', error: error.message })
    }
}

module.exports = { getAllProducts, getProductById, deleteProduct, createProduct, updateProduct }


