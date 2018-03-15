/**
 * File: products.routes.js
 * Description:  Script responsável pelas rotas do produto - repositório https://github.com/csviana/DVM
 * Author: Cleirton Viana
 * Create Date: 15/03/2017
 */
 
//Carregando os pacotes
var express = require('express');
var app = express();
var Loja = require('./lojas.models');

// Definindo as rotas das lojas
//==========================================

//Criando uma instância das rotas vias Express:
var router = express.Router();

router.use(function(req, res, next){
    console.log('A base das lojas foi checada ou atualizada...');
    next();
});

//Rotas da raiz servirão para GET ALL & POST:
router.route('/')

/* 1) Método: Criar lojas ao acessar: 'http://localhost/lojas' */
.post(function(req, res){
	var loja = new Loja();
	loja.cs = req.body.cs || "sem CloudServer";
	loja.ed = req.body.ed || Date();
	loja.dl = req.body.dl || "sem descrição";
	loja.el = req.body.el || "sem endereço";
    loja.gm = req.body.gm || "sem coordenadas";
    loja.sv = req.body.sv || "sem servidor";
    loja.ps = req.body.ps || "sem posição tridimensional";
    loja.rt = req.body.rt || "sem rotação tridimensional";
    loja.cl = req.body.cl || "sem cores definidas";
    loja.ld = Date();

    loja_iu="";
    jloja_iu:JSON;
  
    if (req.body.iu!=null){
        for(var key in req.body.iu) {
           if(req.body.iu.hasOwnProperty(key)){
               if(loja_iu=="")
               loja_iu +="{["+req.body.iu[key];
               else loja_iu +="],["+req.body.iu[key];

                console.log(loja_iu);
              //do something with e.g. req.body[key]
            }
          }
          loja_iu+="]}";
         jloja_iu= JSON.stringify(loja_iu);
         console.log(loja_iu);
    }


   //loja.iu = jloja_iu || new JSON({"id_u":"sem responsável"});
    //loja.pl = req.body.pl[id_p,p_ps,p_rt,vp,et] || {id_p:"sem id_produto", p_ps:"sem posição do produto", p_rt:"sem rotação do produto", vp:0 , et:0};
    //loja.iv = req.body.iv[id_v] || {id_v:"sem vendas"};
    //loja.ml = req.body.iu[id_u] || {id_u:"sem usuários internos"};
	
	loja.save(function(err){
		if(err){
			res.send('Erro ao tentar salvar a loja: ' + err);
            }else{
			res.json( {message: 'Loja cadastrada com sucesso!'});
		}
	})
})

/* 2) Método: Selecionar todas as lojas cadastradas ao acessar: 'http://localhost/lojas' */
.get(function(req, res){
	Loja.find(function(err, lojas){
		if(err){
			res.send('Erro ao tentar selecionar todas as lojas');
            }else{
			res.json(lojas);
		}
	});
});

//Rotas que terminarem em '/lojas/:loja_id' métodos de GET, PUT e DELETE : loja_id
router.route('/:loja_id')

/* 3) Método: Seleciona a loja pelo id informado no método GET ao acessar: 'http://localhost/lojas/<loja_id>' */
.get(function(req, res){
	
	//Função para selecionar uma determinada loja pelo ID:
	Loja.findById(req.params.loja_id, function(err, loja){
		if(err){
			res.send('ID da loja não encontrado: ' + err);
			}else{
			res.json(loja);
		}
	});
})

/* 4) Método: Alterar a loja pelo id informado no método PUT ao acessar: 'http://localhost/lojas/<loja_id>' */
.put(function(req, res){
	
	//Primeiro passo: encontrar uma determinada loja pelo ID:
	Loja.findById(req.params.loja_id, function(err, loja){
		if(err){
			res.send('ID da loja não encontrado: ' + err);
			}else{
			//Segundo passo: pegar as propriedades da loja e atualizá-las:
            loja.cs = req.body.cs || loja.cs;
            loja.ed = req.body.ed || loja.ed;
            loja.dl = req.body.dl || loja.dl;
            loja.el = req.body.el || loja.el;
            loja.gm = req.body.gm || loja.gm;
            loja.sv = req.body.sv || loja.sv;
            loja.ps = req.body.ps || loja.ps;
            loja.rt = req.body.rt || loja.rt;
            loja.cl = req.body.cl || loja.cl;
            loja.ld = Date();
           
            loja.iu = getArrayid(req.body.iu) || loja.iu;
            loja.pl = req.body.pl[id_p,p_ps,p_rt,vp,et] || loja.pl;
            loja.iv = getArrayid(req.body.iv) || loja.iv;
            loja.ml = getArrayid(req.body.iu) || loja.ml;
			
			//Terceiro passo: salvar as alterações:
			loja.save(function(error){
				if(error){
					res.send('Erro ao atualizar a loja... ' + error);
					}else{
					res.json({message : 'Loja atualizada com sucesso!'});
				}	
			});
		}
	});
})

/* 5) Método: Seleciona a loja pelo id informado no método GET ao acessar: 'http://localhost/lojas/<loja_id>' */
.delete(function(req, res){
	if(req.params.loja_id != null){
		
		//Função para selecionar uma determinada loja pelo ID e removê-la:
		Loja.remove({
			_id: req.params.loja_id
            }, function(err){
			if(err){
				res.send('Erro ao tentar remover a loja... ' +err);
                }else{
				res.json({message: 'loja removida com sucesso!'});
			}
		});
        } else{
		res.send('Erro ao tentar remover a loja, pois o ID não foi definido!');
	}
	
});
function getArrayid(elemento){
    loja_iu="";
    if (elemento!=null){
        for(var key in elemento) {
           if(elemento.hasOwnProperty(key)){
               if(loja_iu=="")
               loja_iu +=elemento[key];
               else loja_iu +=","+elemento[key];
            }
          }         
        }else{return null;}
return {id:loja_iu.split(",")}

}
module.exports = router;