'use strict'

// charge the mongoose's library or module 
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;
// Connect to Mongoose database
// => is the symbol for Callback function
// The throw sentence for launch one exception for the user
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node_project', (err,res) => {
    if(err){
        throw err;
    } else{
        console.log("La base de datos esta corriendo correctamente");
        
        app.listen(port, function(){
            console.log("Servidor de API Rest de ScotiaBank escuchando por " + port);
        });
    }
});