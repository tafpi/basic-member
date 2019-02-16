var express = require('express');
var router = express.Router();
const passport = require('passport');

require('./config/passport')(passport); // pass passport for configuration

// ROOT
router.get('/', (req, res) => {
    let msg = req.flash('success');
    res.render('index', {
        message: msg
    });
});

// LOGIN
router.get('/login', (req, res) => {
    let msg = req.flash('failure');
    res.render('login', {
        message: msg
    });
});

router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true
    })
);

// SECRET
router.get('/secret', isUserAuthenticated, (req, res) => {
    // res.send('You have reached the secret route');
    res.render('secret', {
        message: 'You have reached the secret route'
    });
});

// LOGOUT
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// FUNCTIONS ===============================================
// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.render('secret', {
            message: 'You must login!'
        });
    }
}

module.exports = router;