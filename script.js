// Variáveis globais
let registros = [];
let semanaAtual = 1;
let diasExtras = false;
let moedasColetadas = 0;

// Função para determinar a semana atual do mês
function determinarSemanaDoMes() {
    const hoje = new Date();
    const dia = hoje.getDate();
    const semana = Math.ceil(dia / 7);
    return Math.min(semana, 4); // Limita a 4 semanas
}

// Função para verificar se estamos em dias extras
function verificarDiasExtras() {
    const hoje = new Date();
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    const dia = hoje.getDate();
    return dia > 28 && Math.ceil(dia / 7) > 4;
}

// Função para atualizar o título da semana
function atualizarTituloSemana() {
    const tituloSemana = document.querySelector('.semana-container h3');
    const semana = determinarSemanaDoMes();
    const extras = verificarDiasExtras();

    if (extras) {
        tituloSemana.textContent = 'Dias Extras do Mês';
        diasExtras = true;
    } else {
        tituloSemana.textContent = `Semana ${semana} do Mês`;
        diasExtras = false;
    }
    semanaAtual = semana;
}

// Handler para input de tempo
function handleTimeInput(event, input) {
    if (event.key === "Enter") {
        event.preventDefault();

        // Verifica se já é um formato válido HH:mm
        const regexTime = /^([01]\d|2[0-3]):([0-5]\d)$/;

        // Se não tem ":", adiciona "00:" como base
        if (!input.value.includes(":")) {
            let valor = input.value.padStart(2, "0"); // Garante ao menos 2 dígitos
            input.value = valor + ":00"; // Adiciona minutos
            return;
        }

        // Verifica o formato final antes de processar
        if (!regexTime.test(input.value)) {
            alert("Por favor, insira um horário válido no formato HH:mm.");
            input.value = ""; // Reseta o campo em caso de erro
            return;
        }

        // Processa o próximo elemento
        const nextId = input.dataset.next;
        if (nextId) {
            const nextElement = document.getElementById(nextId);

            if (nextElement.tagName === "BUTTON" && nextElement.id.startsWith("botao-salvar-")) {
                // Extrai o dia do ID do botão (exemplo: "botao-salvar-segunda" -> "segunda")
                const dia = nextElement.id.split("-")[2];
                if (dia) {
                    // Chama a função para salvar o registro
                    adicionarRegistro(dia);

                    // Foca no próximo elemento após o botão
                    const nextInputId = nextElement.dataset.next;
                    if (nextInputId) {
                        document.getElementById(nextInputId).focus();
                    }
                }
            } else {
                // Se não for botão, apenas foca no próximo elemento
                nextElement.focus();
            }
        }
    }
}


// Função para tocar o tema do Mario
function tocarTemaVitoria() {
    const marioTheme = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-video-game-win-2016.mp3');

    const container = document.querySelector('.container');
    container.classList.add('victory-animation');

    marioTheme.play().catch(e => console.log('🍄 Ops, o som fugiu mais rápido que um Mario speedrun!'));

    setTimeout(() => {
        container.classList.remove('victory-animation');
    }, 3000);

    console.log(`
    🍄 ACHIEVEMENT UNLOCKED: "Time Lord" 🕒
    =====================================
    Você completou mais uma semana de trabalho!
    XP Ganho: 1337
    Achievement Progress: ${semanaAtual}/4
    
    Próximo nível: "Coffee Override Exception Handler"
    `);
}

// Verifica se todos os horários da semana foram preenchidos
function todosHorariosPreenchidos() {
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    return diasSemana.every(dia => {
        const entrada = document.getElementById(`${dia}-entrada`).value;
        const saida = document.getElementById(`${dia}-saida`).value;
        return entrada && saida;
    });
}

// Avança para a próxima semana
function avancarParaProximaSemana() {
    semanaAtual++;
    if (semanaAtual <= 4) {
        tocarTemaVitoria();
        atualizarTituloSemana();
        limparCamposHorario();
    } else if (!diasExtras && verificarDiasExtras()) {
        console.log('🌟 BONUS STAGE UNLOCKED! 🌟');
        atualizarTituloSemana();
        limparCamposHorario();
    }
}

// Limpa os campos de horário
function limparCamposHorario() {
    document.querySelectorAll('.input-time[type="time"]').forEach(input => {
        input.value = '';
    });
}

function calcularDiferencaHoras(horarioInicial, horarioFinal) {
    const [horaInicial, minutoInicial] = horarioInicial.split(":").map(Number);
    const [horaFinal, minutoFinal] = horarioFinal.split(":").map(Number);

    const inicio = horaInicial * 60 + minutoInicial;
    let fim = horaFinal * 60 + minutoFinal;

    if (fim < inicio) {
        fim += 24 * 60;
    }

    return fim - inicio;
}

// Agora sim, podemos usar essa função aqui
function calcularTotalDiario(entrada, saidaAlmoco, voltaAlmoco, saida) {
    const periodoManha = calcularDiferencaHoras(entrada, saidaAlmoco);
    const periodoTarde = calcularDiferencaHoras(voltaAlmoco, saida);

    const totalMinutos = periodoManha + periodoTarde;
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    return { horas, minutos };
}

// Função para adicionar registro
function adicionarRegistro(dia) {
    const entrada = document.getElementById(`${dia.toLowerCase().split('-')[0]}-entrada`).value;
    const saidaAlmoco = document.getElementById(`${dia.toLowerCase().split('-')[0]}-saida-almoco`).value;
    const voltaAlmoco = document.getElementById(`${dia.toLowerCase().split('-')[0]}-volta-almoco`).value;
    const saida = document.getElementById(`${dia.toLowerCase().split('-')[0]}-saida`).value;

    if (!entrada || !saidaAlmoco || !voltaAlmoco || !saida) {
        alert('Preencha todos os horários!');
        return;
    }

    const { horas, minutos } = calcularTotalDiario(entrada, saidaAlmoco, voltaAlmoco, saida);
    const total = `${horas}h${minutos}min`;

    const registro = {
        dia,
        entrada,
        saidaAlmoco,
        voltaAlmoco,
        saida,
        total
    };

    const diaIndex = registros.findIndex(r => r.dia === dia);
    if (diaIndex !== -1) {
        registros[diaIndex] = registro;
    } else {
        registros.push(registro);
    }

    atualizarTabela();
    calcularTotais();

    // Easter egg de moedas
    moedasColetadas++;
    if (moedasColetadas % 5 === 0) {
        const coinSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-coin-win-notification-1992.mp3');
        coinSound.volume = 0.2;
        coinSound.play().catch(e => console.log('🪙 A moeda caiu no void!'));

        console.log(`
        🪙 x${moedasColetadas} Moedas coletadas!
        ${moedasColetadas >= 20 ? '🏆 Achievement: "Coin Master" desbloqueado!' : ''}
        `);
    }
}

// Função para remover registro
function removerRegistro(index) {
    registros.splice(index, 1);
    atualizarTabela();
    calcularTotais();
}

// Função para atualizar a tabela
function atualizarTabela() {
    const tbody = document.querySelector("#tabelaHoras tbody");
    tbody.innerHTML = '';

    registros.forEach((registro, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${registro.dia}</td>
            <td>${registro.entrada}</td>
            <td>${registro.saidaAlmoco}</td>
            <td>${registro.voltaAlmoco}</td>
            <td>${registro.saida}</td>
            <td>${registro.total}</td>
            <td><button onclick="removerRegistro(${index})">Remover</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para calcular totais
function calcularTotais() {
    let totalMinutosSemana = 0;

    registros.forEach(registro => {
        const [horas, minutos] = registro.total.replace('h', ':').replace('min', '').split(':');
        totalMinutosSemana += parseInt(horas) * 60 + parseInt(minutos);
    });

    const horasSemana = Math.floor(totalMinutosSemana / 60);
    const minutosSemana = totalMinutosSemana % 60;

    document.getElementById('totalSemana').textContent = `${horasSemana}h${minutosSemana}min`;

    // Calcula total do mês
    const totalMinutosMes = registros.reduce((total, registro) => {
        const [horas, minutos] = registro.total.replace('h', ':').replace('min', '').split(':');
        return total + parseInt(horas) * 60 + parseInt(minutos);
    }, 0);

    const totalHorasMes = Math.floor(totalMinutosMes / 60);
    const totalMinutosExtras = totalMinutosMes % 60;

    document.getElementById('totalMes').textContent = `${totalHorasMes}h${totalMinutosExtras}min`;


}

// Função para gerar PDF
async function gerarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const diaAtual = new Date().getDay();
        const temas = {
            0: { cor: '#FF6B6B', nome: 'Sunset Sunday' },
            1: { cor: '#4ECDC4', nome: 'Monday Blues' },
            2: { cor: '#45B7D1', nome: 'Turquoise Tuesday' },
            3: { cor: '#96CEB4', nome: 'Forest Wednesday' },
            4: { cor: '#D4A5A5', nome: 'Pastel Thursday' },
            5: { cor: '#FCE38A', nome: 'Golden Friday' },
            6: { cor: '#A1C3D1', nome: 'Chill Saturday' }
        };

        const tema = temas[diaAtual];
        doc.setFillColor(tema.cor);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");
        
        // Cabeçalho melhorado com período atual
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        const periodoAtual = diasExtras ? "Dias Extras do Mes" : `Semana ${semanaAtual} do Mes`;
        doc.text(`Relatorio de Horas - ${periodoAtual}`, 20, 20);
        doc.setFontSize(16);
        doc.text(`Tema do dia: ${tema.nome}`, 20, 30);
        
        doc.setTextColor(0, 0, 0);

        let y = 50;
        registros.forEach((registro, index) => {
            doc.setFontSize(16);
            // Formatação mais detalhada dos registros
            doc.text(`${registro.dia}`, 20, y);
            doc.setFontSize(12);
            doc.text(`Entrada: ${registro.entrada} | Saida: ${registro.saida}`, 60, y);
            doc.text(`Total: ${registro.total}`, 160, y);
            y += 15;

            if ((index + 1) % 3 === 0) {
                const comentarios = [
                    "// TODO: Implementar IA para escrever código sozinho",
                    "// DEBUG: Acho que o problema é entre o teclado e a cadeira",
                    "// WARNING: Commit feito às 3AM, revisar pela manhã",
                ];
                doc.setFontSize(10);
                doc.text(comentarios[Math.floor(Math.random() * comentarios.length)], 110, y + 60);
            }
        });

        y += 10;
        doc.setFontSize(14);
        const totalSemana = document.getElementById('totalSemana').textContent;
        
        
        // Área de totais mais destacada
        doc.setDrawColor(0);
        doc.setFillColor(240, 240, 240);
        doc.rect(10, y - 5, 190, 30, "F");
        doc.setFontSize(16);
        doc.text(`Total da ${diasExtras ? "Periodo Extra" : "Semana"}: ${totalSemana}`, 71, y + 12);
        

        // Easter egg atualizado
        doc.setTextColor(0,0,0);
        doc.setFontSize(12);
        doc.text(`GitHub: mgosalan-dev`, 165, 295);

        doc.save(`horas-trabalhadas-${new Date().toISOString().split('T')[0]}.pdf`);

        console.log(`
        🚀 PDF DEPLOY SUCCESSFUL!
        =========================
        Branch: ${tema.nome}
        Commit count: ${registros.length}
        Coverage: ${Math.floor(Math.random() * 100)}%
        `);

    } catch (error) {
        console.error('💥 Exception:', error);
        alert('Erro 418: I\'m a teapot! (Mas queria ser uma cafeteira)');
    }
}
// Adiciona header informativo no console quando carrega a página
console.log(`
    ╔═══════════════════════════════════════╗
    ║  Time Tracker Pro - Portfolio Edition  ║
    ║  Version: 1.0.0-beta.awesome          ║
    ║  Made with 🎯 precision & 😎 style    ║
    ╚═══════════════════════════════════════╝
        `);

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    atualizarTituloSemana();

    // Adiciona listeners para inputs de tempo
    document.querySelectorAll('.input-time[type="time"]').forEach(input => {
        input.addEventListener("keydown", (e) => handleTimeInput(e, input));
    });

    // Adiciona o estilo para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes victory-jump {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
        }

        @keyframes rainbow-border {
            0% { border-color: #ff0000; }
            20% { border-color: #ff9900; }
            40% { border-color: #33cc33; }
            60% { border-color: #3399ff; }
            80% { border-color: #cc33ff; }
            100% { border-color: #ff0000; }
        }

        .victory-animation {
            animation: victory-jump 0.5s ease-in-out,
                rainbow-border 2s linear infinite;
            border: 3px solid transparent;
        }

        .input-time:focus {
            box-shadow: 0 0 10px #ff0000;

        }
    `;
})
