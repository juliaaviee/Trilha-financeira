// ============================================================
//  TRILHA DO DINHEIRO — Game Logic
//  Jogo educativo de finanças para escolas públicas
// ============================================================

// ── Estado do jogo ──────────────────────────────────────────
const state = {
  playerName: 'Jogador',
  avatar: '🧒',
  money: 100,
  savings: 0,
  happiness: 5,
  currentPhase: 0,
  audioEnabled: false,
  lessons: [],
};

// ── Cenários do jogo ─────────────────────────────────────────
// Cada cenário tem: title, tip, desc, choices[]
// Cada choice: text, money, savings, happiness, quality, msg, lesson
const SCENARIOS = [
  {
    title: 'Aniversário com dinheiro!',
    tip: 'Receber dinheiro de presente é uma ótima oportunidade para começar a poupar.',
    desc: 'Hoje é seu aniversário e você ganhou R$ 50,00 de presente! O que você vai fazer com esse dinheiro?',
    choices: [
      {
        text: 'Guardar tudo na poupança',
        money: 0, savings: 50, happiness: +1,
        quality: 'good',
        msg: 'Excelente decisão! Guardar o presente logo no início cria uma reserva valiosa para seus planos futuros.',
        lesson: 'Poupar dinheiro recebido como presente ou renda extra ajuda a construir uma reserva financeira sólida.'
      },
      {
        text: 'Gastar tudo em doces e brinquedos',
        money: 0, savings: 0, happiness: +1,
        quality: 'bad',
        msg: 'Foi divertido no primeiro momento, mas os R$ 50,00 acabaram rapidamente e nada foi economizado.',
        lesson: 'Gastar tudo por impulso gera satisfação passageira. Guardar ao menos uma parte garante segurança.'
      },
      {
        text: 'Guardar R$ 25,00 na poupança e gastar R$ 25,00',
        money: 0, savings: 25, happiness: +2,
        quality: 'mid',
        msg: 'Bom equilíbrio! Você aproveitou metade do presente e guardou a outra metade com responsabilidade.',
        lesson: 'Dividir o dinheiro entre poupança e lazer (como na regra 50/50) permite curtir sem descuidar do futuro.'
      },
      {
        text: 'Guardar R$ 25,00 na poupança e colocar R$ 25,00 na carteira',
        money: +25, savings: 25, happiness: +1,
        quality: 'good',
        msg: 'Muito organizado! Metade foi para a poupança e a outra metade ficou na carteira para despesas úteis.',
        lesson: 'Manter dinheiro reservado na carteira evita que você precise mexer na poupança a qualquer momento.'
      },
    ]
  },
  {
    title: 'Feira do bairro',
    tip: 'Fazer uma lista antes de sair de casa evita compras por impulso e desperdício.',
    desc: 'Você foi à feira comprar frutas e legumes para a semana com R$ 20,00 na carteira. Como você faz suas compras?',
    choices: [
      {
        text: 'Faço uma lista e compro apenas o necessário (gasto R$ 10,00)',
        money: -10, savings: 0, happiness: +1,
        quality: 'good',
        msg: 'Parabéns! Com a lista, você comprou exatamente o planejado por R$ 10,00 e preservou o restante.',
        lesson: 'Uma lista de compras prévia é uma das formas mais eficientes de manter o orçamento sob controle.'
      },
      {
        text: 'Compro tudo o que acho atraente nas bancas (gasto R$ 20,00)',
        money: -20, savings: 0, happiness: +1,
        quality: 'bad',
        msg: 'Você gastou todo o dinheiro disponível e corre o risco de deixar alimentos estragarem antes do consumo.',
        lesson: 'Comprar por impulso na feira ou mercado gera desperdício de alimentos e esvazia o bolso.'
      },
      {
        text: 'Pesquiso as bancas e negocio desconto (gasto R$ 8,00)',
        money: -8, savings: 0, happiness: +2,
        quality: 'good',
        msg: 'Ótima pesquisa! Comparando preços e negociando com simpatia, você comprou tudo por apenas R$ 8,00.',
        lesson: 'Pesquisar e pedir desconto respeitosamente é um hábito inteligente de quem valoriza o dinheiro.'
      },
      {
        text: 'Desisto da feira e peço delivery caro em casa (gasto R$ 22,00)',
        money: -22, savings: 0, happiness: 0,
        quality: 'bad',
        msg: 'A comida pronta foi prática, mas custou mais caro e rendeu muito menos para os próximos dias.',
        lesson: 'A conveniência diária costuma ter um preço alto. Planejar refeições com alimentos frescos é mais econômico.'
      },
    ]
  },
  {
    title: 'O celular da turma',
    tip: 'Antes de trocar de aparelho, pergunte-se: eu realmente preciso ou é apenas vaidade?',
    desc: 'Seus amigos compraram celulares novos. O seu ainda funciona muito bem, mas você sente vontade de trocar. O que fazer?',
    choices: [
      {
        text: 'Continuo com o meu e guardo R$ 10,00 da carteira na poupança',
        money: -10, savings: +10, happiness: +1,
        quality: 'good',
        msg: 'Maturidade financeira admirável! Você transferiu R$ 10,00 para a poupança para uma futura troca planejada.',
        lesson: 'Resistir à pressão dos colegas protege suas economias. Seu valor pessoal não depende de ter o celular do ano.'
      },
      {
        text: 'Levo a uma assistência para revisão simples por R$ 8,00',
        money: -8, savings: 0, happiness: +2,
        quality: 'good',
        msg: 'Excelente escolha! Com uma manutenção barata de R$ 8,00, o aparelho ficou ágil e vai durar muito mais.',
        lesson: 'Consertar e manter seus pertences em bom estado é muito mais sustentável e econômico do que comprar novo.'
      },
      {
        text: 'Compro uma capinha nova estilosa por R$ 12,00 para renovar o visual',
        money: -12, savings: 0, happiness: +2,
        quality: 'mid',
        msg: 'Boa ideia! Por um valor pequeno você renovou o celular sem precisar gastar centenas de reais em um aparelho novo.',
        lesson: 'Pequenos cuidados e renovações dão vida nova aos nossos pertences gastando quase nada.'
      },
      {
        text: 'Compro um modelo novo caro por impulso e pago R$ 30,00 de entrada',
        money: -30, savings: 0, happiness: -1,
        quality: 'bad',
        msg: 'O impacto no saldo foi pesado. Passada a euforia dos primeiros dias, você percebeu que o dinheiro fará falta.',
        lesson: 'Gastar valores altos apenas para impressionar outras pessoas prejudica diretamente a sua tranquilidade.'
      },
    ]
  },
  {
    title: 'Cantina da escola',
    tip: 'Pequenos gastos diários repetidos todos os meses somam valores surpreendentes.',
    desc: 'Você recebeu sua mesada de R$ 30,00 para organizar seus lanches deste mês na escola. Como você vai administrar esse valor?',
    choices: [
      {
        text: 'Preparo lanches em casa (gasto R$ 8,00 e sobram R$ 22,00 na carteira)',
        money: +22, savings: 0, happiness: +1,
        quality: 'good',
        msg: 'Economia exemplar! Preparar em casa custou apenas R$ 8,00 no mês, deixando R$ 22,00 livres na sua carteira.',
        lesson: 'Levar refeições ou lanches preparados em casa é um dos hábitos mais simples e eficazes para poupar.'
      },
      {
        text: 'Preparo em casa e transfiro R$ 15,00 para a poupança (sobram R$ 7,00)',
        money: +7, savings: +15, happiness: +2,
        quality: 'good',
        msg: 'Planejamento impecável! R$ 8,00 foram para a comida, R$ 15,00 para a poupança e ainda sobraram R$ 7,00 na carteira.',
        lesson: 'Destinar a economia de um hábito diário para a poupança transforma pequenas renúncias em patrimônio real.'
      },
      {
        text: 'Compro na cantina apenas 2 vezes na semana (gasto R$ 16,00 e sobram R$ 14,00)',
        money: +14, savings: 0, happiness: +2,
        quality: 'mid',
        msg: 'Belo equilíbrio! Você aproveitou a cantina com moderação e ainda guardou quase metade da mesada.',
        lesson: 'Estabelecer limites claros para compras de conveniência permite desfrutar do momento sem comprometer as finanças.'
      },
      {
        text: 'Consumo salgados e refrigerantes na cantina todo dia (gasto os R$ 30,00 inteiros)',
        money: 0, savings: 0, happiness: +1,
        quality: 'bad',
        msg: 'Foi gostoso, mas gastar a mesada inteira na cantina não deixou nenhuma sobra para imprevistos.',
        lesson: 'Gastos de rotina diária são silenciosos. Consumir tudo no dia a dia impede a formação de reservas.'
      },
    ]
  },
  {
    title: 'O torneio dos sonhos',
    tip: 'Ter uma meta definida torna o ato de economizar muito mais estimulante.',
    desc: 'Sua turma quer participar do campeonato de esportes da cidade. A taxa de inscrição e a camisa custam R$ 15,00. Como você vai conseguir?',
    choices: [
      {
        text: 'Faço pequenos bicos para vizinhos, ganho R$ 25,00 e pago a taxa (sobram R$ 10,00)',
        money: +10, savings: 0, happiness: +3,
        quality: 'good',
        msg: 'Espírito empreendedor notável! Você arrecadou R$ 25,00, pagou a inscrição e ainda guardou R$ 10,00 de lucro.',
        lesson: 'Buscar formas criativas e honestas de obter renda ativa é a base do empreendedorismo e da autonomia.'
      },
      {
        text: 'Uso R$ 15,00 da minha poupança guardada para objetivos',
        money: 0, savings: -15, happiness: +2,
        quality: 'good',
        msg: 'Para isso serve a poupança com propósito! Você realizou uma meta pessoal sem recorrer a empréstimos.',
        lesson: 'Guardar dinheiro com uma meta pré-estabelecida dá clareza e sentido ao ato de poupar.'
      },
      {
        text: 'Economizo da mesada e pago os R$ 15,00 à vista com a carteira',
        money: -15, savings: 0, happiness: +1,
        quality: 'good',
        msg: 'Decisão consciente! Você planejou seus gastos da carteira e pagou a taxa à vista sem dívidas.',
        lesson: 'Pagar despesas pontuais com dinheiro disponível evita contrair empréstimos com juros.'
      },
      {
        text: 'Tomo empréstimo com juros (pagarei R$ 22,00 ao todo com a carteira)',
        money: -22, savings: 0, happiness: -2,
        quality: 'bad',
        msg: 'Você jogou o campeonato, mas o empréstimo gerou R$ 7,00 a mais em juros que pesará no bolso.',
        lesson: 'Tomar dinheiro emprestado sempre encarece a compra. Planejar antes de consumir evita juros.'
      },
    ]
  },
  {
    title: 'A tentação do jogo',
    tip: 'Necessidades essenciais devem ser priorizadas sempre antes dos desejos.',
    desc: 'Você precisa comprar uma apostila escolar por R$ 12,00. No entanto, viu um jogo digital em oferta por R$ 18,00. O que fazer?',
    choices: [
      {
        text: 'Pago a apostila de R$ 12,00 e guardo R$ 10,00 na poupança',
        money: -22, savings: +10, happiness: +1,
        quality: 'good',
        msg: 'Responsabilidade admirável! Compromissos de estudo em primeiro lugar e ainda reforçou a poupança.',
        lesson: 'Priorizar compromissos obrigatórios antes do entretenimento constrói uma vida financeira tranquila.'
      },
      {
        text: 'Pago apenas a apostila de R$ 12,00 e espero outra promoção do jogo',
        money: -12, savings: 0, happiness: +1,
        quality: 'good',
        msg: 'Muita paciência e bom senso! Apostila garantida e nada de compras impulsivas.',
        lesson: 'Aguardar promoções futuras com o dinheiro preservado é uma estratégia clássica de compra inteligente.'
      },
      {
        text: 'Compro o jogo por R$ 18,00 e deixo a apostila para depois',
        money: -18, savings: 0, happiness: 0,
        quality: 'bad',
        msg: 'A empolgação com o jogo logo passou, e a pendência da apostila escolar continuou sem solução.',
        lesson: 'Deixar de pagar materiais essenciais para consumir entretenimento traz prejuízos na formação.'
      },
      {
        text: 'Divido a compra da apostila com um colega de turma (pago R$ 6,00)',
        money: -6, savings: 0, happiness: +2,
        quality: 'mid',
        msg: 'Solução cooperativa! Compartilhar o material reduziu pela metade o custo da apostila.',
        lesson: 'O consumo compartilhado e a cooperação entre amigos ajudam a viabilizar objetivos com menor custo.'
      },
    ]
  },
  {
    title: 'Emergência inesperada',
    tip: 'Uma reserva de emergência serve justamente para imprevistos não virarem dívidas.',
    desc: 'Seu material escolar estragou acidentalmente e você precisa repor caderno e estojo com urgência por R$ 15,00. O que você faz?',
    choices: [
      {
        text: 'Uso minha reserva de emergência guardada na poupança',
        money: 0, savings: -15, happiness: 0,
        quality: 'good',
        msg: 'Perfeito! É exatamente para momentos como esse que a reserva de emergência existe — tranquilidade total.',
        lesson: 'Manter uma reserva financeira evita o desespero e impede o endividamento diante de imprevistos da vida.'
      },
      {
        text: 'Ajusto o orçamento deste mês e cubro os R$ 15,00 com a carteira',
        money: -15, savings: 0, happiness: -1,
        quality: 'good',
        msg: 'Ótima flexibilidade! Você cortou gastos não urgentes da carteira e resolveu a emergência sem dívidas.',
        lesson: 'Ter flexibilidade para reajustar gastos diante de uma surpresa é um sinal evidente de maturidade financeira.'
      },
      {
        text: 'Pego empréstimo com juros (pagarei R$ 22,00 ao todo com a carteira)',
        money: -22, savings: 0, happiness: -2,
        quality: 'bad',
        msg: 'O material foi comprado, mas o empréstimo custou R$ 7,00 a mais por falta de reserva própria.',
        lesson: 'Sem uma reserva de emergência, qualquer gasto inesperado se transforma em uma dívida custosa com juros.'
      },
      {
        text: 'Procuro a secretaria escolar e solicito apoio gratuito do programa de materiais',
        money: 0, savings: 0, happiness: +1,
        quality: 'good',
        msg: 'Atitude consciente e cidadã! Escolas públicas possuem programas de assistência para garantir o aprendizado.',
        lesson: 'Conhecer seus direitos e os programas sociais disponíveis evita gastos que já são cobertos por políticas públicas.'
      },
    ]
  },
  {
    title: 'Renda extra especial',
    tip: 'Ao receber renda extraordinária, a melhor prática é poupar antes de pensar em gastar.',
    desc: 'Você colaborou na organização da feira de ciências da escola e recebeu R$ 50,00 de comissão! O que você faz com esse ganho?',
    choices: [
      {
        text: 'Transfiro os R$ 50,00 diretamente para a poupança',
        money: 0, savings: +50, happiness: +1,
        quality: 'good',
        msg: 'Disciplina formidável! Guardar receitas extras integralmente é o caminho mais rápido para ver a poupança crescer.',
        lesson: 'Poupar 100% da renda inesperada acelera seus objetivos e não compromete seu orçamento rotineiro.'
      },
      {
        text: 'Guardo R$ 25,00 na poupança e deixo R$ 25,00 na carteira',
        money: +25, savings: +25, happiness: +2,
        quality: 'mid',
        msg: 'Equilíbrio saudável! Você fortaleceu sua segurança financeira e ficou com dinheiro disponível na carteira.',
        lesson: 'A regra de repartir a renda extra equilibra a sensação de merecimento com o cuidado pelo futuro.'
      },
      {
        text: 'Gasto todos os R$ 50,00 em compras aleatórias no mesmo dia',
        money: 0, savings: 0, happiness: +1,
        quality: 'bad',
        msg: 'O dinheiro entrou e evaporou no mesmo dia sem deixar qualquer reserva para o futuro.',
        lesson: 'Tratar renda extra como dinheiro sem valor impede a construção de um patrimônio duradouro.'
      },
      {
        text: 'Uso R$ 15,00 para quitar uma pendência e guardo R$ 35,00 na poupança',
        money: 0, savings: +35, happiness: +3,
        quality: 'good',
        msg: 'Decisão impecável! Você eliminou compromissos passados e ainda direcionou R$ 35,00 para o seu futuro.',
        lesson: 'Quitar pendências e dívidas é sempre um dos melhores investimentos, pois livra você de cobranças futuras.'
      },
    ]
  },
  {
    title: 'Sonho grande',
    tip: 'Objetivos maiores exigem planejamento em família e pesquisa criteriosa de preços.',
    desc: 'Sua família precisa adquirir um ventilador novo para casa. Na loja física, o modelo à vista custa R$ 120,00. Como colaborar no planejamento?',
    choices: [
      {
        text: 'Contribuo com R$ 15,00 da minha carteira para ajudar na meta familiar',
        money: -15, savings: 0, happiness: +3,
        quality: 'good',
        msg: 'Colaboração exemplar! Participar das decisões financeiras da família ensina cooperação e valorização mútua.',
        lesson: 'Quando a família se une e planeja os gastos em conjunto, as metas são alcançadas com muito mais facilidade.'
      },
      {
        text: 'Pesquiso cupons online, acho oferta com desconto e contribuo com R$ 10,00',
        money: -10, savings: 0, happiness: +3,
        quality: 'good',
        msg: 'Excelente iniciativa! Sua pesquisa gerou economia para a família inteira.',
        lesson: 'Dedicar tempo à comparação de preços e busca por promoções resulta em economia expressiva em bens duráveis.'
      },
      {
        text: 'Sugiro parcelar em 12 vezes com juros altos (contribuo com R$ 20,00)',
        money: -20, savings: 0, happiness: 0,
        quality: 'bad',
        msg: 'O produto chegou, mas pagar juros altos comprometerá o orçamento familiar por um ano inteiro.',
        lesson: 'Financiamentos longos encarecem consideravelmente o preço final. Vale muito a pena poupar para pagar à vista.'
      },
      {
        text: 'Sugiro adquirir um modelo seminovo revisado (contribuo com R$ 10,00)',
        money: -10, savings: 0, happiness: +2,
        quality: 'good',
        msg: 'Ideia prática e sustentável! O produto funciona perfeitamente e custou a metade do valor da loja.',
        lesson: 'O mercado de produtos seminovos em bom estado é uma alternativa econômica e ecologicamente consciente.'
      },
    ]
  },
  {
    title: 'Seu futuro financeiro',
    tip: 'A educação financeira é uma habilidade para a vida inteira que se constrói dia após dia.',
    desc: 'Você completou a Trilha do Dinheiro! Com todos os aprendizados adquiridos, qual compromisso você assume para o seu dia a dia?',
    choices: [
      {
        text: 'Anotar todos os gastos e ganhos em um caderno ou aplicativo',
        money: 0, savings: 0, happiness: +2,
        quality: 'good',
        msg: 'Hábito fundamental! O registro detalhado de receitas e despesas é o alicerce de qualquer vida financeira saudável.',
        lesson: 'Saber com precisão para onde vai cada centavo dá controle e segurança sobre suas escolhas financeiras.'
      },
      {
        text: 'Guardar pelo menos R$ 10,00 da carteira na poupança todo mês',
        money: -10, savings: +10, happiness: +2,
        quality: 'good',
        msg: 'Compromisso firmado! Você já transferiu seus primeiros R$ 10,00 para a poupança para selar o hábito.',
        lesson: 'A constância de poupar com frequência vale mais do que a quantia guardada. Crie o hábito desde cedo!'
      },
      {
        text: 'Refletir 24 horas antes de realizar qualquer compra não essencial',
        money: 0, savings: 0, happiness: +2,
        quality: 'good',
        msg: 'Estratégia brilhante! Aguardar um dia antes de comprar elimina a imensa maioria dos impulsos momentâneos.',
        lesson: 'A pausa consciente entre a vontade e a decisão é a melhor defesa contra o consumo impensado.'
      },
      {
        text: 'Conversar abertamente sobre dinheiro e planejamento com a família',
        money: 0, savings: 0, happiness: +3,
        quality: 'good',
        msg: 'Generosidade e visão! Compartilhar o aprendizado financeiro melhora o bem-estar e o futuro de toda a casa.',
        lesson: 'Falar sobre finanças de maneira transparente em casa fortalece as relações e constrói estabilidade para todos.'
      },
    ]
  },
];

// ── Formatação de moeda ──────────────────────────────────────
function formatMoney(val) {
  const isNeg = val < 0;
  const formatted = Math.abs(val).toFixed(2).replace('.', ',');
  return isNeg ? `-R$ ${formatted}` : `R$ ${formatted}`;
}

// ── Atualizar HUD ────────────────────────────────────────────
function updateHUD() {
  document.getElementById('hud-avatar').textContent = state.avatar;
  document.getElementById('hud-name').textContent = state.playerName || 'Jogador';
  document.getElementById('hud-money').textContent = formatMoney(state.money);
  document.getElementById('hud-savings').textContent = formatMoney(state.savings);
  document.getElementById('hud-happiness').textContent = `${Math.max(0, Math.min(10, state.happiness))}/10`;
  document.getElementById('hud-phase').textContent = state.currentPhase + 1;

  const pct = ((state.currentPhase + 1) / SCENARIOS.length) * 100;
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
    step.textContent = i < state.currentPhase ? '✓' : (i + 1);
    step.setAttribute('aria-label', `Fase ${i + 1}: ${s.title}`);
    track.appendChild(step);

    if (i < SCENARIOS.length - 1) {
      const conn = document.createElement('div');
      conn.className = 'trail-connector ' + (i < state.currentPhase ? 'done' : '');
      track.appendChild(conn);
    }
  });

  const current = track.querySelector('.current');
  if (current) current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

// ── Renderizar cenário ───────────────────────────────────────
function renderScenario() {
  const scenario = SCENARIOS[state.currentPhase];
  if (!scenario) { showEndScreen(); return; }

  document.getElementById('scenario-phase-label').textContent = `Fase ${state.currentPhase + 1} de ${SCENARIOS.length}`;
  document.getElementById('scenario-title').textContent = scenario.title;
  document.getElementById('scenario-desc').textContent = scenario.desc;
  document.getElementById('tip-text').textContent = scenario.tip;

  const grid = document.getElementById('choices-grid');
  grid.innerHTML = '';

  const letters = ['A', 'B', 'C', 'D'];
  scenario.choices.forEach((choice, idx) => {
    const letter = letters[idx] || (idx + 1);
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-letter" aria-hidden="true">${letter}</span><span class="choice-text">${choice.text}</span>`;
    btn.setAttribute('aria-label', `Opção ${letter}: ${choice.text}`);
    btn.dataset.idx = idx;
    btn.id = `choice-btn-${idx}`;
    btn.addEventListener('click', () => handleChoice(idx));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleChoice(idx); }
    });
    grid.appendChild(btn);
  });

  setTimeout(() => {
    const card = document.getElementById('scenario-card');
    card.setAttribute('tabindex', '-1');
    card.focus?.();
  }, 100);

  buildTrail();
  updateHUD();

  if (state.audioEnabled) speakText(`${scenario.title}. ${scenario.desc}`);
}

// ── Lidar com a escolha do jogador ──────────────────────────
function handleChoice(idx) {
  const scenario = SCENARIOS[state.currentPhase];
  const choice = scenario.choices[idx];

  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === idx) b.classList.add(`chosen-${choice.quality}`);
    else b.style.opacity = '0.4';
  });

  const prevMoney = state.money;
  const prevSavings = state.savings;

  // Ajuste contábil inteligente
  let moneyDelta = choice.money;
  let savingsDelta = choice.savings;

  // Se a escolha tenta resgatar da poupança mais do que há disponível:
  if (savingsDelta < 0 && Math.abs(savingsDelta) > state.savings) {
    const availableSavings = state.savings;
    const remaining = Math.abs(savingsDelta) - availableSavings;
    savingsDelta = -availableSavings;
    moneyDelta -= remaining; // cobre o restante com o dinheiro da carteira
  }

  // Atualizar estado com segurança
  state.money = Math.max(0, state.money + moneyDelta);
  state.savings = Math.max(0, state.savings + savingsDelta);
  state.happiness = Math.max(0, Math.min(10, state.happiness + choice.happiness));
  state.lessons.push(choice.lesson);

  // Variação REAL que ocorreu nos saldos (evita mostrar dedução maior do que havia na carteira)
  const actualMoneyDelta = state.money - prevMoney;
  const actualSavingsDelta = state.savings - prevSavings;

  setTimeout(() => showFeedback(choice, scenario, actualMoneyDelta, actualSavingsDelta, prevSavings), 400);
}

// ── Mostrar feedback ─────────────────────────────────────────
function showFeedback(choice, scenario, moneyDelta, savingsDelta, prevSavings = 0) {
  const screen = document.getElementById('screen-feedback');
  const titleEl = document.getElementById('feedback-title');
  const msgEl = document.getElementById('feedback-msg');
  const changesEl = document.getElementById('feedback-changes');
  const lessonEl = document.getElementById('lesson-text');

  const qualityMap = {
    good: { title: 'Excelente escolha!', cls: 'good' },
    mid: { title: 'Decisão equilibrada', cls: 'mid' },
    bad: { title: 'Atenção ao orçamento!', cls: 'bad' },
  };
  const q = qualityMap[choice.quality] || qualityMap.mid;

  titleEl.textContent = q.title;
  titleEl.className = `feedback-title ${q.cls}`;

  // Se tentou resgatar da poupança mas não tinha saldo suficiente, dá o aviso pedagógico:
  let feedbackMessage = choice.msg;
  if (choice.savings < 0 && prevSavings < Math.abs(choice.savings)) {
    if (prevSavings === 0) {
      feedbackMessage = 'Atenção: como você não tinha reserva guardada na poupança, o valor teve de sair da sua carteira. É por isso que construir uma reserva com antecedência é essencial!';
    } else {
      feedbackMessage = `Você utilizou os R$ ${prevSavings.toFixed(2).replace('.', ',')} guardados na poupança e o restante precisou sair da sua carteira. Manter uma reserva completa protege seu orçamento!`;
    }
  }

  msgEl.textContent = feedbackMessage;
  lessonEl.textContent = choice.lesson;

  // Chips de mudança sem emojis antes das palavras
  changesEl.innerHTML = '';
  const chips = [
    { label: 'Dinheiro', delta: moneyDelta, prefix: 'R$' },
    { label: 'Poupança', delta: savingsDelta, prefix: 'R$' },
    { label: 'Felicidade', delta: choice.happiness, prefix: '' },
  ];

  chips.forEach(c => {
    if (c.delta === 0) return;
    const chip = document.createElement('div');
    const sign = c.delta > 0 ? '+' : '-';
    chip.className = `change-chip ${c.delta > 0 ? 'pos' : 'neg'}`;
    if (c.prefix === 'R$') {
      chip.textContent = `${c.label}: ${sign}R$ ${Math.abs(c.delta).toFixed(2).replace('.', ',')}`;
    } else {
      chip.textContent = `${c.label}: ${sign}${Math.abs(c.delta)}`;
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
  document.getElementById('end-name').textContent = state.playerName || 'Jogador';
  document.getElementById('end-money').textContent = formatMoney(state.money);
  document.getElementById('end-savings').textContent = formatMoney(state.savings);
  document.getElementById('end-happiness').textContent = `${Math.max(0, Math.min(10, state.happiness))}/10`;

  // Poupança tem peso dobrado (2x) sobre a carteira para premiar quem poupou; felicidade soma até 50 pts
  const score = Math.round((state.savings * 2) + state.money + (state.happiness * 5));
  const medalArea = document.getElementById('medal-area');
  const subtitleEl = document.getElementById('end-subtitle');

  if (score >= 250) {
    medalArea.textContent = '🥇';
    medalArea.setAttribute('aria-label', 'Medalha de ouro — Mestre das Finanças');
    subtitleEl.textContent = 'Você é um(a) Mestre das Finanças! Parabéns pelo resultado excepcional!';
  } else if (score >= 170) {
    medalArea.textContent = '🥈';
    medalArea.setAttribute('aria-label', 'Medalha de prata — Especialista Financeiro');
    subtitleEl.textContent = 'Você é um(a) Especialista Financeiro(a)! Suas escolhas foram muito conscientes.';
  } else if (score >= 110) {
    medalArea.textContent = '🥉';
    medalArea.setAttribute('aria-label', 'Medalha de bronze — Estudante de Finanças');
    subtitleEl.textContent = 'Você é um(a) Estudante de Finanças em crescimento! Bom caminho trilhado.';
  } else {
    medalArea.textContent = '📘';
    medalArea.setAttribute('aria-label', 'Livro — Continue aprendendo');
    subtitleEl.textContent = 'Continue praticando — cada tentativa traz novos aprendizados!';
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

  launchConfetti();

  if (state.audioEnabled) speakText(`Parabéns, ${state.playerName}! Você completou a Trilha do Dinheiro!`);
}

// ── Confete animado ──────────────────────────────────────────
function launchConfetti() {
  const area = document.getElementById('confetti-area');
  const colors = ['#6C3FF5', '#FFB800', '#22C55E', '#EF4444', '#3B82F6', '#EC4899'];
  area.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left:${Math.random() * 100}vw;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      width:${6 + Math.random() * 10}px;
      height:${6 + Math.random() * 10}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration:${2 + Math.random() * 3}s;
      animation-delay:${Math.random() * 2}s;
    `;
    area.appendChild(piece);
  }
}

// ── Text-to-Speech ───────────────────────────────────────────
function speakText(text, force = false) {
  if ((!state.audioEnabled && !force) || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.9;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) utterance.voice = ptVoice;

  window.speechSynthesis.speak(utterance);
}

// ── Reiniciar jogo ───────────────────────────────────────────
function restartGame() {
  state.money = 100;
  state.savings = 0;
  state.happiness = 5;
  state.currentPhase = 0;
  state.lessons = [];

  document.getElementById('screen-end').style.display = 'none';
  document.getElementById('screen-end').classList.remove('active');
  document.getElementById('screen-feedback').style.display = 'none';
  document.getElementById('screen-feedback').classList.remove('active');

  const welcome = document.getElementById('screen-welcome');
  welcome.style.opacity = '1';
  welcome.style.display = 'flex';
  welcome.classList.add('active');
}

// ── Compartilhar resultado ────────────────────────────────────
function shareResult() {
  const text = `Completei a Trilha do Dinheiro!\nSaldo em carteira: ${formatMoney(state.money)}\nPoupança acumulada: ${formatMoney(state.savings)}\nFelicidade: ${state.happiness}/10\nJogo educativo sobre finanças pessoais.`;
  if (navigator.share) {
    navigator.share({ title: 'Trilha do Dinheiro', text }).catch(() => { });
  } else {
    navigator.clipboard.writeText(text).then(() => alert('Resultado copiado para a área de transferência! Cole onde quiser para compartilhar.')).catch(() => { });
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
  if (state.audioEnabled) speakText('Leitura em voz alta ativada');
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
  if (scenario) speakText(`${scenario.title}. ${scenario.desc}`, true);
});

// ── Iniciar jogo ──────────────────────────────────────────────
document.getElementById('start-btn').addEventListener('click', () => {
  const nameInput = document.getElementById('player-name');
  state.playerName = nameInput.value.trim() || 'Jogador';

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

  if (state.audioEnabled) speakText(`Boas-vindas, ${state.playerName}! Vamos aprender sobre finanças.`);
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