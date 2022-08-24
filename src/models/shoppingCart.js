'use strict'

const mongoose = require('mongoose');

const cartModel = mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
    subtotal: Number,
    times: Number
});

module.exports = mongoose.model('ShoppingCart', cartModel)