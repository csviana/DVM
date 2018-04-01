/**
	* File: usuarios.js
	* Description:  Script responsável pelas rotas dos usuários - repositório https://github.com/csviana/DVM
	* Author: Cleirton Viana
	* Create Date: 23/03/2017
*/

//Carregando as dependências:
const router = require("express").Router();
const mongo = require("mongojs");
const db = mongo("dvm", ['usuarios']); //Carregando o mongodb em localhost
const formidable = require('formidable');
const request = require('request');

const fs = require("fs");

//Esta chave é temporária e limitada para o host csviana.ddns.net
//Altere-a para a sua chave da API Google Maps
var key="AIzaSyDoP_k20pvexaV5P-_Z2kOenxD8q3my3jY";
//Definindo a rota para o carregamento de todas as usuários
router.get("/", (req, res, next)=>{
	db.usuarios.find((err, usuarios) => {
		if (err) return next(err);
		res.json(usuarios);
	});
});

//Definindo a rota de carregamento de um usuário
router.get("/:id", (req, res, next)=>{
	db.usuarios.findOne({_id: mongo.ObjectId(req.body.id)}, (err, usuario) => {
		if (err) return next(err);
		res.json(usuario);
	});
});

//Definindo a rota de cadastramento do usuário
router.post("/", (req, res, next)=>{
	const usuario = req.body;
	if (!(usuario.isDone + '')) {
		res.status(400).json({
			error: "Bad Data"
		});
		} else{
		db.usuarios.findOne({em:req.body.em}, (err, user) => {
			if (err) return next(err);
			try{
				if(usuario.sn!=null){
					if (usuario.sn==user.pw){
						return res.json({_id:user._id,nome:user.nome});
					}else{return res.json({err:"email ou senha inválida"});}
				}	
				
			}catch(ex){console.log("Erro no login"); return res.json({err:"email ou senha inválida"});}
			
			try{
				if (user.em == req.body.em)return res.json({err:"usuário já existe"});
			}catch(ex){console.log("Erro ao comprar emails")}
			
			usuario.rt="0,0,0";
			usuario.ps="0,0,0";
			
			var el = req.body.eu;
			var endereço;
			var lat;
			var lng;
			var url = "https://maps.google.com/maps/api/geocode/json?key="+key+"&address="+el+"&components=country:BR";
			request({
				url: url,
				json: true
				}, function (error, response, body) {
				
				if (!error && response.statusCode === 200) {
					if(body.results[0]){
						console.log("pegou endereço");
						endereço = body.results[0].formatted_address;
						usuario.eu = endereço;
						usuario.gm={lat:body.results[0].geometry.location.lat,lng:body.results[0].geometry.location.lng}
					}
				}
				db.usuarios.save(usuario, (err,usuario)=>{
					if(err) return next(err);
					res.json(usuario);
				});
			});
		});
		
	}
	
});


//Definindo a rota de exclusão do produto
router.delete("/:id", (req, res, next)=>{
	db.usuarios.remove({_id: mongo.ObjectId(req.body.id)}, (err, result)=>{
		if(err) return next(err);
		res.json(result);
	});
});

//Definindo a rota de atualização da usuário
router.put("/:id", (req, res, next)=>{
	const usuario = req.body;
	
	if(!usuario.isDone){
		res.status(400).json({
			error: "Bad Request"
		});
		}else{
		db.usuarios.findAndModify({
			query: { _id: mongo.ObjectId(req.body.id) },
			update: { $set: {usuario} },
			new: true
			}, function (err, doc, lastErrorObject) {
			if(err) return next(err);
		});
	}
});


//Função de download
var download = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
		//console.log('content-type:', res.headers['content-type']);
		//console.log('content-length:', res.headers['content-length']);
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

//Codificador da imagem do usuário em base64
function base64_encode(file) {
	var bitmap = fs.readFileSync(file);
	return new Buffer(bitmap).toString('base64');
}

module.exports = router;