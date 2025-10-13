const express = require('express')
const router = express.Router()
const { signUp, logIn, register, resetPassword, forgotPassword, deleteAccount } = require('../controllers/user.controller.js')
const { protect } = require('../middleware/auth.middleware.js')



router.post("/signup", signUp)
router.get("/register", register)
router.post('/login', logIn)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.delete('/delete', protect, deleteAccount);




module.exports = router 