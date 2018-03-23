/**
 * File: server.js
 * Description:  Script do servidor dentro do repositório https://github.com/csviana/DVM
 * Author: Cleirton Viana
 * Create Date: 06/03/2017
 */
'use strict';
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
var path = require('path');
//var onHeaders = require('on-headers');
//var expiry = require('static-expiry');
//var cookieParser = require('cookie-parser');

// load the cookie-parsing middleware
//app.use(cookieParser());


//Definindo a engine view da API
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

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



var options2 = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html', 'css', 'ejs', 'js'],
	index: false,
	maxAge: '0',
	redirect: false,
	lastModified: false,
	setHeaders: function (res, path, stat) {
	  //res.set('x-timestamp', Date.now())
	}
  }
 
  //Definindo as rotas:
   //Chamada das rotas predefinidas:
 var product_router = require('./routes/products.routes');
 var loja_router = require('./routes/lojas');
 var functions_router = require('./routes/func');
 
 //Rota padrão:
 //var date = new Date();
 //var expiração = new Date(date.setTime( date.getTime() + 30 * 86400000 ));

 app.get('/', function(req, res, next){
	
	
	//res.header('cache-control', 'public, max-age=360000');
	//app.setHeader('Expires', expiração.toUTCString())
	//app.setHeaders=setFontHeaders
	/*
	var url = "http://localhost/lojas/"
	
	request({
		url: url,
		json: true
	}, function (error, response, body) {


		if (!error && response.statusCode === 200) {
			//console.log(body) // Print the json response
		
	*/
    //res.render('blog/index', { posts: blogPosts });
	res.render('index' , { /*posts: body*/ });
	next();
});

app.use('/', express.static(__dirname + '/views'));

//app.use('/public',express.static(__dirname + '/public'));

/*app.use('/', express.static('views', {
	setHeaders: setFontHeaders,
	maxAge:"1d", // <- does not do anything
	lastModified: false, // <- removes Last-Modified header
	eTag: false // <- removes Etag header
  }));
 //Definindo as rotas estáticas:
  app.use('/apk', express.static('public/apk', {
	setHeaders: setFontHeaders,
	maxAge:"1d", // <- does not do anything
	lastModified: false, // <- removes Last-Modified header
	eTag: false // <- removes Etag header
  }));
  /*
  app.use('/build', express.static('public/build', {
	setHeaders: setFontHeaders,
	maxAge:"1d", // <- does not do anything
	lastModified: false, // <- removes Last-Modified header
	eTag: false // <- removes Etag header
  }));
  app.use('/scripts', express.static('public/scripts', {
	setHeaders: setFontHeaders,
	maxAge:"1d", // <- does not do anything
	lastModified: false, // <- removes Last-Modified header
	eTag: false // <- removes Etag header
  }));
  app.use('/styles', express.static('public/styles', {
	
	setHeaders: setFontHeaders,
	maxAge:"1d", // <- does not do anything
	lastModified: false, // <- removes Last-Modified header
	eTag: false // <- removes Etag header
  }));

*/
//Definindo a rota de contato:
//app.get('/contatos', function(req, res){
  //  res.render('layouts/contacts');
 //});

 //Rotas dos produtos:
app.use('/produtos', product_router);
  //Rotas das lojas:
  app.use('/lojas', loja_router);
  //Rotas das lojas:
  app.use('/func', functions_router);

/*

  function setFontHeaders(res) {

	res.setHeader("Cache-Control", "public, max-age=86400, immutable"); // HTTP 1.1.
	//response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
	//response.setHeader("Expires", expiração); // Proxies.
	//res.header('expires', expiração.toUTCString());
	//res.header('cache-control', 'public, max-age=360000');
	//res.header('expires', expiração.toUTCString());
	//res.setHeader('Expires', expiração.toUTCString())
  
	onHeaders(res, function () {
	 //res.removeHeader('Cache-Control');
	})
  }

*/
   // require("jquery")(window);
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
