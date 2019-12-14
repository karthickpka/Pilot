const mongoose = require('mongoose')
const billsSchema = new mongoose.Schema({
    spare: {
        type: Boolean,
        required: true,
        default: false
    },
    IMEI: {
        type: String,
        required: true
    },
    model: {
        type: Boolean,
        required: true
    },
    shop: {
        type: String,
        required: true
    },
    rate: {
        type: String,
        required: true
    },
    sellingprice: {
        type: String,
        required: true
    },
    billdate: {
        type: Date,
        default: new Date()
    },
    user: {
        type: String
    },
    customer:{
        type: String
    },
    contactnum:{
        type:String
    }
})
const bills = mongoose.model('bills', billsSchema);
module.exports = bills;

//NOT USED YEt