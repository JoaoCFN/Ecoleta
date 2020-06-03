import Knex from "knex";

// AS SEEDS SERVEM PARA POPULAR A NOSSA APLICAÇÃO COM ALGUNS DADOS PADRÕES
export async function seed(knex: Knex){
    await knex('items').insert([
        {title: "Lâmpadas", image: "lampadas.svg"},
        {title: "Pilhas e Baterias", image: "baterias.svg"},
        {title: "Papéis e Papelão", image: "papeis-papelao.svg"},
        {title: "Resíduos Eletrônicos", image: "eletronicos.svg"},
        {title: "Resíduos Orgânicos", image: "organicos.svg"},
        {title: "Óleo de Cozinha", image: "oleo.svg"}
    ]);
}