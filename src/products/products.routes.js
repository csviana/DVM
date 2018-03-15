/**
	* File: products.routes.js
	* Description:  Script responsável pelas rotas do produto - repositório https://github.com/csviana/DVM
	* Author: Cleirton Viana
	* Create Date: 06/03/2017
*/

//Carregando os pacotes
var express = require('express');
var app = express();
var Produto = require('./products.models');

// Definindo as rotas dos produtos
//==========================================

//Criando uma instância das rotas vias Express:
var router = express.Router();

router.use(function(req, res, next){
    console.log('A base dos produtos foi checada ou atualizada...');
    next();
});

//Rotas da raiz servirão para GET ALL & POST:
router.route('/')

/* 1) Método: Criar produtos ao acessar: 'http://localhost/produtos' */
.post(function(req, res){
	var produto = new Produto();
	produto.dp = req.body.dp || "sem descrição";
	produto.fp = req.body.fp || "sem foto";
	produto.op = req.body.op || "sem objeto";
	produto.ap = req.body.ap || "sem animação";
	produto.vp = req.body.vp || "sem video";
	produto.pd = Date();
	
	produto.save(function(err){
		if(err){
			res.send('Erro ao tentar salvar o produto: ' + err);
            }else{
			res.json( {message: 'Produto cadastrado com sucesso!'});
		}
	})
})

/* 2) Método: Selecionar todos os produtos cadastrados ao acessar: 'http://localhost/produtos' */
.get(function(req, res){
	Produto.find(function(err, produtos){
		if(err){
			res.send('Erro ao tentar selecionar todos os produtos');
            }else{
			res.json(produtos);
		}
	});
});

//Rotas que terminarem em '/produtos/:produto_id' métodos de GET, PUT e DELETE : produto_id
router.route('/:produto_id')

/* 3) Método: Seleciona o produto pelo id informado no método GET ao acessar: 'http://localhost/produtos/<produto_id>' */
.get(function(req, res){
	
	//Função para selecionar um determinado produto pelo ID:
	Produto.findById(req.params.produto_id, function(err, produto){
		if(err){
			res.send('ID do produto não encontrado: ' + err);
			}else{
			res.json(produto);
		}
	});
})

/* 4) Método: Alterar o produto pelo id informado no método PUT ao acessar: 'http://localhost/produtos/<produto_id>' */
.put(function(req, res){
	
	//Primeiro passo: encontrar um determinado produto pelo ID:
	Produto.findById(req.params.produto_id, function(err, produto){
		if(err){
			res.send('ID do produto não encontrado: ' + err);
			}else{
			//Segundo passo: pegar as propriedades do produto e atualizá-las:
			produto.dp = req.body.dp || produto.dp;
			produto.fp = req.body.fp || produto.fp;
			produto.op = req.body.op || produto.op;
			produto.ap = req.body.ap || produto.ap;
			produto.vp = req.body.vp || produto.vp;
			produto.pd = Date();    
			
			//Terceiro passo: salvar as alterações:
			produto.save(function(error){
				if(error){
					res.send('Erro ao atualizar o produto... ' + error);
					}else{
					res.json({message : 'Produto atualizado com sucesso!'});
				}	
			});
		}
	});
})

/* 5) Método: Seleciona o produto pelo id informado no método GET ao acessar: 'http://localhost/produtos/<produto_id>' */
.delete(function(req, res){
	if(req.params.produto_id != null){
		
		//Função para selecionar um determinado produto pelo ID e removê-lo:
		Produto.remove({
			_id: req.params.produto_id
            }, function(err){
			if(err){
				res.send('Erro ao tentar remover o produto... ' +err);
                }else{
				res.json({message: 'Produto removido com sucesso!'});
			}
		});
        } else{
		res.send('Erro ao tentar remover o produto, pois o ID não foi definido!');
	}
	
});
module.exports = router;