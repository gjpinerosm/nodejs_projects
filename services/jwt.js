'use strict'

var jwt = require('jwt-simple');
var moment = require('moment'); //get the current time in different formats to use them in other ways.
var secret = 'valor_secreto';

exports.createToken = function(user){
    var payload = {
        subId: user._id,
        name: user.name,
        surname: user.name,
        email: user.mail,
        role: user.role,   // return the role attribute of user object
        image: user.image,
        timeCreateToken: moment().unix(),
        timeExpireToken: moment().add(30,'days').unix(),
    };
    return jwt.encode(payload,secret);
}

