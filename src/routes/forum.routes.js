'use strict'

const forumController = require('../controllers/forum.controller');
const express = require('express');
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/img' });
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.post('/sendMessage', mdAuth.ensureAuth, forumController.sendMessage);
api.get('/getMessages', forumController.getMessages);
api.get('/getMessage/:id', mdAuth.ensureAuth, forumController.getMessage);
api.delete('/deleteMessage/:id', mdAuth.ensureAuth, forumController.deleteMessage);
/*
api.post('/uploadImg', [mdAuth.ensureAuth, upload], forumController.addImage);
api.get('/getImage/:fileName', upload, forumController.getImage);
api.get('/getImages', upload, forumController.getImages);
*/
module.exports = api;