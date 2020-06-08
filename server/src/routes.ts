/*** EXPLICAÇÃO ***/

/** Bibliotecas em TS precisam vir com a definição de tipos **/

    /* 
        Algumas libs já vem com a definição de tipos e outras não, então é 
        necessário saber como a lib se comporta nesta questão.

        Rota: Endereço completo da requisição 
        Ex: http://localhost:3333/users

        Recurso: Qual entidade estamos acessando do sistema
        Ex: users
    */

/** PARAMS **/

    /* 
        Request Params: Parâmetros que vem na própria rota para identificar o recurso
        ** Parâmetros obrigatórios ** 

        Query params: Parâmetros que vem na própria rota para filtrar, fazer paginação e etc
        ** Parâmetros opcionais **
        
        Request body: Parâmetros que vão no corpo da requisição
    */


import express from 'express';
import multer from "multer";
import multerConfig from "./config/multer";
import { celebrate, Joi } from "celebrate";

import CollectPointsController from "../src/controllers/CollectPointController";
import ItemsController from "../src/controllers/ItemsController";

// Serve para desacoplar as rotas desse arquivo e poder usar em outro
const routes = express.Router();
const upload = multer(multerConfig);

// Instanciando controllers de cada funcionalidade
const collectPointsController = new CollectPointsController();
const itemsController = new ItemsController();

// Lista de itens
routes.get("/items", itemsController.index); 
// Criar pontos de coleta
routes.post(
    "/collect_points", 
    upload.single("image"),  
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        }, 
        )
    }, {
        abortEarly: false
    }),
    collectPointsController.create
);
// Listar pontos (filtro por estado/cidade/items)
routes.get("/collect_points", collectPointsController.index); 
// Listar um ponto específico de coleta
routes.get("/collect_points/:id", collectPointsController.show); 


export default routes;


 