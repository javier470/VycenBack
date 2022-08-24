'user strict'

const { validateData, encrypt, searchUser, checkPass } = require('../utils/validate');
const User = require('../models/user');
const Forum = require('../models/forum');
const Cart = require('../models/shoppingCart');
const jwt = require('../services/jwt');

exports.test = async (req, res) => {
    return res.send({ message: 'Si sirve :=)' });
}

exports.register = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            lastName: params.lastName,
            username: params.username,
            country: params.country,
            phone: params.phone,
            email: params.email,
            password: params.password,
            role: 'CLIENT'
        }
        const msg = validateData(data);
        if (msg) return res.status(400).send(msg);
        if (data.role != 'CLIENT') return res.status(403).send({ message: 'Unauthorized action' });
        if (!params.email.endsWith('@gmail.com')) return res.status(400).send({ message: 'Invalid Email' });
        const already = await User.findOne({ username: params.username })
        if (already) return res.status(400).send({ message: 'Username already in use' })
        data.password = await encrypt(params.password);
        data.about = params.about;
        const user = new User(data);
        await user.save();
        return res.send({ message: 'User created' })
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.login = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            username: params.username,
            password: params.password
        }
        const msg = await validateData(data);
        if (msg) return res.status(400).send(msg);
        const already = await searchUser(data.username);
        if (already && await checkPass(data.password, already.password)) {
            const token = await jwt.createToken(already);
            delete already.password;
            return res.send({ token, message: 'Welcome!', already });
        } else return res.status(401).send({ message: 'Wrong user or password' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.updateAccount = async (req, res) => {
    try {
        const accountId = req.user.sub;
        const params = req.body;
        if (accountId != req.user.sub) return res.status(403).send({ message: 'Unauthorized to update this account' })
        if (params.password) return res.status(400).send({ message: 'Cannot update the password' });
        const already = await User.findOne({ _id: accountId });
        if (already.username == 'admin') return res.status(401).send({ message: 'Can\'t update this account' })
        if (already.username == params.username) {
            if (!already) return res.status(404).send({ message: 'Account does not exist' });
            const user = await User.findOneAndUpdate({ _id: accountId }, params, { new: true });
            if (user) return res.send({ message: 'Account updated' });
            else return res.status(500).send({ message: 'Cabbit update this account' });
        } else return res.status(400).send({ message: 'Username already in use' });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const accountId = req.user.sub;
        const already = await User.findOne({ _id: accountId });
        if (already.username == 'admin') return res.status(401).send({ message: 'Can\'t delete this account' })
        if (!already) return res.status(404).send({ message: 'Account does not exist' });
        if (accountId != req.user.sub) return res.status(403).send({ message: 'Unauthorized to delete this account' });
        const forum = await Forum.find({ user: accountId });
        const cart = await Cart.find({ user: accountId });
        for (let f of forum) {
            await Forum.findOneAndDelete({ _id: f._id });
        }
        for (let c of cart) {
            await Cart.findOneAndDelete({ _id: c._id });
        }
        const user = await User.findOneAndDelete({ _id: accountId });
        if (!user) return res.status(500).send({ message: 'Error deleting account' });
        return res.send({ message: 'Account deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.getAccount = async (req, res) => {
    try {
        const accountId = req.user.sub;
        const already = await User.findOne({ _id: accountId })
        if (!already) return res.status(404).send({ message: 'Account does not exist' });
        if (accountId != req.user.sub) return res.status(403).send({ message: 'This account is not yours' });
        const user = await User.findOne({ _id: accountId });
        return res.send({ message: 'Your account', user });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ name: -1 });
        if (!users) return res.status(404).send({ message: 'Users not found' });
        delete users.password;
        return res.send({ message: 'Users found: ', users });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const users = await User.findOne({ _id: userId }).select('-password');
        if (!users) return res.status(404).send({ message: 'User not found' });
        return res.send({ message: 'Users found: ', users });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.createUser = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            lastName: params.lastName,
            username: params.username,
            email: params.email,
            password: params.password,
            phone: params.phone,
            country: params.country,
            role: params.role
        }
        const msg = await validateData(data);
        if (msg) return res.status(400).send(msg);
        const already = await User.findOne({ username: params.username })
        if (already) return res.status(400).send({ message: 'Username already in use' });
        data.password = await encrypt(params.password);
        data.about = params.about;
        const user = new User(data);
        await user.save();

        return res.send({ message: 'User created' });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const params = req.body;
        if (params.password) return res.status(403).send({ message: 'Cannot update password' });
        const already = await User.findOne({ _id: userId });
        if (already.role == 'ADMIN') return res.status(401).send({ message: 'Can\'t update an Admin' });
        if (already.username == 'admin') return res.status(401).send({ message: 'Can\'t update this account' });
        if (already.username == params.username) {
            if (!already) return res.status(404).send({ message: 'Account does not exist' });
            const user = await User.findOneAndUpdate({ _id: userId }, params, { new: true });
            return res.send({ message: 'User updated', user });
        } else return res.status(400).send({ message: 'Username already in use' });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const already = await User.findOne({ _id: userId })
        if (already.role == 'ADMIN') return res.status(401).send({ message: 'Can\'t delete an Admin' });
        if (already.username == 'admin') return res.status(401).send({ message: 'Can\'t delete this account' })
        if (!already) return res.status(404).send({ message: 'User not found' });
        if (already.role == 'CLIENT') {
            const forum = await Forum.find({ user: userId });
            const cart = await Cart.find({ user: userId });
            for (let f of forum) {
                await Forum.findOneAndDelete({ _id: f._id });
            }
            for (let c of cart) {
                await Cart.findOneAndDelete({ _id: c._id });
            }
            const deleteUser = await User.findOneAndDelete({ _id: userId });
            if (!deleteUser) return res.status(500).send({ message: 'Cannot delete user' });
            return res.send({ message: 'User deleted' });
        }
        return res.status(401).send({ message: 'Unauthorized to delete this User' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.createAdmin = async (req, res) => {
    try {
        if (await User.find() == '' || !await User.findOne({ username: 'admin' })) {
            const data = {
                name: 'admin',
                username: 'admin',
                password: '123',
                role: 'ADMIN'
            }
            data.password = await encrypt(data.password)
            const admin = new User(data);
            await admin.save();
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }
}

exports.viewProfiles = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.send({ message: 'User found:', userFind: user });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }
}