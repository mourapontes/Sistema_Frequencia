export class Aluno {
    id: number;
    nome: string;
    turma: string;

    constructor(id: number, nome: string, turma: string) {
        this.id = id;
        this.nome = nome;
        this.turma = turma;
    }

    public getId(): number {
        return this.id;
    }

    public getNome(): string {
        return this.nome;
    }

    public getTurma(): string {
        return this.turma;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public setTurma(turma: string): void {
        this.turma = turma;
    }
}