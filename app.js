const express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  flash    = require('connect-flash'),
  passport = require('passport'),
  session  = require('express-session'),
  bodyParser   = require('body-parser'),
  indexRouter = require('./routes/index'),
  apiRouter = require('./routes/api');
  loginRouter = require('./routes/login')
  configPassport = require('./config/passport.js');


var app = express();

configPassport(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

// for passport
app.use(session({ secret: 'groupdos' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // flash messages stored in session

// once passport is setup, it is passed to the function in signup.js
loginRouter(app, passport);

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
