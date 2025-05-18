class FrequenciaController {
    private frequenciaService: FrequenciaService;

    constructor(frequenciaService: FrequenciaService) {
        this.frequenciaService = frequenciaService;
    }

    public async registrarFrequencia(req: Request, res: Response): Promise<Response> {
        const { alunoId, data } = req.body;
        try {
            const resultado = await this.frequenciaService.adicionarFrequencia(alunoId, data);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async obterFrequencia(req: Request, res: Response): Promise<Response> {
        const { alunoId } = req.params;
        try {
            const frequencias = await this.frequenciaService.listarFrequencias(alunoId);
            return res.status(200).json(frequencias);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default FrequenciaController;