// app/models/user.js

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// user schema for mongoDB
var userSchema = mongoose.Schema({

        email        : String,
        password     : String,
        name         : String

});

// schema methods
// hash generation
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// model exposure to app
module.exports = mongoose.model('User', userSchema);
