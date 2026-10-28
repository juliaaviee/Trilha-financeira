// ============================================================
//  TRILHA DO DINHEIRO — Game Logic
//  Jogo educativo de finanças para escolas públicas
// ============================================================

// ── Estado do jogo ──────────────────────────────────────────
const state = {
  playerName:  'Jogador',
  avatar:      '🧒',
  money:       100,
  savings:     0,
  happiness:   5,
  currentPhase: 0,
  audioEnabled: false,
  lessons:     [],
};

// ── Cenários do jogo ─────────────────────────────────────────
// Cada cenário tem: icon, title, tip, description, choices[]
// Cada choice: icon, text, moneyDelta, savingsDelta, happinessDelta, quality, msg, lesson
const SCENARIOS = [
  {
    icon: '🎂',
    title: 'Aniversário com dinheiro!',
    tip: 'Receber dinheiro é uma ótima oportunidade para aprender a guardá-lo.',
    desc: 'Hoje é seu aniversário e você ganhou R$ 50,00 de presente! O que você vai fazer com esse dinheiro?',
    choices: [
      {
        icon: '🏦', text: 'Guardar na poupança',
        money: 0, savings: 50, happiness: +1,
        quality: 'good',
        msg: 'Que decisão incrível! Guardar dinheiro é o primeiro passo para realizar seus sonhos.',
        lesson: 'Poupar dinheiro, mesmo que pouco, cria um hábito poderoso que vai te ajudar a vida toda.'
      },
      {
        icon: '🍫', text: 'Gastar tudo em doces',
        money: 0, savings: 0, happiness: +2,
        quality: 'bad',
        msg: 'Mmmm, os doces foram deliciosos! Mas agora o dinheiro acabou...',
        lesson: 'Gastar tudo de uma vez nos deixa felizes por pouco tempo. Planejar o gasto traz mais satisfação!'
      },
      {
        icon: '✂️', text: 'Guardar metade, gastar metade',
        money: 25, savings: 25, happiness: +1,
        quality: 'mid',
        msg: 'Ótimo equilíbrio! Você aproveitou um pouco e ainda guardou para o futuro.',
        lesson: 'Dividir o dinheiro entre poupança e gastos é uma estratégia chamada "50/50" — muito usada por pessoas organizadas!'
      },
      {
        icon: '🎁', text: 'Dar tudo para um amigo',
        money: 0, savings: 0, happiness: +3,
        quality: 'bad',
        msg: 'Que gesto bonito! Mas agora você ficou sem nada. Ser generoso é ótimo, mas se cuide também!',
        lesson: 'Ajudar os outros é lindo, mas devemos equilibrar generosidade com cuidar das nossas próprias necessidades.'
      },
    ]
  },
  {
    icon: '🛒',
    title: 'Feira do bairro',
    tip: 'Fazer uma lista antes de comprar evita gastos desnecessários!',
    desc: 'Você foi à feira comprar frutas para a semana. Tem R$ 30,00 no bolso. Como você vai comprar?',
    choices: [
      {
        icon: '📝', text: 'Faço uma lista e compro só o necessário',
        money: -20, savings: 0, happiness: +1,
        quality: 'good',
        msg: 'Arrasou! Com a lista, você comprou exatamente o que precisava e ainda sobrou dinheiro.',
        lesson: 'Fazer lista de compras é uma das melhores formas de não gastar além do planejado.'
      },
      {
        icon: '👀', text: 'Compro tudo que achar bonito',
        money: -30, savings: 0, happiness: +2,
        quality: 'bad',
        msg: 'Você encheu o carrinho de coisas, mas gastou tudo. E parte das compras pode estragar antes de comer!',
        lesson: 'Compras por impulso, sem planejamento, podem desperdiçar comida e dinheiro.'
      },
      {
        icon: '💬', text: 'Pechincho nos preços',
        money: -18, savings: 0, happiness: +2,
        quality: 'good',
        msg: 'Que esperto(a)! Pechinchar é uma habilidade importante — você economizou R$ 2,00!',
        lesson: 'Negociar preços é normal e inteligente, especialmente em feiras livres!'
      },
      {
        icon: '🤷', text: 'Esqueço a feira e peço delivery caro',
        money: -28, savings: 0, happiness: 0,
        quality: 'bad',
        msg: 'O delivery foi conveniente, mas custou muito mais do que a feira. Vale a pena planejar!',
        lesson: 'Conveniência geralmente tem um custo maior. Planejar com antecedência economiza dinheiro.'
      },
    ]
  },
  {
    icon: '📱',
    title: 'O celular da turma',
    tip: 'Antes de comprar algo caro, pesquise preços em diferentes lugares!',
    desc: 'Seus amigos estão todos com um celular novo. O seu ainda funciona, mas está um pouco lento. O que você faz?',
    choices: [
      {
        icon: '⏳', text: 'Continuo usando o meu e economizo primeiro',
        money: 0, savings: +20, happiness: -1,
        quality: 'good',
        msg: 'Muito maduro(a)! Resistir à pressão dos amigos para fazer escolhas financeiras inteligentes é difícil, mas vale muito!',
        lesson: 'Pressão dos amigos pode nos levar a gastar dinheiro que não temos. Seu valor não depende do celular que você usa!'
      },
      {
        icon: '💳', text: 'Peço para minha família comprar parcelado',
        money: 0, savings: -10, happiness: +2,
        quality: 'mid',
        msg: 'Pode funcionar, mas parcelamento tem juros! Seu familiar vai pagar mais caro no total.',
        lesson: 'Compras parceladas parecem fáceis, mas os juros fazem o preço final ser muito maior. Pesquise sempre!'
      },
      {
        icon: '🔧', text: 'Levo para consertar e fica como novo',
        money: -15, savings: 0, happiness: +2,
        quality: 'good',
        msg: 'Excelente decisão! Consertar ao invés de comprar novo economiza dinheiro e ajuda o planeta!',
        lesson: 'Consertar objetos em vez de descartá-los é econômico e sustentável — duas vitórias!'
      },
      {
        icon: '😤', text: 'Compro o mais caro de todos para impressionar',
        money: -80, savings: -40, happiness: +1,
        quality: 'bad',
        msg: 'O celular é incrível, mas você ficou sem dinheiro nenhum. E a felicidade passou rápido...',
        lesson: 'Comprar coisas caras para impressionar os outros raramente traz felicidade duradoura. Compre pelo que você PRECISA!'
      },
    ]
  },
  {
    icon: '🏫',
    title: 'Cantina da escola',
    tip: 'Levar lanche de casa pode economizar muito dinheiro ao longo do mês!',
    desc: 'Todo dia você gasta R$ 5,00 na cantina da escola. Em um mês com 20 dias de aula, isso é R$ 100,00! O que você faz?',
    choices: [
      {
        icon: '🥪', text: 'Levo lanche de casa todos os dias',
        money: +80, savings: 0, happiness: 0,
        quality: 'good',
        msg: 'Incrível! Preparar o lanche em casa é muito mais barato e geralmente mais saudável também!',
        lesson: 'Pequenos gastos diários somam muito ao longo do mês. Levar lanche de casa pode economizar centenas de reais por ano!'
      },
      {
        icon: '🤝', text: 'Combino com amigos para dividir o lanche',
        money: +40, savings: 0, happiness: +1,
        quality: 'mid',
        msg: 'Dividir é uma ótima estratégia! Você economizou metade e ainda fortaleceu a amizade.',
        lesson: 'Comprar junto e dividir custos é uma forma inteligente de economizar — funciona para lanches, viagens e muito mais!'
      },
      {
        icon: '📅', text: 'Compro na cantina só 2 dias por semana',
        money: +60, savings: 0, happiness: +1,
        quality: 'good',
        msg: 'Equilíbrio perfeito! Você se permitiu algumas compras sem exagerar.',
        lesson: 'Estabelecer um limite para gastos (como "cantina só 2 vezes por semana") é uma excelente forma de controlar o orçamento.'
      },
      {
        icon: '🛍️', text: 'Continuo gastando R$ 5,00 todo dia',
        money: -100, savings: 0, happiness: +2,
        quality: 'bad',
        msg: 'Você aproveitou bastante a cantina! Mas ao final do mês, esse gasto pesou bastante no bolso.',
        lesson: 'Gastos pequenos e frequentes muitas vezes passam despercebidos. Registrar o que você gasta todo dia ajuda a enxergar onde o dinheiro vai!'
      },
    ]
  },
  {
    icon: '⚽',
    title: 'O torneio dos sonhos',
    tip: 'Ter uma meta e poupar para ela é chamado de "poupança com objetivo"!',
    desc: 'Você quer participar de um torneio de futebol (ou outro esporte), mas precisa de R$ 80,00 para a inscrição e uniforme. Como você vai conseguir?',
    choices: [
      {
        icon: '📊', text: 'Crio um plano: economizo R$ 20,00 por mês',
        money: -20, savings: +60, happiness: +2,
        quality: 'good',
        msg: 'Parabéns! Criar um plano para atingir um objetivo financeiro é uma das habilidades mais importantes da vida!',
        lesson: 'Poupar com um objetivo claro é muito mais fácil e motivador. Esse método é usado por adultos e empresas de sucesso!'
      },
      {
        icon: '💪', text: 'Faço bicos: lavo carros, ajudo vizinhos',
        money: +50, savings: 0, happiness: +3,
        quality: 'good',
        msg: 'Que espírito empreendedor! Trabalhar para conquistar o que quer é algo para se orgulhar muito.',
        lesson: 'Trabalhar para ganhar dinheiro, mesmo que seja ajudando vizinhos, é a base do empreendedorismo!'
      },
      {
        icon: '😞', text: 'Desisto, não tenho dinheiro',
        money: 0, savings: 0, happiness: -2,
        quality: 'bad',
        msg: 'Que pena! Mas lembre: com planejamento, você poderia ter conseguido. Tente na próxima vez!',
        lesson: 'Não desista dos seus sonhos por falta de dinheiro agora. Com planejamento e tempo, muitos objetivos são alcançáveis!'
      },
      {
        icon: '🙏', text: 'Peço emprestado e prometo pagar depois',
        money: +80, savings: -80, happiness: +1,
        quality: 'bad',
        msg: 'Você participou, mas agora tem uma dívida. Lembre-se sempre de pagar quem te emprestou!',
        lesson: 'Pedir emprestado pode ajudar em emergências, mas criar o hábito de pedir empréstimos pode se tornar um problema. Prefira planejar!'
      },
    ]
  },
  {
    icon: '🎮',
    title: 'A tentação do jogo',
    tip: 'Antes de qualquer compra, pergunte-se: "Eu PRECISO disso ou só QUERO?"',
    desc: 'Um jogo novo saiu e custa R$ 60,00. Você tem esse dinheiro guardado para pagar uma conta futura. O que você faz?',
    choices: [
      {
        icon: '🚫', text: 'Não compro, esse dinheiro é para a conta',
        money: 0, savings: 0, happiness: -1,
        quality: 'good',
        msg: 'Muita responsabilidade! Cumprir com os compromissos financeiros primeiro é essencial.',
        lesson: 'Nunca use dinheiro destinado a contas e compromissos para compras por desejo. Pague as obrigações primeiro!'
      },
      {
        icon: '⏰', text: 'Espero o jogo ficar mais barato depois',
        money: 0, savings: +10, happiness: 0,
        quality: 'good',
        msg: 'Estratégico(a)! Jogos costumam cair muito de preço alguns meses depois do lançamento.',
        lesson: 'Esperar o momento certo para comprar (quando os preços caem) é uma estratégia inteligente chamada "compra planejada".'
      },
      {
        icon: '🎮', text: 'Compro o jogo e me preocupo com a conta depois',
        money: -60, savings: 0, happiness: +3,
        quality: 'bad',
        msg: 'O jogo é incrível, mas a conta ficou sem pagamento... Isso pode gerar multa ou juros!',
        lesson: 'Deixar de pagar contas para satisfazer desejos imediatos pode gerar dívidas com juros que custam muito mais caro no futuro.'
      },
      {
        icon: '👥', text: 'Combino com amigos para comprar juntos',
        money: -20, savings: 0, happiness: +2,
        quality: 'mid',
        msg: 'Criativo(a)! Dividir o custo de um jogo com amigos é uma saída inteligente.',
        lesson: 'Comprar em grupo e revezar o uso de bens é uma forma colaborativa de economizar!'
      },
    ]
  },
  {
    icon: '🌧️',
    title: 'Emergência inesperada',
    tip: 'Uma reserva de emergência é dinheiro guardado para imprevistos. É como um "paraquedas financeiro"!',
    desc: 'Seu material escolar caiu e danificou. Você precisa de R$ 40,00 urgente para o caderno e lápis. Mas esse dinheiro não estava planejado!',
    choices: [
      {
        icon: '🏦', text: 'Uso minha reserva de emergência',
        money: -40, savings: 0, happiness: 0,
        quality: 'good',
        msg: 'Perfeito! É exatamente para isso que serve a reserva de emergência — imprevistos!',
        lesson: 'Ter uma reserva de emergência (pelo menos 3 meses de gastos básicos guardados) é fundamental para qualquer pessoa.'
      },
      {
        icon: '✂️', text: 'Corto outros gastos deste mês para cobrir',
        money: -40, savings: 0, happiness: -1,
        quality: 'good',
        msg: 'Boa adaptação! Você ajustou o orçamento e resolveu o problema sem se endividar.',
        lesson: 'Saber ajustar os gastos quando surge um imprevisto é sinal de maturidade financeira.'
      },
      {
        icon: '😰', text: 'Peço dinheiro emprestado pagando juros',
        money: -50, savings: 0, happiness: -2,
        quality: 'bad',
        msg: 'Resolveu o problema, mas pagou R$ 10,00 a mais de juros. Isso é o custo do empréstimo!',
        lesson: 'Juros são o "preço" de pedir dinheiro emprestado. Quanto mais tempo demorar para pagar, mais caro fica!'
      },
      {
        icon: '📚', text: 'Peço ajuda na escola (livros emprestados)',
        money: 0, savings: 0, happiness: +1,
        quality: 'good',
        msg: 'Excelente! Escolas públicas têm recursos e programas de apoio. Usar esses recursos é inteligente e legítimo!',
        lesson: 'Buscar ajuda em instituições e programas sociais é um direito. Não hesite em usar os recursos disponíveis!'
      },
    ]
  },
  {
    icon: '🏆',
    title: 'Renda extra especial',
    tip: 'Quando ganhar dinheiro extra, a regra de ouro é: pague-se primeiro! Guarde antes de gastar.',
    desc: 'Você ajudou na venda de rifas da escola e ganhou R$ 70,00 de comissão! Esse dinheiro não estava planejado. O que você faz?',
    choices: [
      {
        icon: '📊', text: 'Invisto tudo na poupança',
        money: 0, savings: +70, happiness: +1,
        quality: 'good',
        msg: 'Incrível disciplina! Guardar renda extra acelera muito seu progresso financeiro.',
        lesson: 'Guardar 100% da renda extra é o jeito mais rápido de construir uma reserva financeira sólida!'
      },
      {
        icon: '🎉', text: 'Gasto metade, guardo metade',
        money: +35, savings: +35, happiness: +2,
        quality: 'mid',
        msg: 'Equilíbrio perfeito! Você celebrou o ganho e ainda construiu sua reserva.',
        lesson: 'A regra 50/50 para renda extra é muito saudável — você comemora sem comprometer seu futuro!'
      },
      {
        icon: '🛍️', text: 'Gasto tudo de uma vez "porque era extra"',
        money: +70, savings: 0, happiness: +3,
        quality: 'bad',
        msg: 'Que festa! Mas o dinheiro extra poderia ter te ajudado muito se guardado.',
        lesson: 'Dinheiro "extra" merece ser tratado com a mesma responsabilidade que seu dinheiro regular.'
      },
      {
        icon: '💸', text: 'Pago dívidas antigas que tinha',
        money: 0, savings: 0, happiness: +3,
        quality: 'good',
        msg: 'Decisão madura! Quitar dívidas reduz o peso dos juros e libera sua mente.',
        lesson: 'Pagar dívidas com renda extra é excelente — os juros que você evita pagar são como dinheiro no bolso!'
      },
    ]
  },
  {
    icon: '🏠',
    title: 'Sonho grande',
    tip: 'Todo grande objetivo começa com um pequeno passo e muito planejamento!',
    desc: 'Sua família precisa de uma geladeira nova. O item custa R$ 1.200,00. Você quer ajudar! Como vai planejar?',
    choices: [
      {
        icon: '📅', text: 'Proponho um plano: todos economizam R$ 100,00/mês',
        money: -10, savings: +30, happiness: +3,
        quality: 'good',
        msg: 'Que atitude incrível! Envolver a família no planejamento é trabalho em equipe real.',
        lesson: 'Objetivos financeiros familiares são mais fáceis quando todos participam do planejamento e das economias!'
      },
      {
        icon: '🔍', text: 'Pesquiso cupons de desconto e promoções',
        money: -5, savings: 0, happiness: +2,
        quality: 'good',
        msg: 'Esperteza! Pesquisar antes de comprar pode economizar centenas de reais em eletrodomésticos.',
        lesson: 'Comparar preços e buscar promoções antes de compras grandes pode gerar economias significativas!'
      },
      {
        icon: '💳', text: 'Compra parcelado em 24x (com juros altos)',
        money: -50, savings: 0, happiness: +1,
        quality: 'bad',
        msg: 'A geladeira chegou, mas com juros de 24 parcelas, você vai pagar quase o dobro do preço!',
        lesson: 'Parcelamentos longos com juros podem fazer um produto de R$ 1.200,00 custar mais de R$ 2.000,00 no total!'
      },
      {
        icon: '♻️', text: 'Busco uma geladeira usada em bom estado',
        money: -10, savings: +20, happiness: +2,
        quality: 'good',
        msg: 'Ótima ideia! Produtos usados em bom estado custam muito menos e funcionam igualmente bem.',
        lesson: 'Comprar itens usados e reformados é econômico e sustentável — uma tendência crescente no mundo!'
      },
    ]
  },
  {
    icon: '🌟',
    title: 'Seu futuro financeiro',
    tip: 'Cada decisão financeira que você toma hoje está construindo seu futuro!',
    desc: 'Você está pensando no seu futuro. Com o que você aprendeu nessa trilha, qual é o seu próximo passo?',
    choices: [
      {
        icon: '📒', text: 'Começo a anotar meus gastos todo dia',
        money: 0, savings: +20, happiness: +2,
        quality: 'good',
        msg: 'Perfeito! Um caderno de finanças (ou app) é a ferramenta número 1 de quem cuida bem do dinheiro.',
        lesson: 'Registrar todos os gastos, mesmo os pequenos, é o passo inicial para controlar suas finanças.'
      },
      {
        icon: '🎯', text: 'Defino uma meta de poupança para esse mês',
        money: 0, savings: +30, happiness: +2,
        quality: 'good',
        msg: 'Incrível! Metas claras transformam boas intenções em ações concretas.',
        lesson: 'Uma meta financeira deve ser específica (quanto?), com prazo (quando?) e realista (possível?).'
      },
      {
        icon: '📚', text: 'Procuro livros e vídeos sobre finanças',
        money: 0, savings: +10, happiness: +3,
        quality: 'good',
        msg: 'Que atitude! Quem investe em educação financeira cedo tem uma enorme vantagem na vida.',
        lesson: 'Educação financeira é um dos melhores investimentos que você pode fazer em si mesmo!'
      },
      {
        icon: '💬', text: 'Compartilho o que aprendi com minha família',
        money: 0, savings: +10, happiness: +4,
        quality: 'good',
        msg: 'Que generosidade! Ensinar o que aprendeu multiplica o impacto do conhecimento.',
        lesson: 'Compartilhar educação financeira com família e amigos cria um impacto muito maior do que só aprender sozinho!'
      },
    ]
  },
];

// ── Formatação de moeda ──────────────────────────────────────
function formatMoney(val) {
  return `R$ ${Math.max(0, val).toFixed(2).replace('.', ',')}`;
}

// ── Atualizar HUD ────────────────────────────────────────────
function updateHUD() {
  document.getElementById('hud-avatar').textContent   = state.avatar;
  document.getElementById('hud-name').textContent     = state.playerName || 'Jogador';
  document.getElementById('hud-money').textContent    = formatMoney(state.money);
  document.getElementById('hud-savings').textContent  = formatMoney(state.savings);
  document.getElementById('hud-happiness').textContent = `${Math.max(0, Math.min(10, state.happiness))}/10`;
  document.getElementById('hud-phase').textContent    = state.currentPhase + 1;

  const pct = ((state.currentPhase) / SCENARIOS.length) * 100;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.querySelector('.progress-bar-wrap').setAttribute('aria-valuenow', state.currentPhase + 1);
}

// ── Construir trilha visual ──────────────────────────────────
function buildTrail() {
  const track = document.getElementById('trail-track');
  track.innerHTML = '';
  SCENARIOS.forEach((s, i) => {
    const step = document.createElement('div');
    step.className = 'trail-step ' + (i < state.currentPhase ? 'done' : i === state.currentPhase ? 'current' : 'future');
    step.textContent = i < state.currentPhase ? '✅' : s.icon;
    step.setAttribute('aria-label', `Fase ${i + 1}: ${s.title}`);
    track.appendChild(step);

    if (i < SCENARIOS.length - 1) {
      const conn = document.createElement('div');
      conn.className = 'trail-connector ' + (i < state.currentPhase ? 'done' : '');
      track.appendChild(conn);
    }
  });

  // Scroll ao passo atual
  const current = track.querySelector('.current');
  if (current) current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

// ── Renderizar cenário ───────────────────────────────────────
function renderScenario() {
  const scenario = SCENARIOS[state.currentPhase];
  if (!scenario) { showEndScreen(); return; }

  document.getElementById('scenario-icon').textContent         = scenario.icon;
  document.getElementById('scenario-phase-label').textContent  = `Fase ${state.currentPhase + 1} de ${SCENARIOS.length}`;
  document.getElementById('scenario-title').textContent        = scenario.title;
  document.getElementById('scenario-desc').textContent         = scenario.desc;
  document.getElementById('tip-text').textContent              = scenario.tip;

  const grid = document.getElementById('choices-grid');
  grid.innerHTML = '';

  scenario.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className    = 'choice-btn';
    btn.innerHTML    = `<span class="choice-icon" aria-hidden="true">${choice.icon}</span>${choice.text}`;
    btn.setAttribute('aria-label', choice.text);
    btn.dataset.idx  = idx;
    btn.id           = `choice-btn-${idx}`;
    btn.addEventListener('click', () => handleChoice(idx));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleChoice(idx); }
    });
    grid.appendChild(btn);
  });

  // Foco no card ao mudar cenário
  setTimeout(() => {
    const card = document.getElementById('scenario-card');
    card.focus?.();
    card.setAttribute('tabindex', '-1');
    card.focus();
  }, 100);

  buildTrail();
  updateHUD();

  // Leitura em voz alta se ativada
  if (state.audioEnabled) speakText(`${scenario.title}. ${scenario.desc}`);
}

// ── Lidar com a escolha do jogador ──────────────────────────
function handleChoice(idx) {
  const scenario = SCENARIOS[state.currentPhase];
  const choice   = scenario.choices[idx];

  // Feedback visual nos botões
  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === idx) b.classList.add(`chosen-${choice.quality}`);
    else           b.style.opacity = '0.4';
  });

  // Atualizar estado
  state.money    += choice.money;
  state.savings  += choice.savings;
  state.happiness += choice.happiness;
  state.lessons.push(choice.lesson);

  setTimeout(() => showFeedback(choice, scenario), 400);
}

// ── Mostrar feedback ─────────────────────────────────────────
function showFeedback(choice, scenario) {
  const screen  = document.getElementById('screen-feedback');
  const emojiEl = document.getElementById('feedback-emoji');
  const titleEl = document.getElementById('feedback-title');
  const msgEl   = document.getElementById('feedback-msg');
  const changesEl = document.getElementById('feedback-changes');
  const lessonEl  = document.getElementById('lesson-text');

  const qualityMap = {
    good: { emoji: ['🎉','⭐','🌟','🎊','💚'][Math.floor(Math.random()*5)], title: 'Boa escolha!',    cls: 'good' },
    mid:  { emoji: ['🤔','👍','💛'][Math.floor(Math.random()*3)],            title: 'Decisão válida!', cls: 'mid'  },
    bad:  { emoji: ['😅','💸','😬'][Math.floor(Math.random()*3)],            title: 'Oops!',           cls: 'bad'  },
  };
  const q = qualityMap[choice.quality];

  emojiEl.textContent = q.emoji;
  titleEl.textContent = q.title;
  titleEl.className   = `feedback-title ${q.cls}`;
  msgEl.textContent   = choice.msg;
  lessonEl.textContent = choice.lesson;

  // Chips de mudança
  changesEl.innerHTML = '';
  const chips = [
    { label: '💵 Dinheiro',  delta: choice.money,    prefix: 'R$' },
    { label: '🏦 Poupança',  delta: choice.savings,  prefix: 'R$' },
    { label: '😊 Felicidade', delta: choice.happiness, prefix: '' },
  ];
  chips.forEach(c => {
    if (c.delta === 0) return;
    const chip = document.createElement('div');
    const sign = c.delta > 0 ? '+' : '';
    chip.className = `change-chip ${c.delta > 0 ? 'pos' : 'neg'}`;
    if (c.prefix === 'R$') {
      chip.textContent = `${c.label}: ${sign}R$ ${Math.abs(c.delta).toFixed(2).replace('.', ',')}`;
    } else {
      chip.textContent = `${c.label}: ${sign}${c.delta}`;
    }
    changesEl.appendChild(chip);
  });

  screen.style.display = 'flex';
  screen.classList.add('active');

  if (state.audioEnabled) speakText(`${q.title}. ${choice.msg}. Lição: ${choice.lesson}`);

  document.getElementById('btn-next').focus();
}

// ── Avançar para próxima fase ────────────────────────────────
function nextPhase() {
  const screen = document.getElementById('screen-feedback');
  screen.style.display = 'none';
  screen.classList.remove('active');

  state.currentPhase++;

  if (state.currentPhase >= SCENARIOS.length) {
    showEndScreen();
  } else {
    renderScenario();
  }
}

// ── Tela de fim de jogo ──────────────────────────────────────
function showEndScreen() {
  document.getElementById('screen-game').classList.remove('active');
  document.getElementById('screen-game').style.display = 'none';

  const endScreen = document.getElementById('screen-end');
  endScreen.style.display = 'flex';
  endScreen.classList.add('active');

  document.getElementById('end-avatar').textContent = state.avatar;
  document.getElementById('end-name').textContent   = state.playerName || 'Jogador';
  document.getElementById('end-money').textContent  = formatMoney(state.money);
  document.getElementById('end-savings').textContent = formatMoney(state.savings);
  document.getElementById('end-happiness').textContent = `${Math.max(0, Math.min(10, state.happiness))}/10`;

  // Medalha baseada na poupança + felicidade
  const score = state.savings + state.happiness * 5;
  const medalArea = document.getElementById('medal-area');
  const subtitleEl = document.getElementById('end-subtitle');

  if (score >= 150) {
    medalArea.textContent  = '🥇';
    medalArea.setAttribute('aria-label', 'Medalha de ouro — Mestre das Finanças!');
    subtitleEl.textContent = '🏆 Você é um(a) Mestre das Finanças! Incrível!';
  } else if (score >= 80) {
    medalArea.textContent  = '🥈';
    medalArea.setAttribute('aria-label', 'Medalha de prata — Especialista Financeiro!');
    subtitleEl.textContent = '⭐ Você é um(a) Especialista Financeiro(a)! Muito bem!';
  } else if (score >= 30) {
    medalArea.textContent  = '🥉';
    medalArea.setAttribute('aria-label', 'Medalha de bronze — Estudante de Finanças!');
    subtitleEl.textContent = '💪 Você é um(a) Estudante de Finanças em crescimento!';
  } else {
    medalArea.textContent  = '📚';
    medalArea.setAttribute('aria-label', 'Livro — Continue aprendendo!');
    subtitleEl.textContent = '📖 Continue praticando — aprender leva tempo!';
  }

  // Lições aprendidas
  const list = document.getElementById('lessons-list');
  list.innerHTML = '';
  const uniqueLessons = [...new Set(state.lessons)];
  uniqueLessons.forEach(lesson => {
    const li = document.createElement('li');
    li.textContent = lesson;
    list.appendChild(li);
  });

  // Confete!
  launchConfetti();

  if (state.audioEnabled) speakText(`Parabéns, ${state.playerName}! Você completou a Trilha do Dinheiro!`);
}

// ── Confete animado ──────────────────────────────────────────
function launchConfetti() {
  const area   = document.getElementById('confetti-area');
  const colors = ['#6C3FF5','#FFB800','#22C55E','#EF4444','#3B82F6','#EC4899'];
  area.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left:${Math.random()*100}vw;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6 + Math.random()*10}px;
      height:${6 + Math.random()*10}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration:${2 + Math.random()*3}s;
      animation-delay:${Math.random()*2}s;
    `;
    area.appendChild(piece);
  }
}

// ── Text-to-Speech ───────────────────────────────────────────
function speakText(text) {
  if (!state.audioEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang  = 'pt-BR';
  utterance.rate  = 0.9;
  utterance.pitch = 1.05;

  // Tentar usar voz em português
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) utterance.voice = ptVoice;

  window.speechSynthesis.speak(utterance);
}

// ── Reiniciar jogo ───────────────────────────────────────────
function restartGame() {
  state.money        = 100;
  state.savings      = 0;
  state.happiness    = 5;
  state.currentPhase = 0;
  state.lessons      = [];

  document.getElementById('screen-end').style.display = 'none';
  document.getElementById('screen-end').classList.remove('active');
  document.getElementById('screen-feedback').style.display = 'none';
  document.getElementById('screen-feedback').classList.remove('active');

  document.getElementById('screen-welcome').style.display = 'flex';
  document.getElementById('screen-welcome').classList.add('active');
}

// ── Compartilhar resultado ────────────────────────────────────
function shareResult() {
  const text = `🎉 Completei a Trilha do Dinheiro!\n💵 Dinheiro: ${formatMoney(state.money)}\n🏦 Poupança: ${formatMoney(state.savings)}\n😊 Felicidade: ${state.happiness}/10\nAprenda sobre finanças você também! 💰`;
  if (navigator.share) {
    navigator.share({ title: 'Trilha do Dinheiro', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => alert('Resultado copiado! Cole e compartilhe com seus amigos! 🎉')).catch(() => {});
  }
}

// ── Acessibilidade — tamanho de fonte ───────────────────────
let fontScale = 1;
document.getElementById('btn-fontup').addEventListener('click', () => {
  fontScale = Math.min(fontScale + 0.15, 1.6);
  document.documentElement.style.fontSize = `${fontScale}rem`;
});
document.getElementById('btn-fontdown').addEventListener('click', () => {
  fontScale = Math.max(fontScale - 0.15, 0.8);
  document.documentElement.style.fontSize = `${fontScale}rem`;
});

// ── Acessibilidade — alto contraste ─────────────────────────
document.getElementById('btn-contrast').addEventListener('click', () => {
  document.body.classList.toggle('high-contrast');
  const isContrast = document.body.classList.contains('high-contrast');
  document.getElementById('btn-contrast').classList.toggle('active', isContrast);
  document.getElementById('btn-contrast').setAttribute('aria-pressed', isContrast);
});

// ── Acessibilidade — áudio ────────────────────────────────────
document.getElementById('btn-audio').addEventListener('click', () => {
  state.audioEnabled = !state.audioEnabled;
  document.getElementById('btn-audio').classList.toggle('active', state.audioEnabled);
  document.getElementById('btn-audio').setAttribute('aria-pressed', state.audioEnabled);
  if (state.audioEnabled) speakText('Leitura em voz alta ativada!');
  else window.speechSynthesis?.cancel();
});

// ── Seleção de avatar ─────────────────────────────────────────
document.querySelectorAll('.avatar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.avatar-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    state.avatar = btn.dataset.avatar;
  });
});

// ── Botão de leitura no cenário ───────────────────────────────
document.getElementById('btn-read-aloud').addEventListener('click', () => {
  const scenario = SCENARIOS[state.currentPhase];
  if (scenario) speakText(`${scenario.title}. ${scenario.desc}`);
});

// ── Iniciar jogo ──────────────────────────────────────────────
document.getElementById('start-btn').addEventListener('click', () => {
  const nameInput = document.getElementById('player-name');
  state.playerName = nameInput.value.trim() || 'Jogador';

  // Transição de telas
  const welcome = document.getElementById('screen-welcome');
  welcome.style.opacity = '0';
  welcome.style.transition = 'opacity 0.4s ease';
  setTimeout(() => {
    welcome.style.display = 'none';
    welcome.classList.remove('active');

    const game = document.getElementById('screen-game');
    game.style.display = 'flex';
    game.classList.add('active');

    renderScenario();
    updateHUD();
  }, 400);

  if (state.audioEnabled) speakText(`Bem-vindo(a), ${state.playerName}! Vamos aprender sobre finanças!`);
});

// Enter no campo de nome também inicia
document.getElementById('player-name').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('start-btn').click();
});

// ── Botão próxima fase ────────────────────────────────────────
document.getElementById('btn-next').addEventListener('click', nextPhase);

// ── Fim do jogo ───────────────────────────────────────────────
document.getElementById('btn-restart').addEventListener('click', restartGame);
document.getElementById('btn-share').addEventListener('click', shareResult);

// ── Pré-carregar vozes TTS ────────────────────────────────────
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// ── Mascote SVG embutido (fallback caso imagem não carregue) ──
// Insere um SVG simples de mascote porquinho
(function injectMascot() {
  const img = document.getElementById('mascot-welcome');
  if (!img) return;
  const svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="115" r="70" fill="#C084FC"/>
    <circle cx="100" cy="115" r="58" fill="#E9D5FF"/>
    <ellipse cx="80" cy="140" rx="18" ry="12" fill="#C084FC"/>
    <ellipse cx="120" cy="140" rx="18" ry="12" fill="#C084FC"/>
    <circle cx="100" cy="110" r="30" fill="#F5D0FF"/>
    <ellipse cx="95" cy="118" rx="6" ry="5" fill="#C084FC"/>
    <ellipse cx="105" cy="118" rx="6" ry="5" fill="#C084FC"/>
    <circle cx="93" cy="100" r="5" fill="#7C3AED"/>
    <circle cx="107" cy="100" r="5" fill="#7C3AED"/>
    <circle cx="94" cy="99" r="2" fill="#fff"/>
    <circle cx="108" cy="99" r="2" fill="#fff"/>
    <path d="M92 110 Q100 118 108 110" stroke="#7C3AED" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="88" y="55" width="24" height="18" rx="4" fill="#FFB800"/>
    <rect x="98" y="45" width="8" height="12" rx="2" fill="#FFB800"/>
    <circle cx="100" cy="44" r="3" fill="#FFD700"/>
    <circle cx="75" cy="90" r="14" fill="#E9D5FF" stroke="#C084FC" stroke-width="2"/>
    <circle cx="125" cy="90" r="14" fill="#E9D5FF" stroke="#C084FC" stroke-width="2"/>
  </svg>`;
  img.outerHTML = svg;
})();
