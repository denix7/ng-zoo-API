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

function updateAnimal (req, res) {
    var animalId = req.params.id;
    var update = req.body;

    if(animalId == null)
        return res.status(404).send({message: 'El animal no exite'});

    Animal.findByIdAndUpdate(animalId, update, {new:true}, (err, animalupdated) => {
        if(err) {
            res.status(500).send({message: 'Error en la peticion'})
        }
        else if(!animalupdated) {
            res.status(404).send({message: 'No se pudo actualizar el animal'})
        }
        else {
            res.status(200).send({animalupdated})
        }
    })    
}

function uploadImageAnimal(req, res) {
    var animalId = req.params.id;
    var file_name = 'No subido...';

    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Animal.findByIdAndUpdate(animalId, {image: file_name}, {new:true}, (err, animalUpdated) => {
                if(err) {
                    res.status(500).send({message: 'Error en la peticion'});
                }
                else if(!animalUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el animal'});
                }
                else {
                    res.status(200).send({animal: animalUpdated, image: file_name});
                }
            })
        }
        else {
            fs.unlink(file_path, (err) => {
                if(err) {
                    res.status(200).send({message: 'La extension no es valida'});
                }
                else{
                    res.status(200).send({message: 'La extension no es valida'});
                }
            })
        }
    }
    else {
        res.status(200).send({message: 'No se han subido archivos'});
    } 
}

module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImageAnimal
}