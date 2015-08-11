var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//usa partials para la generaciÛn de vistas
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Modulo 8.1 false a true
/*app.use(cookieParser('Quiz 2015'));
app.use(session());*/
app.use(cookieParser('Quiz 2015'));
app.use(session({
	secret: 'Quiz 2015',
	resave: false,
	saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers Din·micos:
app.use(function(req, res, next) {

  // Guardar Path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

//Auto-Logout
app.use(function(req, res, next) {
  
if (req.session.user) { //Si estmamos logeados - existe user
    
	var max = 120000; // 2 * 60 * 1000 => 2 minutos x 60 segundos x 1000 milisegundos
    var rightNow = (new Date()).getTime(); //Guarda el tiempo actual en cada transaccion
    if (!req.session.timestamp) { //Si no existe timestamp en session
      req.session.timestamp = rightNow; //crea timestamp en session con el valor de rightNow
    } else { //Si ya existe
      if (rightNow - req.session.timestamp > max) { //Si el valor de rightNow menos el tiempo acumulado desde la √∫ltima transaccion es mayor que max (2 minutos)
        delete req.session.timestamp; //Borra la variable que guarda el tiempo actual
		delete req.session.user; //Borra la sesi√≥n     
		console.log('Logout por inactividad'); //Prompt cierre de session		
      } else {
        req.session.timestamp = rightNow; //Si no hemos llegado al m√°ximo de inactividad cambia timestamp por el nuevo valor de rightNow
      }
    }
  } 
  
  next(); //Siguiente 
});

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
			errors: [] //Array de errores de validacion paso 12
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
		errors: [] //Array de errores de validacion paso 12
    });
});


module.exports = app;
