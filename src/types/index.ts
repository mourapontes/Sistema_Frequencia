export interface Aluno {
    id: number;
    nome: string;
    turma: string;
}

export interface Frequencia {
    alunoId: number;
    data: Date;
    presente: boolean;
}