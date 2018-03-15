/**
 * File: products.models.js
 * Description:  Script responsável pelo modelo do produto - repositório https://github.com/csviana/DVM
 * Author: Cleirton Viana
 * Create Date: 06/03/2017
 */

//Carregando os pacotes
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var ProdutoSchema = new Schema({
    //_id: é oculto 
    dp:String, //Descrição do produto
    fp:String, //Foto do produto em base64.encoded
    op:String, //Dado do objeto3D do produto
    ap:String, //Animação registrada para o objeto3D
    vp:String, //Link do vídeo apresentando o produto,
    pd:Date    //Data de atualização do produto
 });
 
module.exports = mongoose.model('Prod_Serv', ProdutoSchema);