const cartModel = require('../models/cart.model.js');
const productModel = require('../models/product.model.js');

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await cartModel.findOne({ userId }).populate('items.productId');
    if (!cart) {
      cart = await cartModel.create({ userId, items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = await cartModel.create({ userId, items: [] });
    }


    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price, 
        name: product.name,
        image: product.images,
      });
    }

    await cart.save();

    const populatedCart = await cartModel
      .findById(cart._id)
      .populate("items.productId");

    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    let cart = await cartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    const populatedCart = await cartModel.findById(cart._id).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await cartModel.findOneAndUpdate({ userId }, { items: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addToCart, getCart, updateCartItem, clearCart }

