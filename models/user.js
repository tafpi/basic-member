let mongoose = require('mongoose');

// User Schema
let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false
    },
});

let User = mongoose.model('User', UserSchema);
module.exports = User;