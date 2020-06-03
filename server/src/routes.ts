import express, { request, response } from 'express';
import knex from './database/connection';

// Serve para desacoplar as rotas desse arquivo e poder usar em outro
const routes = express.Router();

// Lista de itens
routes.get("/items", async (request, response) => {
    // Sempre que for usar uma query pro banco de dados, usamos o await pois demora um pouco
    const items = await knex("items").select("*");

    // Serialização de dados é transformar os dados para um novo formato mais acessível ao front-end ou o cliente
    const serializedItems = items.map(item => {
        return {
            id: item.id,
            title: item.title,
            // Neste caso, a ideia é retornar a url da imagem com o endereço da aplicação na frente para facilitar o manipulação do front-end 
            image_url: `http://localhost:3333/uploads/${item.image}`,
        };
    });

    return response.json(serializedItems);
}); 

// Criar pontos de coleta
routes.post("/collect_points", async(request, response) => {
    const {
        name, 
        email,
        whatsapp, 
        latitude,
        longitude,
        city, 
        uf, 
        items,
    } = request.body; 

    await knex("collect_points").insert({
        image: "image-fake",
        name, 
        email,
        whatsapp, 
        latitude,
        longitude,
        city, 
        uf, 
    })

    return response.json({ success : true});
})

export default routes;

/*** EXPLICAÇÃO ***/

/** Bibliotecas em TS precisam vir com a definição de tipos **/

    /* 
        Algumas libs já vem com a definição de tipos e outras não, então é 
        necessário saber como a lib se comporta nesta questão.
    */

    /* 
        Rota: Endereço completo da requisição 
        Ex: http://localhost:3333/users
    */

    /*
        Recurso: Qual entidade estamos acessando do sistema
        Ex: users
    */

/** PARAMS **/

    /* 
        Request Params: Parâmetros que vem na própria rota para identificar o recurso
        ** Parâmetros obrigatórios ** 
    */
    /* 
        Query params: Parâmetros que vem na própria rota para filtrar, fazer paginação e etc
        ** Parâmetros opcionais **
    */
    /* 
        Request body: Parâmetros que vão no corpo da requisição
    */

