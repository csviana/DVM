/**
    * File: func.js
	* Description:  Script responsável pelas rotas das funções de atualizações - repositório https://github.com/csviana/DVM
	* Author: Cleirton Viana
	* Create Date: 21/03/2017
*/

//Carregamdo as dependências
const router = require("express").Router();
const fs = require("fs");

//Definindo a rota para carregar a função no localStorage do cliente
router.get("/:id", (req, res, next)=>{
    var nid = req.params.id;
	
    //Reporte da conexão solicitando a função
    if (nid != "8") //Defina para a quantidade de arquivos dentro da pasta func +1,
    console.log(req.connection.remoteAddress + ":"+ nid); //Retorna o ip solicitante + a função solicitata
	
    //Verifica se existe o arquivo referente a função solicitada e retorna a função ao cliente, caso exista
    var file = __dirname+"/func/"+nid+".html";
    res.removeHeader('X-Powered-By');
    if (!fs.existsSync(file)) return res.status(304).end("null");
    var arquivo = fs.readFileSync(file);
	var nfile= new Buffer(arquivo).toString().replace(/\n/g,'').replace(/\r/g,'').replace(/\t/g,'').replace(/  /g," ").replace(/: /g,':').replace(/ :/g,':').replace(/" /g,'"').replace(/' /g,"'").replace(/ '/g,"'").replace(/ "/g,'"').replace("<script>",'').replace("</script>",'').replace("<style>","").replace("</style>","");
    return res.end(nfile);
});
module.exports = router;