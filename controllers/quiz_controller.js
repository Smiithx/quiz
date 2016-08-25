var models = require("../models/models.js");

exports.load = function(req,res,next,quizId){
    models.Quiz.findById(quizId).then(
        function(quiz){
            if(quiz){
                req.quiz=quiz;
                next();
            }else{
                next(new Error("No existe quizId = " + quizId));
            }
        }
    ).catch(function(error){ next(error);});
}

// GET /quizes/:id
exports.show = function(req,res){
    res.render("quizes/show",{Quiz: req.quiz, errors: []}); 
};

// GET /quizes/answer
exports.answer = function(req,res){
    var resultado = "Incorrecto";
    if(req.query.respuesta.toLowerCase() === req.quiz.respuesta){
        resultado = "Correcto";
    }
    res.render("quizes/answer", {Quiz: req.quiz,respuesta : resultado, errors: []});

};

// GET /quizes
exports.index = function(req,res, next){
    models.Quiz.findAll().then(function(quizes){
        res.render("quizes/index.ejs",{Quizes: quizes, errors: []});  
    }).catch(function(error){next(error);});
};

// GET /quizes/new
exports.new = function(req,res){
    var quiz = models.Quiz.build( // crea objeto quiz
        {pregunta: "Pregunta", respuesta: "Respuesta"}
    );
    res.render("quizes/new",{quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req,res){
    var quiz = models.Quiz.build( // crea objeto quiz
        req.body.quiz
    );
    quiz.validate().then(function(err){
        if(err){
            res.render("quizes/new",{quiz: quiz,errors: err.errors});
        }else{
            // guarda en DB los campos pregunta y respuesta de Quiz
            quiz.save({
                fields: ["pregunta","respuesta"]
            }).then(function(){
                res.redirect("/quizes");
            });
            // res.redirect: Redirección HTTP a lista de preguntas
        }
    });
};
