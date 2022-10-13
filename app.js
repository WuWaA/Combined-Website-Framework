/* imports */
var createError = require('http-errors');
var express = require('express');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var helmet = require('helmet');
var LocalStrategy = require('passport-local');
// var bodyParser = require('body-parser'); // old version

/* import routers */
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users'); // old version

/* core */
var app = express();

/* webpack configuration */
var config = require('./webpack.base.js');
var compiler = webpack(config);

/* mongodb configuration */
var mongoConfig = require('./mongodb-config.js');
var funct = require('./functions.js');

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('combined'));
app.use(express.json());
// app.use(bodyParser.json()); // old version
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true })); // old version
app.use(cookieParser('niceball')); // notice for waring
app.use(helmet()); // security
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/public', express.static(__dirname + '/public')); // old version

app.use(webpackMiddleware(compiler, { publicPath: config.output.publicPath }));

app.use(session({
    secret: 'pseudo', // CHANGE IT FOR ONLINE INSTANCE
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

/* pages */
app.use('/', indexRouter);
// app.use('/', usersRouter); // old version

/* passport */
// Use the LocalStrategy within Passport to sign-in users
passport.use('local-signin', new LocalStrategy({
        passReqToCallback: true
    }, // allows to pass back the request to the callback
    function (req, username, password, done) {
        funct.localAuth(username, password)
            .then(function (user) {
                if (user) {
                    console.log("LOGGED IN AS: " + user.username);
                    req.session.success = 'You are successfully logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT LOG IN");
                    req.session.error = 'Could not log user in. Please try again.'; // inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err) {
                console.log(err.body);
            });
    }
));
// Use the LocalStrategy within Passport to signup users
passport.use('local-signup', new LocalStrategy({
        passReqToCallback: true
    }, // allows to pass back the request to the callback
    function (req, username, password, done) {
        funct.localReg(username, password)
            .then(function (user) {
                if (user) {
                    console.log("REGISTERED: " + user.username);
                    req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT REGISTER");
                    req.session.error = 'That username is already in use, please try a different one.'; // inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err) {
                console.log(err.body);
            });
    }
));

passport.serializeUser(function (user, done) {
    console.log("Serializing " + user.username);
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log("Deserializing " + obj);
    done(null, obj);
});

/* catch 404 and forward to error handler */
app.use(function (req, res, next) {
    next(createError(404));
});

/* error handler */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;