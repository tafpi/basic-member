let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');
const bcrypt = require('bcrypt');

// Strategy config
module.exports = function(passport){
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use(new LocalStrategy(
        {
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { 
                    console.log(err);
                    return done(err); 
                }
                if (!user) {
                    return done(null, false, req.flash('failure', 'No such user'));
                } else {
                    bcrypt.compare(password, user.password, function(err, res) {
                        if(res){
                            return done(null, user, req.flash('success', 'You logged in!'));
                        }
                        return done(null, false, req.flash('failure', 'Incorrect password, '+username));
                    });
                }
            });
        }
    ));
}