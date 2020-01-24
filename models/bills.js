const mongoose = require('mongoose')
const billsSchema = new mongoose.Schema({
    type: { type: String, required: true },
    billnumber: { type: String, required: true },
    IMEI: { type: String, required: true },
    model: { type: String, required: true },
    shop: { type: String, required: true },
    mrp: { type: Number, required: true },
    sellingprice: { type: Number, required: true },
    billdate: { type: Date, default: new Date() },
    user: { type: String },
    customer: { type: String },
    contactnum: { type: String }
})
const bills = mongoose.model('bills', billsSchema);
module.exports = bills;