/**
 * File: products.models.js
 * Description:  Script responsável pelo modelo do produto - repositório https://github.com/csviana/DVM
 * Author: Cleirton Viana
 * Create Date: 06/03/2017
 */
//Carregando os pacotes
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Produto:
 * -> Id : int
 * -> Nome : String
 * -> Preço : Number
 * -> Descrição : String
 */

 var ProdutoSchema = new Schema({
     nome:String,
     preco:Number,
     descricao:String
 });
 
module.exports = mongoose.model('Produto', ProdutoSchema);