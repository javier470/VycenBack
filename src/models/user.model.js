'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    surname: String,
    username: String,
    password: String,
    email: String,
    image: String,
    phone: String,
    contacts: [
        {type: mongoose.Schema.ObjectId, ref: 'contact'}
    ]
});

module.exports = mongoose.model('user', userSchema);