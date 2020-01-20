const mongoose = require('mongoose')
const inventorySchema = new mongoose.Schema({
    IMEI: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    model: { type: String, required: true },
    count: { type: Number, required: true, default: 1 }, 
    shop: { type: String },  // required: true
    mrp: { type: String, required: true },
    datemodified: { type: Date, default: new Date() },
    user: { type: String }
})
const inventory = mongoose.model('inventories', inventorySchema);
module.exports = inventory;

//NOT USED YEt