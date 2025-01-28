let registros = [];

// Adiciona um evento para capturar a tecla Enter
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os inputs e botões que possuem a classe "input-time"
    const inputs = document.querySelectorAll(".input-time");

    // Adiciona um evento para capturar a tecla Enter
    inputs.forEach((input) => {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Impede o comportamento padrão do Enter
                const nextInputId = input.dataset.next; // Pega o ID do próximo campo

                // Verifica se o elemento atual é um botão salvar
                if (input.tagName === "BUTTON" && input.id.startsWith("botao-salvar")) {
                    const dia = input.id.split("-")[2]; // Obtém o dia do botão (ex.: "segunda" em "botao-salvar-segunda")
                    adicionarRegistro(dia); // Adiciona o registro do dia atual

                    if (nextInputId) {
                        const nextInput = document.getElementById(nextInputId);
                        if (nextInput) {
                            nextInput.focus(); // Move o foco para o próximo campo
                        }
                    }
                } else if (nextInputId) {
                    // Se não for um botão, apenas move para o próximo input
                    const nextInput = document.getElementById(nextInputId);
                    if (nextInput) {
                        nextInput.focus(); // Move o foco para o próximo campo
                    }
                }
            }
        });
    });
});

// prencimento obrigatório dos campos horas e minutos
document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".input-time");

    inputs.forEach((input) => {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Impede o comportamento padrão do Enter
                
                const partes = input.value.split(":"); // Divide o valor em hh e mm
                
                // Se o hh (horas) foi preenchido e o mm (minutos) ainda não
                if (partes.length === 1 || (partes[0] && !partes[1])) {
                    // Se só o hh foi preenchido, adiciona ":"
                    input.value = partes[0].padStart(2, "0") + ":";
                } else if (partes[0] && partes[1] && partes[1].length === 2) {
                    // Se o hh:mm estiver completo, vai para o próximo input
                    const nextInputId = input.dataset.next;
                    if (nextInputId) {
                        const nextInput = document.getElementById(nextInputId);
                        if (nextInput) {
                            nextInput.focus(); // Move o foco para o próximo campo
                        }
                    }
                }
            }
        });
    });
});



function adicionarRegistro(dia) {
    const entrada = document.getElementById(`${dia.toLowerCase().split('-')[0]}-entrada`).value;
    const saidaAlmoco = document.getElementById(`${dia.toLowerCase().split('-')[0]}-saida-almoco`).value;
    const voltaAlmoco = document.getElementById(`${dia.toLowerCase().split('-')[0]}-volta-almoco`).value;
    const saida = document.getElementById(`${dia.toLowerCase().split('-')[0]}-saida`).value;

    if (!entrada || !saidaAlmoco || !voltaAlmoco || !saida) {
        alert('Preencha os horários de entrada, saida Almoço, Volta Almoço e saída!');
        return;
    }

    const total = calcularHoras(entrada, saidaAlmoco, voltaAlmoco, saida);

    const registro = {
        dia,
        entrada,
        saidaAlmoco: saidaAlmoco || '-',
        voltaAlmoco: voltaAlmoco || '-',
        saida,
        total,
    };

    // Atualiza ou adiciona o registro
    const diaIndex = registros.findIndex(r => r.dia === dia);
    if (diaIndex !== -1) {
        registros[diaIndex] = registro;
    } else {
        registros.push(registro);
    }

    atualizarTabela();
    calcularTotais();
}

// Função para calcular a diferença de tempo entre dois horários
function calcularDiferencaHoras(horarioInicial, horarioFinal) {
    const [horaInicial, minutoInicial] = horarioInicial.split(":").map(Number);
    const [horaFinal, minutoFinal] = horarioFinal.split(":").map(Number);

    const inicio = horaInicial * 60 + minutoInicial;
    const fim = horaFinal * 60 + minutoFinal;

    return fim - inicio; // Retorna a diferença em minutos
}

// Função para calcular o total de horas trabalhadas em um dia
function calcularTotalDiario(entrada, saidaAlmoco, voltaAlmoco, saida) {
    const periodoManha = calcularDiferencaHoras(entrada, saidaAlmoco);
    const periodoTarde = calcularDiferencaHoras(voltaAlmoco, saida);

    const totalMinutos = periodoManha + periodoTarde;

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    return { horas, minutos }; // Retorna um objeto com horas e minutos
}

// Função para atualizar o total semanal e mensal
function atualizarTotais() {
    const tabela = document.querySelector("#tabelaHoras tbody");
    const linhas = tabela.querySelectorAll("tr");

    let totalMinutosSemana = 0;
    let totalMinutosMes = 0;

    linhas.forEach((linha) => {
        const totalDia = linha.querySelector(".total-dia").dataset.totalMinutos;
        totalMinutosSemana += parseInt(totalDia, 10);
        totalMinutosMes += parseInt(totalDia, 10);
    });

    // Cálculo para o total semanal
    const horasSemana = Math.floor(totalMinutosSemana / 60);
    const minutosSemana = totalMinutosSemana % 60;
    document.querySelector("#totalSemana").textContent = `${horasSemana}h${minutosSemana}min`;

    // Cálculo para o total mensal
    const horasMes = Math.floor(totalMinutosMes / 60);
    const minutosMes = totalMinutosMes % 60;
    document.querySelector("#totalMes").textContent = `${horasMes}h${minutosMes}min`;
}

// Função para adicionar um registro na tabela
function adicionarRegistro(dia) {
    const entrada = document.querySelector(`#${dia.toLowerCase()}-entrada`).value;
    const saidaAlmoco = document.querySelector(`#${dia.toLowerCase()}-saida-almoco`).value;
    const voltaAlmoco = document.querySelector(`#${dia.toLowerCase()}-volta-almoco`).value;
    const saida = document.querySelector(`#${dia.toLowerCase()}-saida`).value;

    if (entrada && saidaAlmoco && voltaAlmoco && saida) {
        const { horas, minutos } = calcularTotalDiario(entrada, saidaAlmoco, voltaAlmoco, saida);

        const totalMinutos = horas * 60 + minutos;

        const tabela = document.querySelector("#tabelaHoras tbody");
        const novaLinha = document.createElement("tr");

        novaLinha.innerHTML = `
            <td>${dia}</td>
            <td>${entrada}</td>
            <td>${saidaAlmoco}</td>
            <td>${voltaAlmoco}</td>
            <td>${saida}</td>
            <td class="total-dia" data-total-minutos="${totalMinutos}">${horas}h${minutos}min</td>
            <td><button onclick="removerRegistro(this)">Remover</button></td>
        `;

        tabela.appendChild(novaLinha);

        atualizarTotais();
    } else {
        alert("Por favor, preencha todos os campos!");
    }
}

// Função para remover um registro
function removerRegistro(botao) {
    const linha = botao.parentNode.parentNode;
    linha.remove();
    atualizarTotais();
}


function removerRegistro(index) {
    registros.splice(index, 1);
    atualizarTabela();
    calcularTotais();
}

function calcularTotais() {
    let totalMinutosSemana = 0;

    registros.forEach(registro => {
        const [horas, minutos] = registro.total.replace('h', ':').replace('min', '').split(':');
        totalMinutosSemana += parseInt(horas) * 60 + parseInt(minutos);
    });

    const horasSemana = Math.floor(totalMinutosSemana / 60);
    const minutosSemana = totalMinutosSemana % 60;

    // Atualiza total semanal
    document.getElementById('totalSemana').textContent = `${horasSemana}h${minutosSemana}min`;

    // Calcula total do mês considerando semanas completas e dias extras
    const semanasCompletas = Math.floor(registros.length / 7);
    const diasExtras = registros.length % 7;

    const totalHorasMes = (semanasCompletas * horasSemana) + (diasExtras * (horasSemana / 7));
    const totalHorasMesArredondado = Math.floor(totalHorasMes);
    const totalMinutosMes = Math.round((totalHorasMes - totalHorasMesArredondado) * 60);

    document.getElementById('totalMes').textContent = `${totalHorasMesArredondado}h${totalMinutosMes}min`;
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Relatório de Horas Trabalhadas', 20, 20);

    let y = 40;
    registros.forEach(registro => {
        doc.text(`${registro.dia} - ${registro.total}`, 20, y);
        y += 10;
    });

    doc.text(`Total da Semana: ${document.getElementById('totalSemana').textContent}`, 20, y + 10);
    doc.text(`Total do Mês: ${document.getElementById('totalMes').textContent}`, 20, y + 20);

    doc.save('horas-trabalhadas.pdf');
}
