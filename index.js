// Required dependencies 
const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

let User = require('./models/user');

// database connection
mongoose.connect('mongodb://localhost:27017/basic-member', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // console.log(db);
    console.log("we're connected!");
});

app.use(morgan('dev'));

// cookieSession config
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
app.use(flash());

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// Strategy config
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                console.log('uname');
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password != password) {
                console.log('pword');
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log('corr');
            return done(null, user, 'message sample');
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// view engine
app.set('view engine', 'pug');

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You must login!');
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('index');
});


app.get('/login', (req, res) => {
    console.log(req.flash('message'));
    res.render('login', {
        message: req.flash()
    });
});

app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true
    })
);

// Secret route
app.get('/secret', isUserAuthenticated, (req, res) => {
    res.send('You have reached the secret route');
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(8000, () => {
    console.log('Server Started!');
});