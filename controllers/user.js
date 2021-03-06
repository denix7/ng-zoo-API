'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');//accede a rutas de sistema de archivos

//modelos internos
var User = require('../models/user');

//servicio jwt
var jwt = require('../services/jwt');

//acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de users y accion pruebas',
        user: req.user
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

function login(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user)=>{
        if(err)
            res.status(500).send({message: 'Error al comprobar el usuario'})
        else{
            if(user)
                bcrypt.compare(password, user.password, (err, check)=>{
                if(check){
                    //comprobar y generar token
                    if(params.gettoken){
                        //si existe token devuelvo
                        res.status(200).send({token: jwt.createToken(user)});

                    }else{
                        res.status(200).send({user});  
                    }
                }
                    
                else    
                    res.status(404).send({message: 'El usuario no ha podido loguearse correctamente'})     
                })
                
            else    
                res.status(404).send({message: 'El usuario no ha podido loguearse'});   
        }    

    });
    
}

function updateUser(req, res){
    var userId = req.params.id;//id del documento a actualizar
    var update = req.body;//objeto con los datos a actualizar

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar el usuario'});
    }

    User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated)=>{
        if(err)
            res.status(500).send({message: 'Erro al actualizar usuario'});
        else    
            {
                if(!userUpdated)
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                else    
                    res.status(200).send({user: userUpdated});    
            }    
    });

}

function uploadImage(req, res){//subir imagen de usuario
    var userId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext=='jpg' || file_ext=='jpeg' || file_ext=='gif'){
            if(userId != req.user.sub){
                res.status(500).send({message: 'No tienes permiso para actualizar'});
        }
        User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error al acutualizar usario'})
            }else{
                if(!userUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }else{
                    res.status(200).send({user: userUpdated, image: file_name});
                }
            }
        });
        }
        else{
            fs.unlink(file_path, (err)=>{//borra la imagen dado su ubicacion
                if(err){
                    res.status(200).send({message: 'La extension no es valida y fichero no borrado'});
                }else{
                    res.status(200).send({message: 'La extension no es valida'});
                }
            })
        }
    }
    else
        res.status(200).send({message: 'No se han subido archivos'});
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;//nombre del fichero que nos llega
    var path_file = './uploads/users/'+imageFile;//ruta a nivel de carpeta que tiene la ruta

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'La imagen no existe'});
        }
    });
}

function getKeepers(req, res){
    User.find({role: 'ROLE_ADMIN'}).exec((err, users)=>{
        if(err){
            res.status(500).send({message: 'error en la peticion'});
        }else{
            if(!users)
                res.status(404).send({message: 'no hay cuidadores'}); 
            else    
                res.status(200).send({users});       
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getKeepers
};