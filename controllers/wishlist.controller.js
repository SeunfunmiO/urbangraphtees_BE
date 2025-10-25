
const wishlistModel = require("../models/wishlist.model.js");

const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const wishlist = await wishlistModel.findOne({ userId }).populate("products", "name price images");
        res.status(200).json(wishlist || { products: [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            wishlist = new wishlistModel({ userId, products: [productId] });
        } else {
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ message: "Already in wishlist" });
            }
            wishlist.products.push(productId);
        }

        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

        wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const clearWishlist = async (req, res) => {
    try {
        const { userId } = req.body;

        const wishlist = await wishlistModel.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.products = [];
        await wishlist.save();

        res.status(200).json({ message: "Wishlist cleared successfully", wishlist });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist, clearWishlist }