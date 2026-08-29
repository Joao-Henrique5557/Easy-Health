export interface FirstAidGuide {
  id: string;
  titulo: string;
  resumo: string;
  icon: string; // nome do ícone Ionicons
  passos: string[]; // formato "Título curto: descrição do passo"
}

// Conteúdo espelhado localmente no app (não só na API) de propósito:
// no Modo Emergência, o usuário pode estar sem internet estável.
// Isso deve ser o MESMO conteúdo validado por profissionais que existe
// no backend (GET /api/primeiros-socorros) — trate como um cache inicial,
// e sincronize/atualize sempre que houver conexão.
export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    id: "desmaio",
    titulo: "Desmaios",
    resumo: "Perda súbita e breve de consciência.",
    icon: "help-circle-outline",
    passos: [
      "Posicione a pessoa: deite-a de costas e eleve as pernas cerca de 30 cm, se não houver suspeita de lesão.",
      "Garanta ventilação: afrouxe roupas apertadas e mantenha o ambiente arejado.",
      "Observe o tempo: se não recuperar a consciência em cerca de 1 minuto, ligue para o 192 (SAMU).",
      "Ao acordar: oriente que se levante devagar; não ofereça comida ou bebida imediatamente.",
    ],
  },
  {
    id: "engasgo",
    titulo: "Engasgos",
    resumo: "Obstrução das vias aéreas por alimento ou objeto.",
    icon: "pulse-outline",
    passos: [
      "Identifique os sinais: verifique se a pessoa consegue tossir ou falar. Se não conseguir e levar as mãos ao pescoço, está engasgada.",
      "Peça para tossir: estimule a vítima a tossir com força para tentar desalojar o objeto espontaneamente.",
      "Aplique a Manobra de Heimlich: posicione-se atrás da vítima, feche uma mão sobre a boca do estômago e pressione para dentro e para cima.",
      "Ligue 192 se não funcionar: se a vítima perder a consciência ou o objeto não sair, ligue imediatamente para o SAMU no 192.",
    ],
  },
  {
    id: "queimadura",
    titulo: "Queimaduras",
    resumo: "Lesão por calor, produto químico ou eletricidade.",
    icon: "flame-outline",
    passos: [
      "Afaste do perigo: retire a pessoa da fonte de calor com segurança.",
      "Resfrie a área: água corrente em temperatura ambiente por 10 a 20 minutos.",
      "Evite remédios caseiros: não passe gelo, pasta de dente, manteiga ou outros produtos na queimadura.",
      "Procure atendimento: se for extensa, profunda ou em rosto, mãos ou articulações, ligue para o 192 (SAMU).",
    ],
  },
  {
    id: "convulsao",
    titulo: "Convulsões",
    resumo: "Crise convulsiva com movimentos involuntários.",
    icon: "shield-outline",
    passos: [
      "Proteja a pessoa: afaste objetos que possam machucá-la e proteja a cabeça dela.",
      "Não a contenha: não segure a pessoa nem coloque nada na boca dela.",
      "Vire de lado: assim que possível, para ajudar a manter as vias aéreas livres.",
      "Ligue 192 se: a crise durar mais de 5 minutos, se repetir, ou for a primeira crise da pessoa.",
    ],
  },
  {
    id: "sangramento",
    titulo: "Hemorragias",
    resumo: "Ferimento com perda de sangue significativa.",
    icon: "warning-outline",
    passos: [
      "Peça ajuda: ligue para o 192 (SAMU) ou peça para alguém ligar enquanto você presta os primeiros cuidados.",
      "Pressione o ferimento: use um pano limpo, com firmeza e continuamente.",
      "Eleve o local: se possível, mantenha o ferimento acima do nível do coração.",
      "Não remova objetos: se houver algo encravado, apenas estabilize ao redor, sem retirar.",
    ],
  },
  {
    id: "parada",
    titulo: "Parada Cardíaca",
    resumo: "Pessoa não responde e não respira normalmente.",
    icon: "heart-outline",
    passos: [
      "Ligue 192 imediatamente: peça para alguém ligar enquanto você inicia os cuidados.",
      "Inicie compressões: se você tiver treinamento, comprima o centro do peito, forte e rápido.",
      "Use um DEA se houver: siga as instruções por voz do próprio aparelho.",
      "Continue os cuidados: até o socorro especializado assumir.",
    ],
  },
  {
    id: "crises_respiratorias",
    titulo: "Crises Respiratórias",
    resumo: "Falta de ar súbita ou crise de asma/bronquite.",
    icon: "fitness-outline",
    passos: [
      "Mantenha sentado: a pessoa deitada pode sentir a falta de ar piorar.",
      "Afrouxe roupas: libere a região do pescoço e peito.",
      "Use a bombinha: se a pessoa tiver inalador prescrito, ajude a usá-lo conforme orientação médica dela.",
      "Ligue 192 se: lábios ou dedos ficarem arroxeados, ou não houver melhora em poucos minutos.",
    ],
  },
  {
    id: "fraturas",
    titulo: "Fraturas",
    resumo: "Suspeita de osso quebrado ou luxação.",
    icon: "bandage-outline",
    passos: [
      "Não movimente: não tente realinhar o osso nem mover a pessoa desnecessariamente.",
      "Imobilize: use uma tala improvisada, se souber fazer isso com segurança.",
      "Aplique frio: compressa fria (nunca gelo direto na pele) para reduzir o inchaço.",
      "Ligue 192 se: houver deformidade grave, exposição óssea ou dor intensa.",
    ],
  },
];
