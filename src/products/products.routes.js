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

 //Rota de exemplo:
 router.get('/', function(req, res){
     res.json({message: "Bem vindo(a) à nossa loja"})
 })

//Rotas da raiz servirão para GET ALL & POST:
router.route('/')

    /* 1) Método: Criar produtos ao acessar: 'http://localhost:8000/products' */
    .post(function(req, res){
        var produto = new Produto();
        //Setando os campos do produto:
        if (req.body.nome != null && req.body.preco != null && req.body.descricao != null){
        produto.nome = req.body.nome;
        produto.preco = req.body.preco;
        produto.descricao = req.body.descricao;

        produto.save(function(err){
            if(err){
                res.send('Erro ao tentar salvar o produto: ' + err);
            }else{
                res.json( {message: 'Produto cadastrado com sucesso!'});
            }
        })
    }else{
        res.send('Erro ao tentar salvar o produto, pois há campos vazios');
    }
    })

    /* 2) Método: Selecionar todos os produtos cadastrados ao acessar: 'http://localhost:8000/api/produtos' */
    .get(function(req, res){
        Produto.find(function(err, produtos){
            if(err){
                res.send('Erro ao tentar selecionar todos os produtos');
            }else{
                res.json(produtos);
               //res.json({message : "Produtos carregados com sucesso!"});
            }
        });
    });

//Rotas que terminarem em '/produtos/:produto_id' métodos de GET, PUT e DELETE : produto_id
router.route('/:produto_id')

    /* 3) Método: Seleciona o produto pelo id informado no método GET ao acessar: 'http://localhost:8000/api/produtos/<produto_id>' */
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

    /* 4) Método: Alterar o produto pelo id informado no método PUT ao acessar: 'http://localhost:8000/api/produtos/<produto_id>' */
        .put(function(req, res){
            
            //Primeiro: passo encontrar um determinado produto pelo ID:
            Produto.findById(req.params.produto_id, function(err, produto){
                if(err){
                    res.send('ID do produto não encontrado: ' + err);
                }else{

                    //Segundo passo: pegar as propriedades do produto e atualizá-las:
                    if (req.body.nome != null && req.body.preco != null && req.body.descricao != null){
                        produto.nome = req.body.nome;
                        produto.preco = req.body.preco;
                        produto.descricao = req.body.descricao;

                        //Terceiro passo: salvar as alterações:
                        produto.save(function(error){
                            if(error){
                                res.send('Erro ao atualizar o produto... ' + error);
                            }else{
                                res.json({message : 'Produto atualizado com sucesso!'});
                            }

                        });
                    }else{
                        res.send('Erro ao tentar atualizar o produto, pois há campos vazios');
                    }
                }
            });
        })

        /* 5) Método: Seleciona o produto pelo id informado no método GET ao acessar: 'http://localhost:8000/api/produtos/<produto_id>' */
        .delete(function(req, res){
                    if(req.params.produto_id != null){
                   
            //Função para selecionar um determinado produto pelo ID:
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