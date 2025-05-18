export interface AlunoInterface {
    id: number;
    nome: string;
    turma: string;
}

export interface Frequencia {
    alunoId: number;
    data: Date;
    presente: boolean;
}

export type FrequenciaRegistro = {
    [key: number]: Frequencia[];
};