/**
	* File: produtos.js
	* Description:  Script responsável pelas rotas dos produtos - repositório https://github.com/csviana/DVM
	* Author: Cleirton Viana
	* Create Date: 23/03/2017
*/

//Carregando as dependências:
const router = require("express").Router();
const mongo = require("mongojs");
const db = mongo("dvm", ['usuarios']); //Carregando o mongodb em localhost
const formidable = require('formidable');
const fs = require("fs");

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
		} else {
		
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			usuario.im= base64_encode(files.img.name)
			console.log('File uploaded: ' + files.img.name);
		});
		
		db.usuarios.save(produto, (err,usuario)=>{
			if(err) return next(err);
			res.json(usuario);
		});
	}
});

//Definindo a rota de exclusão do produto
router.delete("/:id", (req, res, next)=>{
	db.produtos.remove({_id: mongo.ObjectId(req.body.id)}, (err, result)=>{
		if(err) return next(err);
		res.json(result);
	});
});

//Definindo a rota de atualização da produto
router.put("/:id", (req, res, next)=>{
	const produto = req.body;
	
	if(!produto.isDone){
		res.status(400).json({
			error: "Bad Request"
		});
		}else{
		db.produtos.findAndModify({
			query: { _id: mongo.ObjectId(req.body.id) },
			update: { $set: {produto} },
			new: true
			}, function (err, doc, lastErrorObject) {
			if(err) return next(err);
		});
	}
});

//Codificador da imagem do produto em base64
function base64_encode(file) {
	var bitmap = fs.readFileSync(file);
	return new Buffer(bitmap).toString('base64');
}

module.exports = router;