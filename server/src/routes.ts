import express from "express";

// Serve para desacoplar as rotas desse arquivo e poder usar em outro
const routes = express.Router();

// Raiz
routes.get("/", (request, response) => {
    return response.json({ message: "Hello World"});
}); 

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
        Request Paams: Parâmetros que vem na própria rota para identificar o recurso
        ** Parâmetros obrigatórios ** 
    */
    /* 
        Query param: Parâmetros que vem na própria rota para filtrar, fazer paginação e etc
        ** Parâmetros opcionais **
    */
    /* 
        Request body: Parâmetros que vão no corpo da requisição
    */

