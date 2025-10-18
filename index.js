const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const userRoute = require('./routes/user.routes.js');
const newsletterRoute = require('./routes/newsletter.routes.js')
const productRoute = require('./routes/product.routes.js')
const adminRoute = require('./routes/admin.routes.js')
const orderRoute = require('./routes/order.routes.js')
const path = require('path')
app.use(express.urlencoded({limit:'5mb' ,extended: true }))
app.use(express.json({limit:'5mb'}))
app.use('/user', userRoute)
app.use('/newsletter', newsletterRoute)
app.use('/products', productRoute)
app.use('/admin', adminRoute)
app.use('/orders', orderRoute)


let URI = process.env.DATABASE_URI
mongoose.connect(URI)
    .then(() => {
        console.log('database connected successfully')
    })
    .catch((error) => {
        console.log(error);
    })




app.get('/', (req, res) => {
    console.log(__dirname, '/views/email-template/welcome-email.ejs');
    let filePath = path.join(__dirname, '/views/email-template/welcome-email.ejs')
    console.log(filePath);
    res.send('Application is working perfectly')
})




let port = process.env.PORT
app.listen(port, (err) => {
    if (err) {
        console.log('error: Server cannot start now');

    } else {
        console.log(port)
        console.log(`msg: Server running on ${port} !`);

    }
})