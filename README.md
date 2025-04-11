# 🕒 Time Tracker Pro - Calculadora de Horas Trabalhadas

![Versão](https://img.shields.io/badge/versão-1.0.0--beta.awesome-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)

Um sistema web para controle de horas trabalhadas com temática gamer, permitindo o registro diário de horários e gerando relatórios em PDF. Desenvolvido com HTML, CSS e JavaScript puro (vanilla).

## 📸 Screenshots

![Aplicação](https://via.placeholder.com/800x400?text=Time+Tracker+Pro)

## ✨ Funcionalidades

- 🗓️ Registro de entrada, saída para almoço, retorno do almoço e saída final
- 📊 Cálculo automático de horas trabalhadas diárias e semanais
- 📱 Design responsivo para uso em dispositivos móveis e desktop
- 📄 Geração de relatórios em PDF personalizados
- 🎮 Interface com temática gamer e efeitos de animação
- 🔄 Gerenciamento de múltiplas semanas no mês

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS e media queries para responsividade)
- JavaScript (Vanilla)
- jsPDF para geração de PDFs

## 🚀 Como Usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/time-tracker-pro.git
   ```

2. Abra o arquivo `index.html` em seu navegador

3. Comece a registrar seus horários de trabalho

4. Gere relatórios em PDF ao final da semana

## 💻 Código Destacado

O projeto possui algumas features interessantes:

```javascript
// Função para calcular diferença entre horários
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
```

## 🎲 Easter Eggs

O projeto tem alguns easter eggs escondidos:

- 🍄 Animações com tema de jogos quando você completa uma semana
- 🪙 Sons de moedas ao salvar registros
- 🎵 Console logs com referências de games
- 👾 Relatórios em PDF com temas diferentes para cada dia da semana

## 📱 Responsividade

A aplicação foi desenvolvida com o conceito de mobile-first, adaptando-se a diferentes tamanhos de tela:

- 📱 Smartphones (até 480px)
- 📱 Tablets (481px até 768px)
- 💻 Desktops (769px até 1024px)
- 🖥️ Telas grandes (1025px+)
- 📺 Suporte a 4K (1921px+)

## 🧠 Possíveis Melhorias

- [ ] Implementar modo escuro/claro
- [ ] Adicionar autenticação de usuários
- [ ] Sincronização com Google Calendar
- [ ] Notificações de desktop
- [ ] Suporte para múltiplos idiomas
- [ ] Backup automático na nuvem

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com 💚 e muito ☕ por [Manoel Gosalan](https://github.com/mgosalan-dev)

---

Se curtiu o projeto, não esquece daquela ⭐ marota no repositório!
