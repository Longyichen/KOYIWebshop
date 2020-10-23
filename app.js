var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var login = require('./routes/login');
// var register = require('./routes/register');
var myAccount = require('./routes/myaccount');
var contact = require('./routes/contact');
var aboutUS = require('./routes/about-us');
var cart = require('./routes/cart');
var checkout = require('./routes/checkout');
var shop = require('./routes/shop');
var product = require('./routes/product');
var wishlist = require('./routes/wishlist');
// var order = require('./routes/order');

var app = express();

// view engine setup
var ejs = require('ejs');
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

//路由分配
app.use('/', indexRouter);
// app.use('/users', usersRouter);//待修改
app.use('/login', login);
// app.use('/register', register);//待修改
app.use('/my-account', myAccount);
app.use('/contact', contact);
app.use('/about-us', aboutUS);
app.use('/cart', cart);
app.use('/checkout', checkout);
app.use('/shop', shop);
app.use('/product', product);
app.use('/wishlist', wishlist);
// app.use('/order', order);

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
