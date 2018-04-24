'use strict'

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de users y accion pruebas'
    });
}

module.exports = {
    pruebas
};