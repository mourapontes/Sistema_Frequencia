const supabase = window.supabase;

document.addEventListener('DOMContentLoaded', () => {
    let dataSelecionada = null;
    let presencasMarcadas = {};

    // Renderiza lista de alunos com checkboxes
    async function renderizarAlunos(dataFiltro = null) {
        const lista = document.getElementById('lista-alunos');
        lista.innerHTML = '';
        // Busca todos os alunos
        const { data: alunos, error: erroAlunos } = await supabase
            .from('alunos')
            .select('id, nome, turma')
            .order('id', { ascending: false });
        if (erroAlunos) {
            alert('Erro ao buscar alunos: ' + erroAlunos.message);
            return;
        }
        // Busca presenças do dia filtrado
        let presencas = [];
        if (dataFiltro) {
            const { data: presencaData } = await supabase
                .from('presencas')
                .select('aluno_id')
                .eq('data_frequencia', dataFiltro);
            presencas = presencaData ? presencaData.map(p => p.aluno_id) : [];
        }
        presencasMarcadas = {};
        alunos.forEach(aluno => {
            const li = document.createElement('li');
            li.textContent = `${aluno.nome} - Turma: ${aluno.turma}`;
            // Checkbox de presença
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.disabled = !dataSelecionada; // Desabilita se não houver data
            checkbox.checked = presencas.includes(aluno.id);
            checkbox.onchange = () => {
                presencasMarcadas[aluno.id] = checkbox.checked;
            };
            li.appendChild(checkbox);
            lista.appendChild(li);
        });
    }

    // Salva as presenças marcadas para a data selecionada
    async function salvarPresencas() {
        if (!dataSelecionada) {
            alert('Selecione uma data!');
            return;
        }
        // Remove todas as presenças da data antes de salvar novas
        await supabase.from('presencas').delete().eq('data_frequencia', dataSelecionada);

        // Insere as novas presenças
        const presencasParaSalvar = Object.entries(presencasMarcadas)
            .filter(([_, presente]) => presente)
            .map(([aluno_id]) => ({
                aluno_id: Number(aluno_id),
                data_frequencia: dataSelecionada
            }));
        if (presencasParaSalvar.length > 0) {
            await supabase.from('presencas').insert(presencasParaSalvar);
        }
        alert('Presenças salvas!');
        renderizarAlunos(dataSelecionada);
        renderizarRelatorio(dataSelecionada);
    }

    // Renderiza relatório dos presentes na data consultada
    async function renderizarRelatorio(dataFiltro) {
        const relatorio = document.getElementById('relatorio');
        relatorio.innerHTML = '';
        if (!dataFiltro) return;

        // Busca presenças da data
        const { data: presencas, error: erroPresencas } = await supabase
            .from('presencas')
            .select('aluno_id')
            .eq('data_frequencia', dataFiltro);

        if (erroPresencas) {
            relatorio.textContent = 'Erro ao buscar presenças.';
            return;
        }

        if (!presencas || presencas.length === 0) {
            relatorio.textContent = 'Nenhum aluno presente nesta data.';
            return;
        }

        const idsPresentes = presencas.map(p => p.aluno_id);

        // Busca alunos presentes
        const { data: alunos, error: erroAlunos } = await supabase
            .from('alunos')
            .select('nome, turma, id');

        if (erroAlunos) {
            relatorio.textContent = 'Erro ao buscar alunos.';
            return;
        }

        const presentesNomes = alunos.filter(a => idsPresentes.includes(a.id));
        relatorio.innerHTML = `<strong>Presentes em ${dataFiltro}:</strong><br>` +
            presentesNomes.map(a => `${a.nome} - Turma: ${a.turma}`).join('<br>');
    }

    // Função para gerar PDF do relatório
    async function gerarPDFRelatorio(dataFiltro) {
        if (!dataFiltro) {
            alert('Selecione uma data para gerar o relatório!');
            return;
        }
        // Busca presenças da data
        const { data: presencas } = await supabase
            .from('presencas')
            .select('aluno_id')
            .eq('data_frequencia', dataFiltro);

        if (!presencas || presencas.length === 0) {
            alert('Nenhum aluno presente nesta data.');
            return;
        }

        const idsPresentes = presencas.map(p => p.aluno_id);

        // Busca alunos presentes
        const { data: alunos } = await supabase
            .from('alunos')
            .select('nome, turma, id');

        const presentesNomes = alunos.filter(a => idsPresentes.includes(a.id));

        // Cabeçalho personalizado
        let texto = `Secretaria Municipal de Educação\nControle de Frequência dos Usuários do Transporte Escolar\n\n`;
        texto += `Relatório de Presença - ${dataFiltro}\n\n`;
        presentesNomes.forEach((a, i) => {
            texto += `${i + 1}. ${a.nome} - Turma: ${a.turma}\n`;
        });

        // Gera o PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(texto, 10, 10);
        doc.save(`relatorio_presenca_${dataFiltro}.pdf`);
    }

    // Evento do formulário de novo aluno
    document.getElementById('form-aluno').addEventListener('submit', async function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const turma = document.getElementById('turma').value;
        await supabase.from('alunos').insert([{ nome, turma }]);
        renderizarAlunos(dataSelecionada);
        this.reset();
    });

    // Botão para salvar presenças
    document.getElementById('btn-salvar-presenca').addEventListener('click', salvarPresencas);

    // Adicione o evento do botão PDF
    document.getElementById('btn-salvar-pdf').addEventListener('click', async () => {
        const dataFiltro = document.getElementById('filtro-data').value;
        await gerarPDFRelatorio(dataFiltro);
    });

    document.getElementById('btn-carregar-data').addEventListener('click', function() {
        dataSelecionada = document.getElementById('filtro-data').value;
        if (!dataSelecionada) {
            alert('Selecione uma data!');
            return;
        }
        renderizarAlunos(dataSelecionada);
        renderizarRelatorio(dataSelecionada);
    });

    renderizarAlunos();
});