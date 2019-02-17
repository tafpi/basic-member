// Required dependencies 
const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const router = require('./router');

// database connection
mongoose.connect('mongodb://localhost:27017/basic-member', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("we're connected!");
});

app.use(morgan('dev'));

// cookieSession config
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// view engine
app.set('view engine', 'pug');

// routing
app.use('/', router);

// port
app.listen(8000, () => {
    console.log('Server Started!');
});