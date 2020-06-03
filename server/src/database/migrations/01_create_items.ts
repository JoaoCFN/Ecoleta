import Knex from 'knex';

// MIGRATIONS - HISTÓRICO DO BANCO DE DADOS 

// TABELA DE ITENS PARA COLETA
export async function up(knex : Knex){
    // CRIAR TABELA
    return knex.schema.createTable("items", table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('image').notNullable();
    })
}

export async function down(knex: Knex){
    // VOLTAR ATRÁS (DELETAR A TABELA QUE A GENTE CRIOU)
    return knex.schema.dropTable("items");
}
 