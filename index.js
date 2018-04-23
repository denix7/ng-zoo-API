'use strict' //nos permite acceder a los estandares del lenguaje y sea compatible en navegadores

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ngZoo', (err, res)=>{
    if(err){
        throw err;
    }else
        console.log('La conexion a BD exitosa');
})