'use strict'

var express = require('express');
var animalController = require('../controllers/animal');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');//permite manipular files
var md_upload = multipart({uploadDir: './uploads/animals'});//creamos el folder donde se alojaran ficheros de animals 

api.get('/animalTest', md_auth.ensureAuth, animalController.pruebas);
api.post('/save-animal', md_auth.ensureAuth, animalController.saveAnimal);
api.get('/animals', animalController.getAnimals);
api.get('/animal/:id', animalController.getAnimal);
api.put('/animal/:id', animalController.updateAnimal);
api.post('/upload-image-animal/:id', md_upload, animalController.uploadImageAnimal);

module.exports = api;