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
UserSchema.statics.login = function (email, pass, callback){
    User.findOne({email:email}).exec(function(err, result){
        if (err) {
            console.log('Could not search given the input to the login function');
            return callback(err)
            
        }
        else if (!result){s
            console.log("User not found :" + email);
            return callback(err);
        }
        else{
            bcrypt.compare(pass, result.password,function(err, hashMatches){
                if (err){}
                console.log("Does the hash match? :" + hashMatches);
                if(hashMatches){
                    return(callback(null, result))
                }
            })
            
        }
        
    });
}


var User = mongoose.model('User', UserSchema);
module.exports = User;