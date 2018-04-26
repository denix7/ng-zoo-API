'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
//cargamos middleware
var md_auth = require('../middlewares/authenticated'); 

api.get('/pruebas-del-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login)

module.exports = api;