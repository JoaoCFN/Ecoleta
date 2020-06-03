import express from 'express';
import routes from './routes';
import path from 'path';

const app = express();

app.use(express.json());
app.use(routes);

// SERVIR ARQUIVOS ESTÁTICOS PARA A NOSSA APLICAÇÃO, COMO IMAGENS, PDF E ETC
app.use("/uploads", express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333);


