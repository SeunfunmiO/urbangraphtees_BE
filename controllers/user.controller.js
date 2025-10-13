const express = require('express')
const UserModel = require('../models/user.model.js')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()
const ejs = require('ejs')
const path = require('path')
const generateToken = require('../utils/generateToken')
const cloudinary = require('cloudinary').v2
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
})


const signUp = async (req, res) => {
  const { fullName, email, password, userName } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: '❌ User already exists' })

    }
    let saltRounds = 10
    const salt = await bcryptjs.genSalt(saltRounds)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const user = await UserModel.create({ fullName, email, password: hashedPassword, userName })
    if (user) {
      res.status(201).json({
        success: true,
        message: '✔ Account created successfully',
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id)
      })

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.NODE_MAIL,
          pass: process.env.MAIL_PASS
        }
      });
      // res.send({ status: true, message: '✔ Account created successfully' })
      // const emailTemplatePath = path.join(__dirname, '/views/email-template/welcome-email.ejs')
      let mailOptions = {
        from: 'Urbangraphtees',
        to: email,
        subject: 'Welcome to Urbangraphtees',
        html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to UrbanGraphTees</title>
  <script src="https://kit.fontawesome.com/18ec6142ad.js" crossorigin="anonymous"></script>
</head>

<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
          style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <tr>
            <td style="background-color: #000000; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px;">
                URBANGRAPHTEES
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; letter-spacing: 1px;">
                STREETWEAR • CULTURE • DESIGN
              </p>
            </td>
          </tr>


          <tr>
<td style="background-color: #000000; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px;">
                URBANGRAPHTEES
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; letter-spacing: 1px;">
                STREETWEAR • CULTURE • DESIGN
              </p>
            </td>

            <td style="padding: 50px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #000000; font-size: 28px; font-weight: bold;">
                Welcome, ${userName}! 👋
              </h2>
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for joining the UrbanGraphTees (UGT) family! We're thrilled to have you as part of our
                community of
                style enthusiasts who appreciate bold designs and authentic streetwear.
              </p>
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Your account is now active, and you're ready to explore our latest collections, exclusive drops, and
                limited-edition designs.
              </p>
            </td>
          </tr>


          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div
                style="background-color: #f9f9f9; border-left: 4px solid #000000; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #000000; font-size: 20px; font-weight: bold;">
                  What's Next?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                  <li>Browse our latest collection of graphic tees</li>
                  <li>Get early access to new releases and exclusive drops</li>
                  <li>Enjoy member-only discounts and promotions</li>
                  <li>Track your orders and manage your wishlist</li>
                </ul>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="http://localhost:5173/shop?category=All"
                style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 40px; font-size: 16px; font-weight: bold; letter-spacing: 1px; border-radius: 4px; text-transform: uppercase;">
                Start Shopping
              </a>
            </td>
          </tr>


          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <div
                style="background-color: #000000; color: #ffffff; padding: 25px; text-align: center; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
                  Welcome Gift
                </p>
                <p style="margin: 0 0 10px 0; font-size: 24px; font-weight: bold; color: #ffffff ">
                  10% OFF
                </p>
                <p style="margin: 0 0 15px 0; font-size: 14px; color: #ffffff">
                  Your First Order
                </p>
                <p
                  style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 2px; background-color: #ffffff; color: #000000; padding: 12px; display: inline-block; border-radius: 4px;">
                  WELCOME10
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px;">
                Follow us for style inspiration
              </p>
              <div>
                <a href="https://www.instagram.com/urbangraphtees_thebrand/"
                  style="display: inline-block; margin: 0 10px; color: #000000; text-decoration: none; font-weight: bold;">Instagram</a>
                <a href="#"
                  style="display: inline-block; margin: 0 10px; color: #000000; text-decoration: none; font-weight: bold;">Facebook</a>
                <a href="#"
                  style="display: inline-block; margin: 0 10px; color: #000000; text-decoration: none; font-weight: bold;">Twitter</a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f9f9f9;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 12px;">
                Questions? Contact us at <a href="mailto:urbangraphtees@gmail.com"
                  style="color: #000000; text-decoration: none;">urbangraphtees@gmail.com</a>
              </p>
              <p style="margin: 0; color: #999999; font-size: 11px;">
                © 2025 Urbangraphtees. All rights reserved.<br>
                Surulere, Lagos, Nigeria
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  } catch (error) {
    if (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: '❌ Internal server error' });
    }
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
          message: '✔ Signed In Successfully',
          token: generateToken(user._id),
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            userName: user.userName
          }
        });
      }
      else {
        return res.status(400).json({ success: false, message: '❌ Invalid Credentials' })
      }
    } else {
      return res.status(400).json({ success: false, message: '❌ User not found' })
    }
  } catch (error) {
    console.log(error);

  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    let user = await UserModel.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' });
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    // change this to your frontend URL

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.NODE_MAIL,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hi ${user.fullName},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for only 15 minutes.</p>
      `,
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  }
  catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });

  }
}

// Reset Password Controller
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token & expiry in DB
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    const resetUrl = `http://localhost:5173/auth/reset-password:token/${resetToken}`;

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "UrbanGraphTees",
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.fullName || "there"},</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}" target="_blank" 
        style="background:#000;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">
        Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await UserModel.findById(decoded.id);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: 'Password reset successfully!' });
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid or expired token' });
//   }
// };

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = { signUp, logIn, register, forgotPassword, resetPassword , deleteAccount }