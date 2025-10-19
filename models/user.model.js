const mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    // firstName: { type: String, required: true },
    // lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // profilePicture: { type: String },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    // phone: { type: Number, required: true },
    // dob: { type: String },
    // address: { type: String, required: true },
    // city: { type: String, required: true },
    // zipCode: { type: Number, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})


let UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel;