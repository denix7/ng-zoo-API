'use strict'
//modulos
var fs = require('fs');
var path = require('path');//accede a rutas de sistema de archivos

//modelos internos
var User = require('../models/user');
var Animal = require('../models/animal');

//acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de animales',
        user: req.user
    });
}

module.exports = {
    pruebas
}