'use strict'

const mongoose = require('mongoose');

const companyModel = mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
    description: String
});

module.exports = mongoose.model('Company', companyModel)