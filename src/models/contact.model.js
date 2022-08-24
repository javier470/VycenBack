'use strict'

const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: String,
    surname: String,
    phone: String,
    birthday: Date
});

module.exports = mongoose.model('contact', contactSchema);