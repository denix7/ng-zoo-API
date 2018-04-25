'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');

//modelos internos
var User = require('../models/user');

//acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de users y accion pruebas'
    });
}

function saveUser(req, res){
    //Crear objeto usuario
    var user = new User();

    //Recojer parametros de la peticion con body parser y convierte a json
    var params = req.body;
    
    if(params.password && params.name && params.email){
        
        //Asignar valores recogidos al objeto de usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email; 
        user.role  = 'ROLE_USER';
        user.image = null;

        //cifrar contraseña
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;

            //guardo usuario en BD
            user.save((err, userStored)=>{
                if(err)
                    res.status(500).send({message: 'Error al guardar el usuario'});
                else{
                    if(!userStored)
                        res.status(404).send({message: 'No se ha registrado el usuario'});
                    else    
                        res.status(200).send({user: userStored});    
                }    

            });
        });
    }else{
        res.status(200).send({message: 'Introduce los datos correctamente para registrar al usuario'});
    }
}

module.exports = {
    pruebas,
    saveUser
};