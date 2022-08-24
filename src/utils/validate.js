'use strict'

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');

exports.validateData = (data) => {
    let keys = Object.keys(data), msg = '';
    for (let key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `Param ${key} is required\n`;
    }
    return msg.trim();
}

exports.encrypt = async (password) => {
    try {
        return bcrypt.hashSync(password);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.searchUser = async (user) => {
    try {
        let already = User.findOne({ username: user }).lean();
        return already;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkPass = async (password, hash) => {
    try {
        return bcrypt.compareSync(password, hash);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.validExtension = async (ext, filePath) => {
    try {
        if (ext == 'png' ||
            ext == 'jpg' ||
            ext == 'jpeg' ||
            ext == 'gif') {
            return true;
        } else {
            fs.unlinkSync(filePath);
            return false;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}