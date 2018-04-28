//representa el esquema que tendra cada documento
'use strict'//para tener las versiones mas modernas de js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({//datos que representan una entidad de la BD
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    rol: String
});

module.exports = mongoose.model('User', UserSchema)//exportamos entidad que representa a user