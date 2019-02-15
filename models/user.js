let mongoose = require('mongoose');

// User Schema
let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.methods.validPassword = function(pwd) {
    return (this.password == pwd);
}

let User = mongoose.model('User', UserSchema);
module.exports = User;