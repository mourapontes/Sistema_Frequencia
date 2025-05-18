import express from 'express';
import { setFrequenciaRoutes } from './routes/frequenciaRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setFrequenciaRoutes(app);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});