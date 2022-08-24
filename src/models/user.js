'use strict'

const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    name: String,
    lastName: String,
    username: String,
    country: String,
    phone: String,
    email: String,
    password: String,
    role: String,
    about: String
});

module.exports = mongoose.model('User', userModel)