'use strict'

const companyController = require('../controllers/company.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.post('/createCompany', companyController.createCompany);
api.get('/getCompanies', companyController.getCompanies);
api.get('/getCompany/:id', companyController.getCompany);

//admin
api.put('/updateCompany/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], companyController.updateCompany)
api.delete('/deleteCompany/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], companyController.deleteCompany);

module.exports = api;