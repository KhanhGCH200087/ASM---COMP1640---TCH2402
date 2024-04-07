var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//import "express-session" library
var session = require('express-session');

const hbs = require('hbs');// Define Handlebars helper to format dates

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//------------------------------------------------------------
//3A. declare router (1 collection => 1 router )
var facultyRouter = require('./routes/faculty');
var marketingManagerRouter = require('./routes/marketingmanager');
var roleRouter = require("./routes/role");
var marketingCoordinatorRouter = require('./routes/marketingcoordinator');
var studentRouter = require('./routes/student');
var adminRouter = require('./routes/admin');
var contributionRouter = require('./routes/contribution');
var eventRouter = require('./routes/event');

var authRouter = require('./routes/auth'); // for login, logout

var app = express();
//---------------------------------------------------------------

//set session timeout
const timeout = 10000 * 60 * 60 * 24;  // 24 hours (in milliseconds), 60 minutes, 60 seconds
//config session parameters
app.use(session({
  secret: "the_key",                 // Secret key for signing the session ID cookie
  resave: false,                     // Forces a session that is "uninitialized" to be saved to the store
  saveUninitialized: true,           // Forces the session to be saved back to the session store
  cookie: { maxAge: timeout },
}));
//----------------------------------------------------------------

//1. config mongoose library (connect and work with database)
//1A. import library
var mongoose = require('mongoose');
//1B. set mongodb connection string
//Note2: localhost got error --> change to 127.0.0.1
var database = "mongodb://127.0.0.1:27017/COMP1640-Test" //link offline
//var database = "mongodb+srv://thanhpham:1@comp1640.u0yepfl.mongodb.net/COMP1640-Online" //link online, database: COMP1640-Online 
//1C. connect to mongodb
mongoose.connect(database)
  .then(() => console.log('connect to db sucess'))
  .catch((err) => console.log('connect to db fail' + err));

  //-------------------------------------------------------------------
//2. config body-parser library (get data from client-side)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

//---------------------------------------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//-----------------------------------------------------------------------
//make session value can be accessible in view (hbs)
//IMPORTANT: place this code before setting router url
app.use((req, res, next) => {
  
  res.locals.email = req.session.email;
  res.locals.role = req.session.role;
  next();
});
//-------------------
// //set user authorization for whole router
//IMPORTANT: place this code before setting router url
const { checkAdminSession } = require('./middlewares/auth');
app.use('/admin', checkAdminSession);
//-----------------------------------------------------------------------

app.use('/', indexRouter);
app.use('/users', usersRouter);

//-------------------------------------------------------------------
//3B. declare web URL of router
app.use('/faculty', facultyRouter);
app.use('/marketingmanager', marketingManagerRouter);
app.use('/role', roleRouter);
app.use('/marketingcoordinator', marketingCoordinatorRouter);
app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/contribution', contributionRouter);
app.use('/event', eventRouter);

app.use('/auth', authRouter);

//----------------------------------------------------------------------------

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
hbs.registerHelper('formatDate', function(date) {
  return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
});



module.exports = app;
