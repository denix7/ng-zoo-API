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
    
    if(params.password && params.name && params.email){//parametros que se deben enviar obligatoriamente
        
        //Asignar valores recogidos al objeto de usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email; 
        user.role  = 'ROLE_USER';
        user.image = null;

        User.findOne({email: user.email.toLowerCase()}, (err, issetUser)=>{//busca en BD que el email no exista y evitar usuarios duplicados
            if(err)
                res.status(500).send({message: 'Error al comprobar que el usuario existe'});
            else    
                {
                   if(!issetUser){//sino existe el usuario en BD, insertamos el nuevo 
                        //cifrar contraseña
                        bcrypt.hash(params.password, null, null, function(err, hash){//ciframos la contraseña
                        user.password = hash;

                            //guardo usuario en BD
                            user.save((err, userStored)=>{
                                if(err)
                                    res.status(500).send({message: 'Error al guardar el usuario'});
                                else{
                                    if(!userStored)//sino existe user correcto
                                        res.status(404).send({message: 'No se ha registrado el usuario'});
                                    else    
                                        res.status(200).send({user: userStored});//si hay user correcto guardamos el user en BD    
                                }    

                            });
                        });
                   }else{
                        res.status(200).send({message: 'El usuario ya existe no puede insertarse'});
                   } 
                }    
        })    
            
    }else{
        res.status(200).send({message: 'Introduce los datos correctamente para registrar al usuario'});
    }
}

module.exports = {
    pruebas,
    saveUser
};