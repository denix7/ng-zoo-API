'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
//cargamos middleware
var md_auth = require('../middlewares/authenticated'); 

api.get('/pruebas-del-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', md_auth.ensureAuth, UserController.saveUser);
api.post('/login', md_auth.ensureAuth, UserController.login);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;