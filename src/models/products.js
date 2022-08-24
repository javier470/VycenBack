'use strict'

const mongoose = require('mongoose');

const productModel = mongoose.Schema({
    name: String,
    size: String,
    sex: String,
    price: Number,
    date: Date,
    company: { type: mongoose.Schema.ObjectId, ref: 'Company' }
});

module.exports = mongoose.model('Product', productModel)