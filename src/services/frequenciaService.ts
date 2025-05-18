import { Frequencia } from '../types';
import { Aluno } from '../models/aluno';

export class FrequenciaService {
    private frequencias: Frequencia[] = [];

    public adicionarFrequencia(aluno: Aluno, data: Date): void {
        const novaFrequencia: Frequencia = {
            alunoId: aluno.id,
            data: data,
        };
        this.frequencias.push(novaFrequencia);
    }

    public listarFrequencias(): Frequencia[] {
        return this.frequencias;
    }

    public obterFrequenciasPorAluno(alunoId: string): Frequencia[] {
        return this.frequencias.filter(f => f.alunoId === alunoId);
    }
}