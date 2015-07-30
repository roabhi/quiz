var models = require('../models/models.js');


//Autoload - factoriza el código si ruta inlucye :quizId
exports.load =  function(req, res, next, quizId) {

	models.Quiz.findById(quizId).then(
		function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			}else {next (new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error){ next(error);});

};

//Get /quizes
exports.index = function(req,res) {
	

	if(req.query.search) { //la petición contiene una busqueda - Ejericion obligatorio modulo 7
		
		console.log('query has search and is ' + req.query.search); // Muestra por consola la busqueda
		
		var search = req.query.search; // pasa la busqueda a var
      	search = search.split(" ").join('%'); //sustituye espacios
		search = '%' + search + '%'; //encapsula en %
	
		console.log('search normalizado es ' + search); //muestra por consola que la busqueda se ha normalizado para ser trazada en la BD		
		
		models.Quiz.findAll({where: ["lower(pregunta) like lower(?)", search], order: 'pregunta ASC'}).then(	// Usa minúsculas y orderna de manera ascendente
		function(quizes) {
			
			console.log('quizes are ' + quizes); //muestra por consola los objetos encontrados
			
			res.render('quizes/index.ejs', {quizes : quizes, errors : [] }); //renderiza index pero sólo con los matches
		}).catch(function(error) {next(error);})
		

	}else { // la peticion NO tiene busqueda
	
		console.log('query has NO search');
		
		models.Quiz.findAll().then(	
		function(quizes) {
			res.render('quizes/index.ejs', { quizes : quizes, errors : [] });
		}).catch(function(error) {next(error);})
	
	}
	
	
	
	
};

//Get /quizes/:id
exports.show = function(req, res) {
	
	models.Quiz.findById(req.params.quizId).then(function(quiz) {	
		res.render('quizes/show', { quiz : req.quiz, errors : [] });	
	})

};

//Get /quizes/:id/answer
exports.answer = function(req, res) {	
	
	var resultado = 'incorrecta :(';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'correcta!';
	}
	
	res.render('quizes/answer', {quiz : req.quiz, respuesta : resultado, errors : [] });

};

//Get /quizes/new
exports.new = function(req, res) {
	
	var quiz = models.Quiz.build(
		{ pregunta : 'Pregunta', respuesta : 'Respuesta', tema : 'Tema' }
	);
	res.render('quizes/new', { quiz : quiz, errors : [] });
};


//Post /quizes/create
exports.create = function(req, res) {

	var quiz = models.Quiz.build( req.body.quiz );
	
	//guarda en DB los campos pregunta y respuesta de quiz previa validación	
	quiz
	.validate() //valida
	.then(
		function(err) {
			if (err) { //si ocurre un error de validación
				res.render('quizes/new', { quiz : quiz, errors : err.errors });
			}else { // sin errores
				quiz 
				.save({ fields : ['pregunta', 'respuesta', 'tema'] })// guarda en DB
				.then( function(){ res.redirect('/quizes')})// redirecciona
			}
		});
};


exports.edit = function(req, res) {

	var quiz = req.quiz; //autoload de instancia quiz
	res.render('quizes/edit', {quiz: quiz, errors : [] });

};

exports.update = function(req, res) {

	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	
	req.quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}else {
				req.quiz //save: guarda campos pregunta, respuesta y tema en DB
				.save({ fields : ['pregunta', 'respuesta', 'tema'] })
				.then( function() { res.redirect('/quizes');});
			}
		}
	);
};

exports.destroy = function(req, res) {

	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error) { next(error) });

};
