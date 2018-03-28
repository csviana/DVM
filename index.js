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
var count = 0;

//Conexão ao socket:
io.on('connection', function (socket) {
	/*
	var $ipAddress = socket.handshake.address;

  if (!$ipsConnected.hasOwnProperty($ipAddress)) {

  $ipsConnected[$ipAddress] = 1;
*/


  




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
				ip: clients[i].ip,
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
			ip: socket.handshake.address,
			foto:"nada"
		}
		
		//Armazenando na Array local o novo usuário cadastrado: 
		clients.push(currentUser);
		//Retornando ao Unity a informação de que o usuário foi cadastrado:
		socket.emit('PLAY', currentUser);
		socket.broadcast.emit('USER_CONNECTED',currentUser);
	});
	
	//Recebendo do Unity que o usuário foi desconectado:
	socket.on('disconnect', function (){
			socket.broadcast.emit('USER_DISCONNECTED',currentUser);
		//Procura na Array o usuário que foi desconectado e o deleta da Array local:
		

				for (var i = 0; i < clients.length; i++) {
					try{
			if (clients[i].name === currentUser.name && clients[i].id === currentUser.id) {
				console.log("User "+clients[i].name+" id: "+clients[i].id+" has disconnected");
				clients.splice(i,1);
			}
		}catch(ex){console.log(ex);}
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

//----------------------------------------------------------------------------------------//

//Carregando pacotes de roteamento:
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

//Definindo a engine view da API
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//Configuração variável para usar a função bodyParser():
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Carregando os pacotes para a comunicação segurança
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
var product_router = require('./routes/produtos');
var loja_router = require('./routes/lojas');
var venda_router = require('./routes/vendas');
var functions_router = require('./routes/func');
var usuario_router = require('./routes/usuarios');

//Definindo a rota raiz
app.get('/', function(req, res, next){
	res.render('index' , { /*posts: body*/ });
	next();
});

app.use('/apk',express.static('public/apk'));

//Rotas dos usuários:
app.use('/usuarios', usuario_router);
//Rotas dos produtos:
app.use('/produtos', product_router);
//Rotas das lojas:
app.use('/lojas', loja_router);
//Rotas das vendas:
app.use('/vendas', venda_router);
//Rotas das funções:
app.use('/func', functions_router);

//iniciando a aplicação:
app.listen(80);
//Abrind a conexão segura:
https.createServer(options, app).listen(443);