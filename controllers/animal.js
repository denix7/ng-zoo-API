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

function saveAnimal(req, res){
    //crear objeto animal
    var animal = Animal();

    //Recojer peticion post por body parser
    var params = req.body;

    if(params.name && params.description)
    {
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;//guarda id del user logueado

        animal.save((err, animalStored)=>{
            if(err)
                res.status(500).send({message: 'Error al guardar el animal'});
            else{
                if(!animalStored)//sino llega animal correcto
                    res.status(404).send({message: 'No se ha registrado el animal'});
                else    
                    res.status(200).send({animal: animalStored});//si hay animal correcto guardamos el user en BD    
            }    
        })
    
    }else{
        res.status(500).send({message: 'Nombre y description de animal es obligatorio'});
    }
}

function getAnimals(req, res){
    Animal.find({}).populate({path: 'users'}).exec((err, animales)=>{//populate muestra el id del usuario que guardo el animal
        if(err)
            res.status(500).send({message: 'Error en la peticion'})
        else{
            if(!animales)
                res.status(404).send({message: 'No existen animals'})
            else    
                res.status(200).send({animales})    
        }    
    })
}

function getAnimal(req, res) {
    var animalId = req.params.id;

    if(animalId == null)
        return res.status(404).send({message: 'El animal no exite'});
    
    Animal.findById(animalId).populate({path: 'user', select: ['image', 'surname', 'name']}).exec((err, animalStored) => {
        if(err) {
            res.status(500).send({message: 'Error en la peticion'});
        }
        else if(!animalStored) {
            res.status(404).send({message: 'No se ha encontrado el animal'})
        }
        else {
            res.status(200).send({animalStored});
        }
    }); 
}

module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal
}