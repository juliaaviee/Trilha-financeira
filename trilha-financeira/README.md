# Trilha do Dinheiro 

Um jogo educativo e interativo de educação financeira desenvolvido especialmente para estudantes, focado em escolhas cotidianas, planejamento financeiro e tomada de decisões conscientes.

---

## Como Executar

A página principal do jogo é o arquivo **`index.html`**.

Para jogar localmente:
1. Abra a pasta do projeto em seu computador.
2. Dê um duplo clique no arquivo **`index.html`** para executá-lo diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
3. Não é necessária a instalação de dependências, servidores ou extensões adicionais.

Também pode ser publicado diretamente no **GitHub Pages** apontando para a raiz do repositório (`/root`), já que o arquivo principal é o `index.html`.

---

## Estrutura do Projeto

- **`index.html`**: Estrutura semântica da aplicação, acessibilidade, telas de boas-vindas, jogo, feedback e tela final.
- **`game.js`**: Lógica do jogo, gerenciamento de estado (carteira, poupança, felicidade), banco de cenários, motor de cálculo contábil e sintetizador de voz (TTS).
- **`style.css`**: Design visual, animações, sistema de temas e suporte nativo a alto contraste e redimensionamento de fonte.

---

## Mecânica e Regras do Jogo

O jogador inicia sua jornada com:
- **Dinheiro em Carteira:** R$ 100,00
- **Poupança / Reserva:** R$ 0,00
- **Nível de Felicidade:** 5 / 10

Ao longo de 10 fases temáticas, o jogador enfrenta situações do cotidiano (aniversário, cantina da escola, feira, compras parceladas, emergências e metas familiares):

1. **Equilíbrio Financeiro:** Gastar tudo em impulsos reduz a segurança; poupar com constância prepara para imprevistos.
2. **Reserva de Emergência:** Em momentos de imprevisto, o jogo utiliza prioritariamente a poupança guardada para evitar dívidas caras.
3. **Avaliação e Pontuação:**
   - A pontuação final valoriza ativamente a **Poupança acumulada (peso 2x)** em relação ao dinheiro que apenas sobrou na carteira (1x), incentivando a disciplina de poupar.
   - O bem-estar e a felicidade também compõem a nota final.

### Sistema de Medalhas
- **Ouro (Mestre das Finanças):** Pontuação ≥ 260. Requer economia disciplinada e decisões equilibradas.
- **Prata (Especialista Financeiro):** Pontuação ≥ 180. Bom controle do orçamento e poupança formada.
- **Bronze (Estudante de Finanças):** Pontuação ≥ 120. Desempenho intermediário, requer atenção a despesas.
- **Livro de Estudos (Continue Aprendendo):** Pontuação < 120. Cenários em que prevaleceram compras por impulso ou endividamento com juros.

---

## Recursos de Acessibilidade

- Suporte completo a navegação por teclado (`Tab`, `Enter`, `Espaço`).
- Alternância de **Alto Contraste** para baixa visão ou ambientes claros.
- Controles de tamanho de fonte integrados (`A+` / `A-`).
- Leitura em voz alta via Web Speech API com botão direto para narração do cenário em tempo real.
- Interface limpa e inclusiva, com indicadores de alternativas e foco visual acessível.

