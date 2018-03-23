/**
	* File: lojas.js
	* Description:  Script responsável pelas rotas das lojas - repositório https://github.com/csviana/DVM
	* Author: Cleirton Viana
	* Create Date: 20/03/2017
*/

//Carregando as dependências:
const router = require("express").Router();
const mongo = require("mongojs");
const db = mongo("dvm", ['lojas']);
const request = require("request");
const fs = require("fs");

//Defina a sua Sua chave da api Google Maps para poder fazer o download dos mapas
var key = "AIzaSyDoP_k20pvexaV5P-_Z2kOenxD8q3my3jY"; 

//Definindo a rota para o carregamento de todas as lojas
router.get("/", (req, res, next)=>{
	db.lojas.find((err, lojas) => {
		if (err) return next(err);
		res.json(lojas);
	});
});

//Definindo a rota de carregamento de uma loja
router.get("/:id", (req, res, next)=>{
	db.lojas.findOne({_id: mongo.ObjectId(req.body.id)}, (err, loja) => {
		if (err) return next(err);
		res.json(loja);
	});
});

//Definindo a rota de cadastramento da loja
router.post("/", (req, res, next)=>{
	const loja = req.body;
	if (!loja.title || !(loja.isDone + '')) {
		res.status(400).json({
			error: "Bad Data"
		});
		} else{
		
		var el = req.body.el;
		var url = "https://maps.google.com/maps/api/geocode/json?key="+key+"&address="+el+"&components=country:BR";
		request({
			url: url,
			json: true
			}, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var endereço;
				var lat;
				var lng;
				
				if(body.results[0].formatted_address)
				endereço = body.results[0].formatted_address;
				
				if(body.results[0].geometry.location.lat)
				lat = body.results[0].geometry.location.lat;
				
				if(body.results[0].geometry.location.lng)
				lng = body.results[0].geometry.location.lng;
				
				if (endereço && lat && lng){
					req.body.el = endereço;
					
					req.body.gm =  download('https://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lng+'&zoom=17&size=400x400&key='+key, 'map.jpg', function(){
						
						req.body.gm = base64_encode('map.jpg');
						
						db.lojas.save(loja, (err,loja)=>{
							if(err) return next(err);
							res.json(loja);
						});
					});
					}else{
					req.body.gm="não verificada";
					db.lojas.save(loja, (err,loja)=>{
						if(err) return next(err);
						res.json(loja);
					});
				}
			}
		});
		
	}
});

//Definindo a rota de exclusão da loja
router.delete("/:id", (req, res, next)=>{
	db.lojas.remove({_id: mongo.ObjectId(req.body.id)}, (err, result)=>{
		if(err) return next(err);
		res.json(result);
	});
});

//Definindo a rota de atualização da loja
router.put("/:id", (req, res, next)=>{
	const loja = req.body;
	const updateLoja ={};
	
	if(loja.isDone){
		updateLoja.isDone = loja.isDone;
	}
	
	if(loja.title){
		updateLoja.title = loja.title;
	}
	
	if(!updateLoja){
		res.status(400).json({
			error: "Bad Request"
		});
		}else{
		db.lojas.update({_id: mongo.ObjectId(req.body.id)}, (err, loja)=>{
			if(err) return next(err);
			res.json(loja);
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

//Codificador da imagem do google maps em base64
function base64_encode(file) {
	var bitmap = fs.readFileSync(file);
	return new Buffer(bitmap).toString('base64');
}

module.exports = router;