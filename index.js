'use strict' //nos permite acceder a los estandares del lenguaje y sea compatible en navegadores

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.connect('mongodb://localhost:27017/ngZoo', (err, res)=>{
    if(err){
        throw err;
    }else
        console.log('La conexion a BD exitosa');
        app.listen(port, ()=> {
            console.log("El servidor local con node y express esta corriendo correctamente");
        });
})