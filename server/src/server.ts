import express from 'express';
import cors from "cors";
import path from 'path';
import routes from './routes';
import { errors } from "celebrate";

const app = express();

// CORS - Define na nossa API, quais endereços externos vão ter acesso a nossa aplicação. Quando for para o ar, dentro do cors em app.use, você define um atributo chamado origin. Ele vai receber a url do seu site.

app.use(cors());
app.use(express.json());
app.use(routes);

// SERVIR ARQUIVOS ESTÁTICOS PARA A NOSSA APLICAÇÃO, COMO IMAGENS, PDF E ETC
app.use("/uploads", express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3333);


