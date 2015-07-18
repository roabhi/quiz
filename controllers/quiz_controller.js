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
			
			res.render('quizes/index.ejs', {quizes : quizes}); //renderiza index pero sólo con los matches
		}).catch(function(error) {next(error);})
		

	}else { // la peticion NO tiene busqueda
	
		console.log('query has NO search');
		
		models.Quiz.findAll().then(	
		function(quizes) {
			res.render('quizes/index.ejs', {quizes : quizes});
		}).catch(function(error) {next(error);})
	
	}
	
	
	
	
};

//Get /quizes/:id
exports.show = function(req, res) {
	
	models.Quiz.findById(req.params.quizId).then(function(quiz) {	
		res.render('quizes/show', { quiz : req.quiz });	
	})

};

//Get /quizes/:id/answer
exports.answer = function(req, res) {	
	
	var resultado = 'incorrecta :(';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'correcta!';
	}
	
	res.render('quizes/answer', {quiz : req.quiz, respuesta : resultado})	;

};

