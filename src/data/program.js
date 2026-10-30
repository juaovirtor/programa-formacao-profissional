/**
 * Conteúdo do Programa de Formação Profissional.
 * Centralizado aqui para facilitar edições sem mexer nos componentes.
 *
 * Regra do site: nada de informação inventada. Onde ainda falta material real
 * (fotos, convidados, datas, certificado, termo), a lista fica vazia ou o
 * campo fica `null` — e a seção correspondente não aparece no site publicado.
 * Em desenvolvimento, os espaços aparecem marcados para facilitar a revisão
 * (ver src/lib/espacos.js).
 */

/**
 * Estrutura das marcas:
 * - Group Phoenix é o dono do projeto e da ideia (realização).
 * - Visual Software é a parceira do programa.
 * - A Prefeitura Municipal dá apoio exclusivamente institucional.
 */
export const marca = {
  grupo: "Group Phoenix",
  parceira: "Visual Software",
  programa: "Programa de Formação Profissional",
};

export const nav = [
  { label: "O programa", href: "#historia" },
  { label: "Formação", href: "#formacao" },
  { label: "Primeira turma", href: "#turma" },
  { label: "Transparência", href: "#transparencia" },
];

/* ------------------------------------------------------------------ */
/* 01 — Apresentação                                                   */
/* ------------------------------------------------------------------ */

export const hero = {
  selo: "Group Phoenix · em parceria com a Visual Software",
  titulo: "Mais do que preparar profissionais,",
  destaque: "desenvolvemos pessoas.",
  texto:
    "Uma iniciativa que conecta conhecimento, comunicação e desenvolvimento humano para preparar jovens para os desafios e oportunidades do mercado de trabalho.",
  destaques: ["Formação gratuita", "Sem fins lucrativos", "Desenvolvimento pessoal e profissional"],
};

/** Faixa logo abaixo da apresentação. Só fatos confirmados. */
export const fatos = [
  { valor: "R$ 0", texto: "sem mensalidade ou taxa", destaque: true },
  { valor: "4 semanas", texto: "3 dias por semana" },
  { valor: "Presencial", texto: "em Reserva - PR" },
  { valor: "Certificado", texto: "de participação ao concluir" },
];

/* ------------------------------------------------------------------ */
/* 02 — Nossa história                                                 */
/* ------------------------------------------------------------------ */

export const historia = {
  titulo: "Nasceu de quem contrata",
  destaque: "e sentia falta de algo.",
  paragrafos: [
    "Empresários da região percebiam a mesma coisa: jovens com vontade de trabalhar, mas ainda sem as habilidades que fazem diferença no dia a dia — comunicação, postura, relacionamento, responsabilidade e trabalho em equipe.",
    "Dessa percepção, o Group Phoenix idealizou o Programa de Formação Profissional e convidou a Visual Software como parceira. A primeira turma já aconteceu. Agora, o programa se prepara para as próximas edições.",
  ],
  // `data: null` = ainda não informada. O marco aparece sem data, nunca com uma inventada.
  marcos: [
    { data: null, titulo: "A ideia", texto: "A percepção dos empresários sobre o mercado de trabalho." },
    { data: null, titulo: "A parceria", texto: "Group Phoenix e Visual Software juntos no projeto." },
    { data: null, titulo: "Primeira turma", texto: "Aulas, convidados e entrega de certificados." },
    { data: "Agora", titulo: "Próximas edições", texto: "Inscrições abertas para a nova turma." },
  ],
};

/* ------------------------------------------------------------------ */
/* 03 — Muito além da tecnologia                                       */
/* ------------------------------------------------------------------ */

export const formacao = {
  titulo: "Muito além da",
  destaque: "tecnologia.",
  frase: "Conhecimento abre portas. Comunicação e relacionamento constroem caminhos.",
  // Os dois primeiros são os pilares principais e ganham destaque visual.
  pilares: [
    {
      titulo: "Comunicação",
      texto:
        "Aprender a se expressar, apresentar ideias, conversar, argumentar e se posicionar de maneira adequada em diferentes situações.",
      cor: "violet",
      foto: "comunicacao",
    },
    {
      titulo: "Relacionamento interpessoal",
      texto:
        "Desenvolver empatia, respeito, convivência, inteligência emocional e capacidade de lidar com diferentes perfis de pessoas.",
      cor: "blue",
      foto: "relacionamento",
    },
    {
      titulo: "Desenvolvimento profissional",
      texto: "Mercado de trabalho, postura profissional, responsabilidade, organização e visão de carreira.",
    },
    {
      titulo: "Liderança e colaboração",
      texto: "Liderar, saber ser liderado, trabalhar em equipe, assumir responsabilidades e ganhar autonomia.",
    },
    {
      titulo: "Negócios e vendas",
      texto: "Abordagem comercial, negociação, relacionamento com clientes e visão de negócios.",
    },
    {
      titulo: "Tecnologia e inovação",
      texto: "Ferramentas digitais, sistemas de gestão e as transformações que impactam o mercado de trabalho.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 05 — Convidados                                                     */
/* ------------------------------------------------------------------ */

/**
 * Cada convidado: { foto, nome, cargo, empresa, segmento, apresentacao, tema }.
 * Lista vazia até recebermos os dados reais — a seção fica oculta no site.
 */
export const convidados = [];

/** Segmentos representados pelos convidados. Vazio até termos os dados. */
export const segmentos = [];

/* ------------------------------------------------------------------ */
/* 06 — Primeira turma / 07 — Certificação                             */
/* ------------------------------------------------------------------ */

export const primeiraTurma = {
  titulo: "Um projeto que",
  destaque: "já aconteceu.",
  texto:
    "Encontros, convidados, atividades em grupo e, no fim, a entrega dos certificados. A primeira edição mostrou que dá para desenvolver pessoas — e é dela que nasce a próxima.",
  // Depoimentos reais, só com autorização: { texto, nome, papel }.
  depoimentos: [],
};

export const certificado = {
  titulo: "Cada etapa de aprendizado é uma",
  destaque: "conquista.",
  texto:
    "Ao concluir o programa, os participantes recebem um certificado de participação, conforme os critérios de conclusão estabelecidos pela organização.",
  // Imagem real do certificado exemplo. Enquanto for null, o site mostra uma
  // moldura genérica marcada como "imagem ilustrativa".
  imagem: null,
};

/* ------------------------------------------------------------------ */
/* 08 — Inscrição                                                      */
/* ------------------------------------------------------------------ */

export const inscricao = {
  aberta: true,
  titulo: "Sua próxima oportunidade começa com uma",
  destaque: "escolha.",
  texto:
    "Para jovens que desejam desenvolver suas habilidades, ampliar seus conhecimentos e se preparar para os desafios do mercado de trabalho. Os participantes de melhor desempenho podem ter a oportunidade de integrar a equipe.",
  info: [
    { label: "Duração", valor: "4 semanas · 3 dias por semana" },
    { label: "Formato", valor: "Presencial · Reserva - PR" },
    { label: "Investimento", valor: "R$ 0 · sem taxas ou mensalidades", destaque: true },
    { label: "Ao final", valor: "Certificado de participação" },
  ],
};

/* ------------------------------------------------------------------ */
/* 09 — Instagram / 10 — Gratuidade / 11 — Transparência               */
/* ------------------------------------------------------------------ */

export const instagram = {
  perfil: "@groupphoenix.formacao",
  url: "https://www.instagram.com/groupphoenix.formacao/",
  titulo: "A formação também acontece",
  destaque: "fora da sala.",
  texto: "Registros, convidados, atividades, novidades e tudo o que acontece no Programa de Formação Profissional.",
  // Posts escolhidos à mão: { imagem, alt, url }. Sem API paga nem login.
  posts: [],
};

export const compromisso = {
  titulo: "Oportunidade não deve ter",
  destaque: "preço.",
  paragrafos: [
    "O Programa de Formação Profissional é uma iniciativa sem fins lucrativos. Acreditamos que compartilhar conhecimento, desenvolver habilidades e proporcionar oportunidades pode transformar trajetórias.",
    "Por isso, a formação é totalmente gratuita: não existem mensalidades, taxas de inscrição, valores por aula ou pela certificação.",
  ],
  fecho: "Nosso compromisso é com as pessoas, com o desenvolvimento profissional e com a comunidade.",
};

export const transparencia = {
  texto:
    "O programa conta com apoio institucional da Prefeitura Municipal, por meio da Secretaria de Agricultura e Desenvolvimento Econômico, com disponibilização de espaços para as atividades. A colaboração é exclusivamente institucional, formalizada por termo assinado, e não envolve repasses de recursos financeiros municipais.",
  organizacoes: [
    {
      papel: "Realização",
      nome: "Group Phoenix",
      logo: "/assets/logo-grupo-phoenix.webp",
      texto: "Idealizador e responsável pelo programa.",
    },
    {
      papel: "Parceria",
      nome: "Visual Software",
      logo: "/assets/logo-visual-software.webp",
      texto:
        "A Visual Software soma mais de 25 anos de mercado, mais de 800 cidades e mais de 4.000 clientes atendidos, com operação em 2 países.",
    },
    {
      papel: "Apoio institucional",
      nome: "Prefeitura Municipal",
      logo: null,
      texto: "Secretaria de Agricultura e Desenvolvimento Econômico · espaços e apoio institucional.",
    },
  ],
  // Termo de parceria em PDF. Só vai para o site com autorização expressa:
  // enquanto `publicado` for false, o botão não aparece.
  termo: { publicado: false, arquivo: null },
};

/** Crédito de desenvolvimento no rodapé. */
export const credito = {
  nome: "North Creative Market",
  perfil: "@northcreativemarketing",
  url: "https://www.instagram.com/northcreativemarketing/",
};

export const originOptions = [
  "Instagram",
  "Facebook",
  "WhatsApp",
  "Escola",
  "Indicação de amigo",
  "Site",
  "Outro",
];

export const contact = {
  whatsapp: "(42) 9 9978-7068",
  whatsappHref: "https://wa.me/5542999787068",
  instagram: "@groupphoenix.formacao",
  instagramHref: "https://www.instagram.com/groupphoenix.formacao/",
};

/**
 * Aviso de privacidade (LGPD — Lei 13.709/2018).
 * Editar aqui reflete no resumo do formulário e no aviso completo.
 */
export const privacidade = {
  resumoCurto:
    "Seus dados são usados apenas para avaliar e selecionar os participantes deste programa. Não são vendidos, compartilhados nem reproduzidos.",
  aceite:
    "Li o Aviso de Privacidade e autorizo o Group Phoenix a usar meus dados exclusivamente para a avaliação e a seleção do Programa de Formação Profissional. Se eu tiver menos de 18 anos, confirmo que meus responsáveis estão de acordo.",
  atualizadoEm: "Agosto de 2026",
  blocos: [
    {
      titulo: "Quem cuida dos seus dados",
      texto:
        "O Group Phoenix, por meio da Visual Software & Informática, sediada em Reserva - PR, é o responsável (controlador) pelos dados enviados neste formulário. O tratamento segue a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).",
    },
    {
      titulo: "O que coletamos",
      texto:
        "Nome completo, telefone/WhatsApp, e-mail e como você conheceu o programa. Foto e currículo em PDF são opcionais e só são guardados se você enviar. Nada além disso é solicitado.",
    },
    {
      titulo: "Para que usamos",
      texto:
        "Exclusivamente para avaliar e selecionar os participantes do Programa de Formação Profissional e para entrar em contato com você sobre esse processo. Não usamos seus dados para publicidade, não os vendemos, não os compartilhamos com terceiros e não reproduzimos, publicamos ou divulgamos seu currículo ou sua foto em nenhum canal.",
    },
    {
      titulo: "Base legal",
      texto:
        "O tratamento acontece com o seu consentimento (art. 7º, I da LGPD), dado no momento em que você marca a caixa de aceite antes de enviar a inscrição.",
    },
    {
      titulo: "Como avaliamos",
      texto:
        "A leitura dos currículos e a seleção dos participantes são feitas por pessoas da nossa equipe. Você pode pedir explicações sobre a avaliação da sua inscrição a qualquer momento.",
    },
    {
      titulo: "Menores de 18 anos",
      texto:
        "Se você tem menos de 18 anos, a inscrição deve ser feita com o conhecimento e a concordância dos seus pais ou responsáveis, que podem solicitar acesso ou exclusão dos dados a qualquer momento.",
    },
    {
      titulo: "Quem tem acesso e por quanto tempo",
      texto:
        "Apenas a equipe do Group Phoenix envolvida na seleção, por meio de um painel restrito e protegido por senha. Guardamos os dados pelo tempo necessário ao processo seletivo e a eventuais novas turmas do programa; depois disso, são eliminados.",
    },
    {
      titulo: "Seus direitos",
      texto:
        "A qualquer momento você pode pedir para ver, corrigir ou apagar seus dados, além de retirar o consentimento. É só falar com a gente pelo WhatsApp (42) 9 9978-7068 — o pedido é atendido sem custo.",
    },
  ],
};
