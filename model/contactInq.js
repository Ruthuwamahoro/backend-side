const mongoose = require('mongoose');
const contactMes = new mongoose.Schema({
    fullName: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    message: {
        type:String,
        required:true 
    }
})

const contact = mongoose.model('contact', contactMes);
module.exports = contact;