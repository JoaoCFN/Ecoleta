import express, { Request, Response } from 'express';
import knex from '../database/connection';

/** PADRÃO CONTROLLER **/

    /*
        Index - Listagem
        Show - Um único registro
        Create - Criar
        Update - Atualizar
        Delete - Deletar
    */
   
class CollectPointController {

    async index(request: Request, reponse: Response){
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
        .split(",")
        .map(item => Number(item.trim()));

        const points = await knex("collect_points")
        .join("point_items", "collect_points.id", "=", "point_items.point_id")
        .whereIn("point_items.item_id", parsedItems)
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("collect_points.*");

        const serializedPoints = points.map(point => {
            return {
                ...point,
                // Neste caso, a ideia é retornar a url da imagem com o endereço da aplicação na frente para facilitar o manipulação do front-end 
                image_url: `http://192.168.15.12:3333/uploads/${point.image}`,
            };
        });

        return reponse.json(serializedPoints);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex("collect_points").where("id", id).first();

        if(!point){
            return response.status(400).json(
                { message: "O ponto não foi encontrado" }
            );
        }

        const serializedPoint = {
            ...point,
            // Neste caso, a ideia é retornar a url da imagem com o endereço da aplicação na frente para facilitar o manipulação do front-end 
            image_url: `http://192.168.15.12:3333/uploads/${point.image}`,
        
        };

        const items = await knex("items")
        .join("point_items", "items.id", "=", "point_items.item_id")
        .where("point_items.point_id", id)
        .select("items.title");

        return response.json({point: serializedPoint, items});

    }

    async create(request: Request, response: Response) {
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
    
        // TRX - TRANSACTION: PREVENÇÃO EXISTENTE PARA QUANDO TIVERMOS MAIS UMA QUERY RELACIONADA. ISSO FAZ COM QUE SE A PRIMEIRA FALHAR, A SEGUNDA NÃO EXECUTE
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name, 
            email,
            whatsapp, 
            latitude,
            longitude,
            city, 
            uf, 
        }
    
        const insertedIds = await trx("collect_points").insert(point);
    
        // RELACIONAMENTO COM A TABELA DE ITEMS
        const point_id = insertedIds[0];
        const pointItems = items
            .split(",")
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
            return {
                item_id,
                point_id 
            }
        })
    
        await trx("point_items").insert(pointItems);

        // Garante os inserts na base de dados
        /* Método obrigatório quando se usa transaction, senão nunca vai inserir no banco de dados */
        await trx.commit();
        
        // ... : spred operator - pega todas as informações que tem dentro de um objeto e retorna dentro de outro
        return response.json({
            id: point_id,
            ...point,
        });
    }
}

export default CollectPointController;