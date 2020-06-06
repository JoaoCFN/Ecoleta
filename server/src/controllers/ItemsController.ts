import express, { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsPointController {

    async index(request: Request, response: Response){
        // Sempre que for usar uma query pro banco de dados, usamos o await pois demora um pouco
        const items = await knex("items").select("*");
    
        // Serialização de dados é transformar os dados para um novo formato mais acessível ao front-end ou o cliente
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                // Neste caso, a ideia é retornar a url da imagem com o endereço da aplicação na frente para facilitar o manipulação do front-end 
                image_url: `http://192.168.15.12:3333/uploads/${item.image}`,
            };
        });
    
        return response.json(serializedItems);
    }
    
}

export default ItemsPointController;