var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//const hbs = require('hbs');// Define Handlebars helper to format dates

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



//3A. declare router (1 collection => 1 router )
var facultyRouter = require('./routes/faculty');
var marketingManagerRouter = require('./routes/marketingmanager');
var roleRouter = require("./routes/role");
var marketingCoordinatorRouter = require('./routes/marketingcoordinator');
var studentRouter = require('./routes/student');

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
app.use('/faculty', facultyRouter);
app.use('/marketingmanager', marketingManagerRouter);
app.use('/role', roleRouter);
app.use('/marketingcoordinator', marketingCoordinatorRouter);
app.use('/student', studentRouter);

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

//----------------------------------------
//support edit function
// hbs.registerHelper('formatDate', function(date) {
//   return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
// });

// Define Handlebars helper to compare values
// hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
//   if (arguments.length < 3) {
//       throw new Error("Handlebars Helper 'ifCond' needs 2 parameters");
//   }

//   let result;

//   // Log the operator parameter for debugging
//     console.log("Operator:", operator);

//   if (operator === '==') {
//       result = (v1 == v2);
//   } else if (operator === '===') {
//       result = (v1 === v2);
//   } else if (operator === '!=') {
//       result = (v1 != v2);
//   } else if (operator === '!==') {
//       result = (v1 !== v2);
//   } else if (operator === '<') {
//       result = (v1 < v2);
//   } else if (operator === '<=') {
//       result = (v1 <= v2);
//   } else if (operator === '>') {
//       result = (v1 > v2);
//   } else if (operator === '>=') {
//       result = (v1 >= v2);
//   } else if (operator === '&&') {
//       result = (v1 && v2);
//   } else if (operator === '||') {
//       result = (v1 || v2);
//   } else {
//       throw new Error("Handlebars Helper 'ifCond' doesn't know the operator " + operator);
//   }

//   if (result) {
//       return options.fn(this);
//   } else {
//       return options.inverse(this);
//   }
// });

// Define Handlebars helper to compare values
// hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
//   if (arguments.length < 3) {
//       throw new Error("Handlebars Helper 'ifCond' needs 2 parameters");
//   }

//   let result;

//   // Log the operator parameter for debugging
//   console.log("Operator:", operator);

//   switch (operator) {
//       case '==':
//           result = (v1 == v2);
//           break;
//       case '===':
//           result = (v1 === v2);
//           break;
//       case '!=':
//           result = (v1 != v2);
//           break;
//       case '!==':
//           result = (v1 !== v2);
//           break;
//       case '<':
//           result = (v1 < v2);
//           break;
//       case '<=':
//           result = (v1 <= v2);
//           break;
//       case '>':
//           result = (v1 > v2);
//           break;
//       case '>=':
//           result = (v1 >= v2);
//           break;
//       case '&&':
//           result = (v1 && v2);
//           break;
//       case '||':
//           result = (v1 || v2);
//           break;
//       default:
//           console.error("Unknown operator:", operator);
//           result = false; // Assuming false for unknown operator
//   }

//   if (result) {
//       return options.fn(this);
//   } else {
//       return options.inverse(this);
//   }
// });



module.exports = app;
