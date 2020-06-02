// Bibliotecas em TS precisam vir com a definição de tipos
/* 
    Algumas libs já vem com a definição de tipos e outras não, então é 
    necessário saber como a lib se comporta nesta questão.
*/
import express from 'express';

const app = express();

// Dizer para o express que usaremos JASON
app.use(express.json());

/* 
    Rota: Endereço completo da requisição 
    Ex: http://localhost:3333/users
*/

/*
    Recurso: Qual entidade estamos acessando do sistema
    Ex: users
*/

const users = [
    "João",
    "Bacelar",
    "David",
    "Jonas"
]

/* PARAMS */
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

// Buscar usuários
app.get("/users", (request, response) => {
    const search = String(request.query.search);
    console.log(search);

    // Se existir um query param, ele faz o filtro, senão ele retorna o array de usuários completo
    const filteredUsers = search ? users.filter(user => user.includes(search)) : users;
    
    return response.json(filteredUsers);
}); 

// Buscar usuário
app.get("/users/:id", (request, response) => {
    const id = Number(request.params.id);
    const user = users[id];
    return response.json(user);
});

// Criar usuário
app.post("/users", (request, response) => {
 
    const user = request.body;

    return response.json(user);
});


app.listen(3333);


