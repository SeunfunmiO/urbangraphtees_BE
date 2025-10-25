
const express = require("express");
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist, clearWishlist } = require("../controllers/wishlist.controller");


router.post("/add", addToWishlist);
router.post("/remove", removeFromWishlist);
router.get("/:userId", getWishlist);
router.delete("/clear", clearWishlist)

module.exports = router;