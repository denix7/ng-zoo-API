'use strict'

var express = require('express');
var animalController = require('../controllers/animal');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');//permite manipular files
var md_upload = multipart({uploadDir: '../uploads/animals'});//creamos el folder donde se alojaran ficheros de animals 

api.get('/animal', md_auth.ensureAuth, animalController.pruebas);
api.post('/save-animal', md_auth.ensureAuth, animalController.saveAnimal);

module.exports = api;