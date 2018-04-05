//import { createToken } from '../services/jwt';

'use strict'

var fs = require('fs'); //Import filesystem 
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

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
                        // return user data when user is logged in
                        if(params.gethash){
                            console.log(params.gethash);
                            //return over http jwt token
                            res.status(200).send({token: jwt.createToken(user)});
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

function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err,userUpdate) => {  // It has: One parameter what is userId and body object update
        if(err){
            res.status(500).send({message:'Error al actualizar el usuario: '+userId});
        } else{
            if(!userUpdate){
                res.status(400).send({message:'No se ha podido actualizar el usuario'});
            } else{
                res.status(200).send({user: userUpdate});
            }
        }
    });
}

function uploadImage(req,res){
    var userId = req.params.id;
    var file_name_message = 'No ha subido el archivo...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];
        
        console.log(file_path);
        console.log(file_split);
        console.log(ext_split);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId,{image: file_name},(err,userUpdate) => {
                if(!userUpdate){
                    res.status(400).send({message:'No se ha podido actualizar el usuario'});
                } else{
                    res.status(200).send({user: userUpdate});
                }
            });
        } else {
            res.status(200).send({message: 'Extension del archivo de imagen no es válida'});
        }
    } else{
        res.status(200).send({message: 'No se ha subido ninguna imagen'});
    }
}

//Create funtion for get image file
function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file,function(exists){
        if (exists) {
            res.sendFile(path.resolve(path_file));            
        } else{
            res.status(200).send({message:'No existe la imagen...'});
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};  