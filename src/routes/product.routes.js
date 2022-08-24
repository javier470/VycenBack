'use strict'

const productController = require('../controllers/product.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');


api.get('/getProducts', productController.getProducts);
api.get('/getProduct/:id', productController.getProduct);

//admin
api.post('/createProduct', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.createProduct);
api.put('/updateProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.updateProduct);
api.delete('/deleteProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.deleteProduct);


module.exports = api;