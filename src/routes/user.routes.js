'use strict'

const userController = require('../controllers/user.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/test', userController.test);
api.post('/register', userController.register);
api.post('/login', userController.login);
api.get('/profile/:id', userController.viewProfiles);

api.put('/updateAccount', mdAuth.ensureAuth, userController.updateAccount);
api.delete('/deleteAccount', mdAuth.ensureAuth, userController.deleteAccount);

api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.getUsers);
api.get('/getUser/:id', [mdAuth.ensureAuth], userController.getUser);
api.post('/createUser', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.createUser);
api.put('/updateUser/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.updateUser);
api.delete('/deleteUser/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.deleteUser);

module.exports = api;