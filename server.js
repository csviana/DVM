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

//Carregando pacotes de roteamento:
const request = require('request');
var express = require('express');
var app = express();

//Carregando os pacotes para a comunicação segura
const https = require('https');
const fs = require('fs');


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
				position:clients[i].position
			});
			console.log('User name '+clients[i].name+' is connected..');
		};
	});

	//Recebendo do Unity um novo usuário logado:
	socket.on('PLAY', function (data){
		currentUser = {
			name:data.name,
			id:shortId.generate(),
			position:data.position
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
		
		//Develve à todos os usuários logados que o usuário atual foi movimentado:
		socket.broadcast.emit('MOVE', currentUser);
		console.log(currentUser.name+" Move to "+currentUser.position);
	});
});

console.log("------- RECEBENDO DADOS DOS CLIENTES UNITY -------");

//Carregando o ambiente de conexão segura:
var key = fs.readFileSync('encryption/host.key');
var cert = fs.readFileSync( 'encryption/host.crt' );
var ca = fs.readFileSync( 'encryption/host.crt' );

var options = {
    key: key,
    cert: cert,
    ca: ca
  };

  //Criando alias para a uma pasta para se carregada na raiz:
  app.use('/', express.static('web'));
  app.use('/apk', express.static('apk'));
  var port = process.env.port || 80;
  //iniciando a aplicação:
  app.listen(port);
//Abrind a conexão segura:
https.createServer(options, app).listen(443);