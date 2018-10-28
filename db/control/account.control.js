var bcrypt   = require('bcrypt-nodejs');

exports.encrypt = function(password){
    console.log("Hashing Password");
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

exports.isValidPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};