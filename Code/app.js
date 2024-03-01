var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//3A. declare router (1 collection => 1 router )
var marketingManagerRouter = require('./routes/marketingmanager');
var facultyRouter = require('./routes/faculty');

var app = express();

//1. config mongoose library (connect and work with database)
//1A. import library
var mongoose = require('mongoose');
//1B. set mongodb connection string
//Note1: Database name: COMP1640-TCH2402
//Note2: localhost got error --> change to 127.0.0.1
var database = "mongodb://127.0.0.1:27017/COMP1640-TCH2402";
//1C. connect to mongodb
mongoose.connect(database)
  .then(() => console.log('connect to db sucess'))
  .catch((err) => console.log('connect to db fail' + err));

//2. config body-parser library (get data from client-side)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//3B. declare web URL of router
app.use('/marketingmanager', marketingManagerRouter);
app.use('/faculty', facultyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
