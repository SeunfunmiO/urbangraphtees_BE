const express = require('express')
const UserModel = require('../models/user.model.js')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()
const ejs = require('ejs')
const { fileURLPath } = require('url')
const path = require('path')
const fs = require('fs')
const generateToken = require('../utils/generateToken')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const crypto = require("crypto");






const signUp = async (req, res) => {
  const { fullName, email, password, userName } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })

    }
    let saltRounds = 10
    const salt = await bcryptjs.genSalt(saltRounds)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const user = await UserModel.create({ fullName, email, password: hashedPassword, userName })
    if (user) {
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      })

    };
    
  const emailTemplatePath = path.join(__dirname, '/views/email-template/welcome-email.ejs');
    let htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');
    htmlContent = htmlContent.replace("{{userName}}", userName || "User");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Urbangraphtees" <${process.env.NODE_MAIL}>`,
      to: email,
      subject: 'Welcome to Urbangraphtees',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const register = (req, res) => {
  res.send('Connect')
}

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body
    let user = await UserModel.findOne({ email })
    console.log(user);
    if (user) {
      let comparePassword = await bcryptjs.compare(password, user.password);
      if (comparePassword) {
        return res.status(200).json({
          success: true,
          message: 'Signed In Successfully',
          token: generateToken(user._id),
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            userName: user.userName,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
          }
        });
      }
      else {
        return res.status(400).json({ success: false, message: 'Invalid Credentials' })
      }
    } else {
      return res.status(400).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    console.log(error);

  }
}


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save to DB with expiry (10 mins)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `https://urbangraphtees-fe.vercel.app/user/reset-password/${resetToken}`;

    // Send reset link via email
    const transporter = nodemailer.createTransport({
      // service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NODE_MAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Hello ${user.fullName},</h3>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it. This link expires in 10 minutes.</p>
        <a href="${resetUrl}" target="_blank"
          style="background:#000;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Reset link sent to your email." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token or user not found" });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
//     const user = await UserModel.findOne({
//       resetPasswordToken: resetTokenHash,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired reset token" });
//     }

//     const hashedPassword = await bcryptjs.hash(password, 10);
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     res.status(201).json({ success: true, message: "Password reset successful. You can now log in." });
//   } catch (error) {
//     console.error("Reset Password Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const deleteUser = await UserModel.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = { signUp, logIn, register, forgotPassword, resetPassword, deleteAccount }