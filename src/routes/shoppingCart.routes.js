'use strict'

const cartController = require('../controllers/shoppingCart.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.post('/addProduct/:product', [mdAuth.ensureAuth, mdAuth.isClient], cartController.addToCart);
api.post('/quitProduct/:product', [mdAuth.ensureAuth, mdAuth.isClient], cartController.quitToCart);
api.get('/getCart', [mdAuth.ensureAuth, mdAuth.isClient], cartController.getCart);
api.delete('/pay', [mdAuth.ensureAuth, mdAuth.isClient], cartController.pay);

module.exports = api;