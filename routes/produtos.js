/**
	* File: produtos.js
	* Description:  Script responsável pelas rotas dos produtos - repositório https://github.com/csviana/DVM
	* Author: Cleirton Viana
	* Create Date: 23/03/2017
*/

//Carregando as dependências:
const router = require("express").Router();
const mongo = require("mongojs");
const db = mongo("dvm", ['produtos']);
const fs = require("fs");
const formidable = require('formidable');

//Definindo a rota para o carregamento de todas as produtos
router.get("/", (req, res, next)=>{
	db.produtos.find((err, produtos) => {
		if (err) return next(err);
		res.json(produtos);
	});
});

//Definindo a rota de carregamento de um produto
router.get("/:id", (req, res, next)=>{
	db.produtos.findOne({_id: mongo.ObjectId(req.body.id)}, (err, produto) => {
		if (err) return next(err);
		res.json(produto);
	});
});

//Definindo a rota de cadastramento do produto
router.post("/", (req, res, next)=>{
	const produto = req.body;
	if (!(produto.isDone + '')) {
		res.status(400).json({
			error: "Bad Data"
		});
		} else {
		
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			produto.im= base64_encode(files.img.name)
			console.log('File uploaded: ' + files.img.name);
		});
		
		db.produtos.save(produto, (err,produto)=>{
			if(err) return next(err);
			res.json(produto);
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