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

        return reponse.json(points);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex("collect_points").where("id", id).first();

        if(!point){
            return response.status(400).json(
                { message: "O ponto não foi encontrado" }
            );
        }

        const items = await knex("items")
        .join("point_items", "items.id", "=", "point_items.item_id")
        .where("point_items.point_id", id)
        .select("items.title");

        return response.json({point, items});

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
            image: "https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
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
        const pointItems = items.map((item_id: number) => {
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