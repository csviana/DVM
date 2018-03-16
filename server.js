/**
 * File: server.js
 * Description:  Script do servidor dentro do repositório https://github.com/csviana/DVM
 * Author: Cleirton Viana
 * Create Date: 06/03/2017
 */

//Carregando os pacotes
//Carregamento do Socket.io para a comunicação com o Unity 
var io 				= require('socket.io')(2558);
var shortId 		= require('shortid');

//Definindo o ambiente de Request Unity:
//Definindo a array que armazenará os clientes onlines
var clients			= [];

//Conexão ao socket:
io.on('connection', function (socket) {

	//Definindo o usuário atual:
	var currentUser;

	//Informando que um painel de usuário está pronto para logar:
	socket.on('USER_CONNECT', function (){
		console.log('Users Connected ');
		//Informando ao Unity os dados dos usuários conectados:
		for (var i = 0; i < clients.length; i++) {
			socket.emit('USER_CONNECTED',{
				name:clients[i].name,
				id:clients[i].id,
				msg:clients[i].msg,
				position:clients[i].position,
				foto:"nada"
			});
			console.log('User name '+clients[i].name+' is connected..');
		};
	});

	//Recebendo do Unity um novo usuário logado:
	socket.on('PLAY', function (data){
		currentUser = {
			name:data.name,
			id:shortId.generate(),
			position:data.position,
			msg: data.msg,
			foto:"nada"
		}
		
		//Armazenando na Array local o novo usuário cadastrado: 
		clients.push(currentUser);
		//Retornando ao Unity a informação de que o usuário foi cadastrado:
		socket.emit('PLAY',currentUser );
		socket.broadcast.emit('USER_CONNECTED',currentUser);
	});

	//Recebendo do Unity que o usuário foi desconectado:
	socket.on('disconnect', function (){
		socket.broadcast.emit('USER_DISCONNECTED',currentUser);
		//Procura na Array o usuário que foi desconectado e o deleta da Array local:
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].name === currentUser.name && clients[i].id === currentUser.id) {
				console.log("User "+clients[i].name+" id: "+clients[i].id+" has disconnected");
				clients.splice(i,1);
			};
		};
	});

	//Recebe do Unity a atualização de movimento do usuário atual:
	socket.on('MOVE', function (data){
		// currentUser.name = data.name;
		// currentUser.id   = data.id;
		currentUser.position = data.position;
		newmove={
			id:currentUser.id,
			name:currentUser.name,
			position:currentUser.position
		}
		
		//Develve à todos os usuários logados que o usuário atual foi movimentado:
		socket.broadcast.emit('MOVE', newmove);
		console.log(currentUser.name+" Move to "+currentUser.position);
	});
	
	socket.on('MSG', function (data){
		// currentUser.name = data.name;
		// currentUser.id   = data.id;
		currentUser.msg = data.msg;
		newmsg={
			id:currentUser.id,
			name:currentUser.name,
			msg:data.msg
		}
		//Develve à todos os usuários logados que o usuário atual foi movimentado:
		socket.broadcast.emit('MSG', newmsg);
		console.log(currentUser.name+" Escreveu: "+currentUser.msg);
	});
});

console.log("------- RECEBENDO DADOS DOS CLIENTES UNITY -------");


//Carregando pacotes de roteamento:
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
//mongoose.connect('mongodb://webdevs:senhadeteste1234@ds012538.mlab.com:12538/dvm', {
	mongoose.connect('mongodb://localhost:27017', {
	useMongoClient: true
});

 //Configuração variável para usar a função bodyParser():
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());

//Carregando os pacotes para a comunicação segura
const https = require('https');
const fs = require('fs');

//Carregando as chaves de acesso criptografado:
var key = fs.readFileSync('encryption/key.pem', 'utf8');
var cert = fs.readFileSync( 'encryption/server.crt', 'utf8')

var options = {
    key: key,
	cert: cert,
	ca: 'https://acme-v01.api.letsencrypt.org/directory'
  };
 
  //Definindo as rotas:
   //Chamada das rotas predefinidas:
 var product_router = require('./src/products/products.routes');
 var loja_router = require('./src/lojas/lojas.routes');
 
 //Rota padrão:
 app.get('/', function(req, res){
    res.render('index');
 });

 // app.use('/', express.static('web'));
  app.use('/apk', express.static('apk'));

//Definindo a rota de contato:
app.get('/contacts', function(req, res){
    res.render('contacts');
 });

 //Rotas dos produtos:
 app.use('/produtos', product_router);
  //Rotas dos produtos:
  app.use('/lojas', loja_router);

  //iniciando a aplicação:
  app.listen(80);
//Abrind a conexão segura:
https.createServer(options, app).listen(443);


	
/*
//const fs = require('fs');
var imagemin = require('image-min');
var path = require('path');
 
var src = fs.createReadStream('new.png');
var ext = path.extname(src.path);
 
src
    .pipe(imagemin({ ext: ext }))
	.pipe(fs.createWriteStream('img-minified' + ext));


//Carregando a biblioteca para a conexão com o Mongo
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Coneectando com a URL
const url = 'mongodb://localhost:27017';
 
// Definindo o nome do banco de dados
const dbName = 'dvm';
 
// Usando o método de comunicação com o servidor mongo
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Conectado com o servidor Mongo");
 
  const db = client.db(dbName);
 
  client.close();
});
*/
