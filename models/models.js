var path = require("path");

// Postgres DATABASE_URL =  postgres://user:pass@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var dialect = (url[1] || null);
var protocol = (url[1] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var host = (url[4] || null);
var port = (url[5] || null);
var db_name = (url[6] || null);
var storage = process.env.DATABASE_STORAGE;
// Cargar Modelo ORM
var Sequelize = require("sequelize");

// usar BBDD SQLite
var sequelize = new Sequelize(db_name,user,pwd,
                              {dialect: protocol,
                               protocol: protocol,
                               port: port,
                               host: host,
                               storage: storage,
                               omitNull: true});

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,"quiz"));

exports.Quiz = Quiz; // exporta la definicion de la tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
    // sucess(...) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function(count){
        if(count === 0){ // la tabla se inicializa solo si esta vacia
           Quiz.create({
                pregunta: "Capital de Italia",
                respuesta: "roma"
            }); 
            Quiz.create({
                pregunta: "Capital de Portugal",
                respuesta: "Lisboa"
            }).then(function(){
                console.log("Base de datos inicializada");
            });
        }
    });
});