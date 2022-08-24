'use strict'

const mongoose = require('mongoose');

const forumModel = mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    message: String,
    date: Date,
});

module.exports = mongoose.model('Forum', forumModel)