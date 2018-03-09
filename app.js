/**
 * File: app.js
 * Description:  Script da Aplicação dentro do repositório https://github.com/csviana/DVM
 * Author: Cleirton Viana
 * Create Date: 06/03/2017
 */

//Configurar o setup da aplicação
//Chamada dos pacotes:
const request = require('request');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

 //Definindo a engine view da API
 app.engine('ejs', require('ejs').renderFile);
 app.set('view engine', 'ejs');

 //Criando uma instância das rotas vias Express:
 mongoose.Promise = global.Promise;  
 //URI do MLab
 mongoose.connect('mongodb://webdevs:senhadeteste1234@ds012538.mlab.com:12538/dvm', {
    useMongoClient: true
 });

 //Configuração variável para usar a função bodyParser():
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());

 

 //-------------DEFININDO AS ROTAS

 //Chamada das rotas predefinidas:
 var product_router = require('./src/products/products.routes');
 
 //Rota padrão:
 app.get('/', function(req, res){
    res.render('index');
 });

 //Definindo a rota de contato:
 app.get('/contacts', function(req, res){
    res.render('contacts');
 });

 //Rotas dos produtos:
 app.use('/products', product_router); //register the routes


 //Definindo a porta da API:
 var port = process.env.port || 8000;
 //iniciando a aplicação:
 app.listen(port);
 console.log('Iniciando a porta ' + port);