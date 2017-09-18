'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    }, 
    name:{
        type: String,
        required: true,
        unique: false
    },
    password:{
        type: String,
        required: true
    }
});
UserSchema.pre('save', function(next){
    //!
    var user = this;
    bcrypt.hash(user.password, 10, function(err, result){
        if (err) throw new Error("Failed to hash password");
        user.password = result; 
        next();
    });
});

UserSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}



var User = mongoose.model('User', UserSchema);
module.exports = User;