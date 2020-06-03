import Knex from 'knex';

// MIGRATIONS - HISTÓRICO DO BANCO DE DADOS 

// TABELA DE PONTOS DE COLETA
export async function up(knex : Knex){
    // CRIAR TABELA
    return knex.schema.createTable("collect_points", table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
    })
}

export async function down(knex: Knex){
    // VOLTAR ATRÁS (DELETAR A TABELA QUE A GENTE CRIOU)
    return knex.schema.dropTable("collect_points");
}
 