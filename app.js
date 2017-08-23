var express    = require('express');
var path       = require('path');
var favicon    = require('serve-favicon');
var logger     = require('morgan');
var cookie     = require('cookie-parser');
var bodyParser = require('body-parser');
var multer	   = require('multer');
var uuid       = require('node-uuid');
var jwt        = require('jsonwebtoken');
var index      = require('./routes/index');
var users      = require('./routes/users');
var apis       = require('./routes/api/Api');
var app        = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '4mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookie());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(err, req, res, next) {
    console.log("path:");
    console.log(req.path);
    next();
});

// app.post('/api/web/file',function(req,res){
//     var fileName = "";
//     var storage =   multer.diskStorage({
//         destination: function (req, file, callback) {
//             callback(null, './uploads');
//         },
//         filename: function (req, file, callback) {
//             var fileExtension = "";
//             if (file.mimetype) {
//                 if (file.mimetype == 'image/jpeg' ){
//                     fileExtension = ".jpg"
//                 }
//                 if (file.mimetype == 'image/png' ){
//                     fileExtension = ".png"
//                 }
//             }
//             fileName = uuid.v4()+fileExtension;
//             callback(null, fileName);
//         }
//     });
//     multer({ storage : storage}).single('userPhoto')(req,res,function (err) {
//         if(err) {
//             res.json({success:false})
//         }
//         res.json({success:true,path:fileName})
//     });
// });


app.use('/api',apis);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
