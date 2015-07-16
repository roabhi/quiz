﻿var models = require('../models/models.js');


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
	
	models.Quiz.findAll().then(	
		function(quizes) {
			res.render('quizes/index.ejs', {quizes : quizes});
	}).catch(function(error) {next(error);})
	
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

