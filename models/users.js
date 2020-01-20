const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: Boolean, default: 1 },
    shop: { type: String, required: true, }
})
const user = mongoose.model('users', userSchema);
module.exports = user;