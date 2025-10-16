const express = require("express");
const { adminOnly, protect } = require("../middleware/auth.middleware");
const router = express.Router();



router.get("/stats", protect, adminOnly);

module.exports = router;