export interface FirstAidGuide {
  id: string;
  titulo: string;
  resumo: string;
  passos: string[];
}

// Conteúdo espelhado localmente no app (não só na API) de propósito:
// no Modo Emergência, o usuário pode estar sem internet estável.
// Isso deve ser o MESMO conteúdo validado por profissionais que existe
// no backend (GET /api/primeiros-socorros) — trate como um cache inicial,
// e sincronize/atualize sempre que houver conexão.
export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    id: "engasgo",
    titulo: "Engasgo",
    resumo: "Obstrução das vias aéreas por alimento ou objeto.",
    passos: [
      "Pergunte se a pessoa consegue tossir ou falar — se sim, incentive a tossir com força.",
      "Se não conseguir respirar, tossir ou falar, ligue para o 192 (SAMU) imediatamente.",
      "Se você foi treinado, aplique compressões abdominais (manobra de Heimlich) até o objeto sair ou o socorro chegar.",
      "Não dê tapas nas costas de bebês com a técnica de adultos — o procedimento é diferente para menores de 1 ano.",
    ],
  },
  {
    id: "sangramento",
    titulo: "Sangramento intenso",
    resumo: "Ferimento com perda de sangue significativa.",
    passos: [
      "Ligue para o 192 (SAMU) ou peça para alguém ligar enquanto você presta os primeiros cuidados.",
      "Pressione o ferimento com um pano limpo, com firmeza e continuamente.",
      "Se possível, eleve o local do ferimento acima do nível do coração.",
      "Não remova objetos encravados no ferimento — apenas estabilize ao redor.",
    ],
  },
  {
    id: "queimadura",
    titulo: "Queimaduras",
    resumo: "Lesão por calor, produto químico ou eletricidade.",
    passos: [
      "Afaste a pessoa da fonte de calor com segurança.",
      "Resfrie a área com água corrente em temperatura ambiente por 10 a 20 minutos.",
      "Não passe gelo, pasta de dente, manteiga ou outros produtos caseiros na queimadura.",
      "Procure atendimento médico se a queimadura for extensa, profunda ou em rosto, mãos ou articulações.",
    ],
  },
  {
    id: "desmaio",
    titulo: "Desmaio",
    resumo: "Perda súbita e breve de consciência.",
    passos: [
      "Deite a pessoa de costas e eleve as pernas cerca de 30 cm, se não houver suspeita de lesão.",
      "Afrouxe roupas apertadas e garanta ventilação.",
      "Se a pessoa não recuperar a consciência em cerca de 1 minuto, ligue para o 192 (SAMU).",
      "Ao acordar, oriente que se levante devagar; não ofereça comida ou bebida imediatamente.",
    ],
  },
  {
    id: "convulsao",
    titulo: "Convulsão",
    resumo: "Crise convulsiva com movimentos involuntários.",
    passos: [
      "Proteja a cabeça da pessoa e afaste objetos que possam machucá-la.",
      "Não segure a pessoa nem coloque nada na boca dela.",
      "Deite-a de lado assim que possível, para ajudar a manter as vias aéreas livres.",
      "Ligue para o 192 (SAMU) se a crise durar mais de 5 minutos, se repetir, ou se for a primeira crise da pessoa.",
    ],
  },
  {
    id: "parada",
    titulo: "Parada cardiorrespiratória",
    resumo: "Pessoa não responde e não respira normalmente.",
    passos: [
      "Ligue imediatamente para o 192 (SAMU) — ou peça para alguém ligar enquanto você age.",
      "Se você tiver treinamento, inicie compressões torácicas no centro do peito, fortes e rápidas.",
      "Use um DEA (desfibrilador) se houver um disponível por perto e siga as instruções por voz do aparelho.",
      "Continue até o socorro especializado assumir.",
    ],
  },
];
