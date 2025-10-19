
const express = require("express");
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controllers/wishlist.controller");


router.post("/add", addToWishlist);
router.post("/remove", removeFromWishlist);
router.get("/:userId", getWishlist);

module.exports = router;