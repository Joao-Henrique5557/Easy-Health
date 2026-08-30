import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Mesmos dados usados como fallback local no frontend
// (frontend/src/data/*.ts) — mantidos idênticos de propósito, para a
// experiência ser visualmente consistente esteja o app rodando com ou
// sem o backend no ar.

const ESTABLISHMENTS = [
  {
    id: "hosp-santa-casa",
    nome: "Hospital Santa Casa de Misericórdia",
    tipo: "hospital" as const,
    redeAtendimento: "publico" as const,
    endereco: "Rua Santa Izabel, 125 - Centro",
    avaliacao: 4.8,
    status: "aberto" as const,
    horario: "24h",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: "ubs-republica",
    nome: "UBS República",
    tipo: "ubs" as const,
    redeAtendimento: "publico" as const,
    endereco: "Praça da República, 302 - República",
    avaliacao: 4.2,
    status: "aberto" as const,
    horario: "07h–19h",
    latitude: -23.5435,
    longitude: -46.6427,
  },
  {
    id: "upa-24h-central",
    nome: "UPA 24h Central",
    tipo: "upa" as const,
    redeAtendimento: "publico" as const,
    endereco: "Av. São João, 950 - Santa Ifigênia",
    avaliacao: 4.5,
    status: "emergencia" as const,
    statusLabel: "Plantão Emergência",
    horario: "24h",
    latitude: -23.5425,
    longitude: -46.6388,
  },
  {
    id: "hosp-sao-lucas",
    nome: "Hospital São Lucas",
    tipo: "hospital" as const,
    redeAtendimento: "privado" as const,
    endereco: "Av. Paulista, 1500 - São Paulo, SP",
    avaliacao: 4.7,
    avaliacoesCount: 128,
    status: "aberto" as const,
    horario: "Aberto 24h",
    telefone: "(11) 3200-9000",
    especialidades: ["Cardiologia", "Ortopedia", "Pediatria", "Neurologia"],
    convenios: ["Unimed", "SulAmérica", "Bradesco"],
    latitude: -23.5613,
    longitude: -46.6558,
    precos: [
      { servico: "Consulta Clínica", valor: "R$ 180" },
      { servico: "Consulta Especialista", valor: "R$ 280" },
      { servico: "Raio-X", valor: "R$ 120" },
    ],
  },
  {
    id: "clinica-saude-mais",
    nome: "Clínica Saúde Mais",
    tipo: "clinica" as const,
    redeAtendimento: "privado" as const,
    endereco: "Rua Augusta, 450 - Consolação",
    avaliacao: 4.9,
    status: "aberto" as const,
    horario: "08h–19h",
    latitude: -23.5548,
    longitude: -46.6608,
  },
];

const FIRST_AID_GUIDES = [
  {
    id: "desmaio",
    titulo: "Desmaios",
    resumo: "Perda súbita e breve de consciência.",
    icon: "help-circle-outline",
    ordem: 1,
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
    ordem: 2,
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
    ordem: 3,
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
    ordem: 4,
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
    ordem: 5,
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
    ordem: 6,
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
    ordem: 7,
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
    ordem: 8,
    passos: [
      "Não movimente: não tente realinhar o osso nem mover a pessoa desnecessariamente.",
      "Imobilize: use uma tala improvisada, se souber fazer isso com segurança.",
      "Aplique frio: compressa fria (nunca gelo direto na pele) para reduzir o inchaço.",
      "Ligue 192 se: houver deformidade grave, exposição óssea ou dor intensa.",
    ],
  },
];

async function main() {
  console.log("Seed: limpando dados existentes...");
  await prisma.prescription.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.establishmentPrice.deleteMany();
  await prisma.establishment.deleteMany();
  await prisma.firstAidGuide.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.pushToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seed: guias de primeiros socorros...");
  for (const guide of FIRST_AID_GUIDES) {
    await prisma.firstAidGuide.create({ data: guide });
  }

  console.log("Seed: estabelecimentos...");
  for (const est of ESTABLISHMENTS) {
    const { precos, ...data } = est as typeof est & { precos?: { servico: string; valor: string }[] };
    await prisma.establishment.create({
      data: { ...data, precos: precos ? { create: precos } : undefined },
    });
  }

  console.log("Seed: usuário de demonstração...");
  const demoUser = await prisma.user.create({
    data: {
      nome: "Maria Silva",
      email: "maria.silva@email.com",
      senhaHash: await bcrypt.hash("senha123", 10),
      telefone: "(11) 99999-9999",
      dataNascimento: new Date("1990-08-14"),
      emailVerificado: true,
      tipoSanguineo: "O-",
      alergias: "Penicilina, Corantes Amarelos",
      medicamentosEmUso: "Nenhum",
      planoDeSaude: "Amil Saúde (Nacional)",
      contatoEmergenciaNome: "José Silva",
      contatoEmergenciaParentesco: "Esposo",
      contatoEmergenciaTelefone: "(11) 98888-8888",
    },
  });

  console.log("Seed: histórico de consultas...");
  await prisma.consultation.create({
    data: {
      userId: demoUser.id,
      medico: "Dr. Carlos Mendes",
      especialidade: "Cardiologista",
      local: "Hospital São Lucas",
      data: new Date("2025-10-10"),
      status: "realizada",
    },
  });
  await prisma.consultation.create({
    data: {
      userId: demoUser.id,
      medico: "Dra. Ana Souza",
      especialidade: "Clínica Geral",
      local: "UBS Vila Mariana",
      data: new Date("2025-08-20"),
      status: "realizada",
      diagnostico: "Infecção respiratória leve",
      observacoes: "Sintomas de coriza, tosse seca leve e febre baixa controlada. Repouso sugerido.",
      retorno: "Agendar retorno em 15 dias",
      prescricoes: {
        create: [
          { medicamento: "Amoxicilina 500mg", posologia: "Tomar de 8 em 8 horas por 7 dias" },
          { medicamento: "Dipirona 500mg", posologia: "Tomar de 6 em 6 horas se houver febre" },
        ],
      },
    },
  });
  await prisma.consultation.create({
    data: {
      userId: demoUser.id,
      medico: "Dr. Marcos Lima",
      especialidade: "Ortopedista",
      local: "Hospital Santa Casa",
      data: new Date("2025-03-15"),
      status: "realizada",
    },
  });

  console.log("Seed: próxima consulta agendada (Home > Próximas Consultas)...");
  const saoLucas = await prisma.establishment.findUniqueOrThrow({ where: { id: "hosp-sao-lucas" } });
  const proximaConsulta = new Date();
  proximaConsulta.setDate(proximaConsulta.getDate() + 14);
  await prisma.booking.create({
    data: {
      userId: demoUser.id,
      establishmentId: saoLucas.id,
      especialidade: "Cardiologista",
      data: proximaConsulta,
      horario: "14:00",
      medico: "Dr. Bruno Carvalho",
      medicoCrm: "CRM 54321",
      valor: "R$ 280",
      status: "confirmada",
    },
  });

  console.log("Seed: notificações...");
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        icon: "calendar",
        titulo: "Consulta amanhã às 10:00",
        descricao: "Dr. Carlos Mendes — Cardiologista",
        lida: false,
      },
      {
        userId: demoUser.id,
        icon: "medkit",
        titulo: "Hora do medicamento",
        descricao: "Hora de tomar Amoxicilina 500mg",
        lida: false,
      },
      {
        userId: demoUser.id,
        icon: "information-circle",
        titulo: "Dica de Saúde",
        descricao: "Dica: mantenha sua carteira de vacinação atualizada.",
        lida: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser.id,
        icon: "checkmark-circle",
        titulo: "Agendamento Confirmado",
        descricao: "Sua consulta foi agendada para 15 de Setembro.",
        lida: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log("Seed concluído. Login de demonstração: maria.silva@email.com / senha123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
