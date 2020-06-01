// Bibliotecas em TS precisam vir com a definição de tipos
/* 
    Algumas libs já vem com a definição de tipos e outras não, então é 
    necessário saber como a lib se comporta nesta questão.
*/
import express from 'express';

const app = express();

app.get("/users", (request, response) => {
    console.log("Listagem de usuários");

    response.json([
        "João",
        "Bacelar",
        "David",
        "Jonas"
    ])
});

app.listen(3333);


