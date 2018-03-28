/**
	* File: produtos.js
	* Description:  Script responsável pelas rotas dos produtos - repositório https://github.com/csviana/DVM
	* Author: Cleirton Viana
	* Create Date: 28/03/2017
*/

//Carregando as dependências:
const router = require("express").Router();
const mongo = require("mongojs");
const db = mongo("dvm", ['vendas']); //Carregando o mongodb em localhost
const formidable = require('formidable');
const fs = require("fs");

//Definindo a rota para o carregamento de todas as vendas
router.get("/", (req, res, next)=>{
	db.vendas.find((err, vendas) => {
		if (err) return next(err);
		res.json(vendas);
	});
});

//Definindo a rota de carregamento de uma venda
router.get("/:id", (req, res, next)=>{
	db.vendas.findOne({_id: mongo.ObjectId(req.body.id)}, (err, venda) => {
		if (err) return next(err);
		res.json(venda);
	});
});

//Definindo a rota de cadastramento da venda
router.post("/", (req, res, next)=>{
	const venda = req.body;
	if (!(venda.isDone + '')) {
		res.status(400).json({
			error: "Bad Data"
		});
		} else {
		
		db.vendas.save(venda, (err,venda)=>{
			if(err) return next(err);
			res.json(venda);
		});
	}
});

//Definindo a rota de exclusão da venda
router.delete("/:id", (req, res, next)=>{
	db.vendas.remove({_id: mongo.ObjectId(req.body.id)}, (err, result)=>{
		if(err) return next(err);
		res.json(result);
	});
});

//Definindo a rota de atualização da venda
router.put("/:id", (req, res, next)=>{
	const venda = req.body;
	
	if(!venda.isDone){
		res.status(400).json({
			error: "Bad Request"
		});
		}else{
		db.vendas.findAndModify({
			query: { _id: mongo.ObjectId(req.body.id) },
			update: { $set: {venda} },
			new: true
			}, function (err, doc, lastErrorObject) {
			if(err) return next(err);
		});
	}
});

module.exports = router;