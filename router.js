var express = require('express');
var router = express.Router();
const passport = require('passport');
let User = require('./models/user');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');

const saltRounds = 10;
require('./config/passport')(passport); // pass passport for configuration

// ROOT
router.get('/', (req, res) => {
    let msg = req.flash('success');
    res.render('index', {
        message: msg,
        user: req.user
    });
});

// LOGIN
router.get('/login', (req, res) => {
    let msg = req.flash('failure');
    res.render('login', {
        message: msg,
        user: req.user
    });
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true
    }
));

// REGISTER
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',
    [
        check('username').not().isEmpty().isLength({ min: 3 }),
        check('password').not().isEmpty().isLength({ min: 3 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let msgArray = errors.array().map(a => a.param);
            res.render('register', {
                messageArray: msgArray
            });
        } else {
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                User.create({
                    username: req.body.username,
                    password: hash
                });
            });
            res.redirect('/');
        }
    }
)

// SECRET
router.get('/secret', isUserAuthenticated, (req, res) => {
    res.render('secret', {
        message: 'You have reached the secret route',
        user: req.user
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