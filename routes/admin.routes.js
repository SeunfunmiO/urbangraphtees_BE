const express = require("express");
const { adminOnly, protect } = require("../middleware/auth.middleware");
const {
    AdminOnly,
    getAllUsers,
    deleteUser,
    updateUserRole, 
    updateAdminProfile,
    changeAdminPassword} = require("../controllers/admin.controller");
const router = express.Router();



router.get("/stats", protect, adminOnly, AdminOnly);
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);
router.put("/profile", protect, adminOnly, updateAdminProfile)
router.put("/change-profile", protect, adminOnly, changeAdminPassword)



module.exports = router;