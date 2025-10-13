const mongoose = require('mongoose')


let newsletterSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
}, { timeStamps: true })

let NewsletterModel = mongoose.model('news',newsletterSchema)
module.exports = NewsletterModel