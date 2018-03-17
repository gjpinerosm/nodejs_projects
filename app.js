'use strict'

var express = require('express');
var bodyParser = require('body-parser');

// app is one express instance
// body-parser is a middleware module
// body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
var app = express();

// Charge paths
var user_routes = require('./routes/user');

// Instance of the aplication object with the function .use

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());                           // Convert to JSON objects the request incoming with data


// http header configurations

// base paths
app.use('/api', user_routes); 

module.exports = app;