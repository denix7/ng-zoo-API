'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas

//configurar middleware de bodyParser, 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras y cors

//configurar rutas bodyParser
app.get('/probando', (req, res)=>{
    res.status(200).send({mesage: "Este es el metodo probando"})
})

module.exports = app;