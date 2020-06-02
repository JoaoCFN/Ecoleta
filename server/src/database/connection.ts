// Knex - Query Builder:  dá a possibilidade trabalharmos com banco SQL com uma linguagem unificada para todos os bancos
import knex from 'knex';

// Trabalhar com caminhos dentro do node
import path from 'path';

// Conexão com o banco de dados
const connection = knex({
    client: "sqlite3",
    connection: {
        // resolve: une caminhos
        filename: path.resolve(__dirname, 'database.sqlite'),
    }
});

export default connection;

/*** EXPLICAÇÃO ***/

/** TIPOS DE BANCO DE DADOS **/
    /* 
        Relacionais - SQL: MySQL, Postegres e etc 
    */
    /* 
        Não relacional - SQL: MongoDB, CouchDB etc 
    */


/**  ENTIDADES DA APLICAÇÃO **/
    /* 
        collect_points (Pontos de coleta) 
        collect_points [
            image
            nome
            email
            whatsapp
            latitude 
            longitude
            city
            uf
        ]
    */
    /* 
        items (Itens para coleta)
        item [
            title
            image
        ]
    
    /* 
        point_items (Relacioamento dos itens que um ponto de coleta)
        point_items [
            point_id
            item_id
        ]
    */
    /* 
        Relacionamento: N-N (muitos para muitos) (tabela: pivot) 
    */

/** MIGRATIONS - HISTÓRICO DO BANCO DE DADOS **/
    /* 
           
    */
