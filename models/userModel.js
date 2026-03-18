const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('user', userDataSchema);