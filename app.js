'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');

//configurar middleware de bodyParser, 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras y cors

//configurar rutas base bodyParser
app.use('/api', user_routes);
module.exports = app;