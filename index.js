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
const path = require('path')
app.use(express.urlencoded({ extended: true }))  //body parser from express js
app.use(express.json())
app.use('/user', userRoute)
app.use('/newsletter', newsletterRoute)


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