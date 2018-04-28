'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
//cargamos middleware
var md_auth = require('../middlewares/authenticated'); 

var multipart = require('connect-multiparty');//permite manipular files
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/pruebas-del-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', md_auth.ensureAuth, UserController.saveUser);
api.post('/login', UserController.login);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

module.exports = api;