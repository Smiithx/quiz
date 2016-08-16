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
    res.render("quizes/show",{Quiz: req.quiz}); 
};

// GET /quizes/answer
exports.answer = function(req,res){
    var resultado = "Incorrecto";
    if(req.query.respuesta.toLowerCase() === req.quiz.respuesta){
        resultado = "Correcto";
    }
    res.render("quizes/answer", {Quiz: req.quiz,respuesta : resultado});

};

// GET /quizes
exports.index = function(req,res, next){
    models.Quiz.findAll().then(function(quizes){
        res.render("quizes/index.ejs",{Quizes: quizes});  
    }).catch(function(error){next(error);});
};