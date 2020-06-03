import Knex from 'knex';

// TABELA DE RELACIONAMENTO ENTRE PONTOS DE COLETA E ITENS A SEREM COLETADOS
export async function up(knex : Knex){
    // CRIAR TABELA
    return knex.schema.createTable("point_items", table => {
        table.increments('id').primary();

        // POINT_ID CRIA UMA CHAVE ESTRANGEIRA 
        table.integer('point_id')
        .notNullable()
        .references("id")
        .inTable('collect_points');

        // POINT_ID CRIA UMA CHAVE ESTRANGEIRA 
        table.integer('item_id')
        .notNullable()
        .references("id")
        .inTable("items");

    })
}

export async function down(knex: Knex){
    // VOLTAR ATRÁS (DELETAR A TABELA QUE A GENTE CRIOU)
    return knex.schema.dropTable("point_items");
}
 