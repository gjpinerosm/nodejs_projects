'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

exports.ensureAuth = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message:'No hay cabecera de autenticación'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');
    console.log(token);

    try{
        var payload = jwt.decode(token, secret);
        if(payload <= moment().unix()){
            return res.status(401).send({message: 'El token ha expirado'})
        }
    } catch(ex){
        console.log(ex);
        return res.status(404).send({message: 'Token no valido'}); 
    }
    // add user to user object
    req.user = payload;
    next(); //get out 
};