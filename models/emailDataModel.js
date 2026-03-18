const mongoose = require('mongoose');

const emailDataSchema = new mongoose.Schema({
    clg_code: { type: Number, required: true, unique: true, index: true },
    center_code: { type: Number, unique: true },
    center_name: { type: String, },
    type: { type: String, required: true },
    clg_name: { type: String, },
    pr_name: { type: String, },
    pr_mobile: { type: Number, },
    dealing_name: { type: String, },
    dealing_mobile: { type: Number, },
    email1: { type: String },
    email2: { type: String, },
    email3: { type: String, },
    address: { type: String, },
    district: { type: String, },
    remarks: { type: String, },
    hide: { type: String, default: "no" }

}, { timestamps: true });

module.exports = mongoose.model('emaildata', emailDataSchema);