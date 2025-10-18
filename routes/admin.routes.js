const express = require("express");
const { adminOnly, protect } = require("../middleware/auth.middleware");
const { AdminOnly } = require("../controllers/admin.controller");
const router = express.Router();



router.get("/stats", protect, adminOnly, AdminOnly);

module.exports = router;