'use strict'

const contactController = require('../controllers/contact.controller');
const mdAuth = require('../middlewares/authenticated');
const express = require('express');
const api = express.Router();

api.get('/test', contactController.test);
api.post('/add/:idU', mdAuth.ensureAuth, contactController.saveContact);
api.get('/getContacts/:id', mdAuth.ensureAuth, contactController.getContacts);
api.put('/update/:idU/:idC', mdAuth.ensureAuth, contactController.update);
api.delete('/delete/:idU/:idC', mdAuth.ensureAuth, contactController.delete);

module.exports = api;