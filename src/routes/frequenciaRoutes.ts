import { Router } from 'express';
import FrequenciaController from '../controllers/frequenciaController';

const router = Router();
const frequenciaController = new FrequenciaController();

export const setFrequenciaRoutes = (app) => {
    app.use('/frequencia', router);
    
    router.post('/registrar', frequenciaController.registrarFrequencia.bind(frequenciaController));
    router.get('/listar', frequenciaController.obterFrequencia.bind(frequenciaController));
};