/**
 * File: products.models.js
 * Description:  Script responsável pelo modelo do produto - repositório https://github.com/csviana/DVM
 * Author: Cleirton Viana
 * Create Date: 15/03/2017
 */

//Carregando os pacotes
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var LojaSchema = new Schema({
    //_id: é oculto 
    cs:String, //Endereço e dados de navegação do Cloud Server da loja
    ed:Date,   //Data de expiração do aluguel da loja
    dl:String, //Descrição da loja
    gm:String, //Coordenadas da loja no Google maps
    sv:String, //Endereço do servidor em que a loja está hospedada
    ps:String, //Posição da loja tridimensional
    rt:String, //Rotação da loja tridimensional
    cl:String, //Cores das estruturas da loja tridimensional
    ld:Date,  //Atualização dos dados da loja
    iu:{id:Array}, //Armazenamento dos ids dos responsáveis pela loja
    pl:JSON, //Armazena os produtos da loja
    iv:{id:Array}, //Adiciona o id das vendas realizadas
    ml:{id:Array} //Registra os usuários que estão dentro da loja tridimensional
    /*
    iu:Array[{id_u:String}], //Armazenamento dos ids dos responsáveis pela loja
    pl:Array[{id_p:String, p_ps:String, p_rt:String, vp:Number, et:Number}], //Armazena os produtos da loja
    iv:Array[{id_v:String}], //Adiciona o id das vendas realizadas
    ml:Array[{id_u:String}] //Registra os usuários que estão dentro da loja tridimensional
    */
 });
 
module.exports = mongoose.model('Loja', LojaSchema);