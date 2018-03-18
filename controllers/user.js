'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

// Create first method
function pruebas(req, res){
    res.status(200).send({message: 'Probando una acción del controlador de usuarios del API Rest con node'});
}

// Create function for  user object
function saveUser(req, res){
    var user = new User();

    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        // Encript password
        bcrypt.hash(params.password, null, null, function(err,hash){
            user.password = hash;
            if(user.name != null, user.surname != null, user.email != null){
                // Save user
                user.save((err,userStored) => {
                    if(err){
                        res.status(500).send({message: 'Error al guardar el usuario' });
                    } else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        } else{
                            res.status(200).send({user: userStored}); 
                        }
                    }
                });  // save one mongoose's model
            } else{
                res.status(200).send({message: 'Completar todos los campos'});
            }
        });
    } else{
        res.status(200).send({message : 'Introduce la contraseña'}); // Inexpected condition
    }
}

function loginUser(req,res){
    // params response
    var params = req.body;
    // access property object params
    console.log(params);
    var email = params.email;
    var password = params.password;

    //console.log('El valor USER es: '+User);
    User.findOne({email: email.toLowerCase()},(err,user) => {  // This user is the object user
    //console.log('El valor de user es: ' + user);    
    if(err){
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            } else{
                // Verify password
                bcrypt.compare(password,user.password, function(err,check){
                    if(check){
                        // return user data loged
                        if(params.gethash){
                            //return over http jwt token
                        }else{
                            res.status(200).send({user}); // response in the user object 
                        }
                    } else{
                        res.status(404).send({message: 'El usuario no ha podido loguearse'});
                    }
                });
            }
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
};