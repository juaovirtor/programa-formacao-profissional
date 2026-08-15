/**
 * Conteúdo do Programa de Formação Profissional.
 * Centralizado aqui para facilitar edições sem mexer nos componentes.
 */

/**
 * Estrutura das marcas:
 * - Group Phoenix é o grupo de empresas que realiza o programa (marca do site).
 * - Visual Software & Informática é a empresa do grupo que conduz a iniciativa,
 *   revenda autorizada do software da Visual Software (matriz em Quedas do Iguaçu).
 */
export const marca = {
  grupo: "Group Phoenix",
  empresa: "Visual Software & Informática",
  matriz: "Visual Software",
  matrizCidade: "Quedas do Iguaçu",
  descricaoRevenda:
    "Revenda autorizada do software da Visual Software, com matriz em Quedas do Iguaçu.",
};

/** Números da trajetória da Visual Software — passam solidez ao candidato. */
export const experiencia = {
  titulo: "Você aprende com quem já está no mercado.",
  texto:
    "A Visual Software & Informática faz parte do Group Phoenix e é revenda autorizada do software da Visual Software, que atende empresas de todos os portes há mais de duas décadas. É essa vivência real de mercado que você vai encontrar no programa.",
  numeros: [
    { valor: "+25", unidade: "anos", label: "de experiência no mercado" },
    { valor: "+800", unidade: "cidades", label: "atendidas" },
    { valor: "+4.000", unidade: "", label: "clientes atendidos" },
    { valor: "2", unidade: "países", label: "com operação" },
  ],
};

/** Mensagem de acolhimento — todo mundo pode se inscrever. */
export const inclusao = {
  titulo: "Aqui, todo mundo tem espaço.",
  texto:
    "Você não precisa saber nada de tecnologia para começar. Não pedimos experiência anterior, curso técnico nem faculdade. O que conta é a vontade de aprender e o compromisso com as 4 semanas de formação.",
  itens: [
    "Nunca trabalhou antes? Sem problema — o programa foi feito exatamente para isso.",
    "Não sabe mexer em computador além do básico? A gente começa do começo.",
    "Está terminando o Ensino Médio, já terminou ou parou os estudos? Todos podem se inscrever.",
    "Tímido, comunicativo, do centro ou do interior do município: a porta é a mesma para todo mundo.",
  ],
  observacao:
    "As vagas são limitadas e passam por seleção, mas o convite para se inscrever é para todo mundo.",
};

export const nav = [
  { label: "O Programa", href: "#programa" },
  { label: "O que você vai aprender", href: "#aprender" },
  { label: "Inscrição", href: "#inscricao" },
];

// `long: true` reduz o corpo do número quando o valor é uma palavra comprida,
// para não estourar a largura da célula no mobile.
export const highlights = [
  { value: "4", unit: "semanas", label: "Treinamento intensivo" },
  { value: "100%", unit: "prático", label: "Aprendizado aplicado" },
  { value: "Certificação", unit: "", label: "Ao final do programa", long: true },
  { value: "R$ 0", unit: "", label: "Participação gratuita" },
];

export const modules = [
  {
    number: "01",
    icon: "MessageSquare",
    title: "Comunicação",
    accent: "violet",
    topics: ["Atendimento ao cliente", "Comunicação eficaz", "Postura profissional"],
  },
  {
    number: "02",
    icon: "Briefcase",
    title: "Mercado de trabalho",
    accent: "blue",
    topics: ["Currículo", "Primeiro emprego", "Rotina e responsabilidades", "Trabalho em equipe"],
  },
  {
    number: "03",
    icon: "Handshake",
    title: "Comercial",
    accent: "violet",
    topics: ["Relacionamento com clientes", "Negociação básica", "Prospecção"],
  },
  {
    number: "04",
    icon: "MonitorCog",
    title: "Suporte e sistemas",
    accent: "blue",
    topics: [
      "Sistemas de gestão (ERP)",
      "Suporte técnico",
      "Diagnóstico de problemas",
      "Solução de problemas",
    ],
  },
  {
    number: "05",
    icon: "Cpu",
    title: "Hardware e software",
    accent: "lime",
    topics: ["Noções de hardware", "Instalação e configuração", "Sistemas e aplicativos", "Redes"],
  },
  {
    number: "06",
    icon: "FileText",
    title: "Fiscal",
    accent: "blue",
    topics: ["Emissão de NF-e", "Emissão de NFC-e", "Noções fiscais", "Reforma tributária"],
  },
];

export const softSkills = [
  { icon: "MessagesSquare", label: "Comunicação" },
  { icon: "ListChecks", label: "Organização" },
  { icon: "Scale", label: "Ética profissional" },
  { icon: "ShieldCheck", label: "Responsabilidade" },
  { icon: "Users", label: "Trabalho em equipe" },
  { icon: "Lightbulb", label: "Resolução de problemas" },
  { icon: "UserCheck", label: "Postura profissional" },
  { icon: "Building2", label: "Rotina empresarial" },
];

export const reasons = [
  {
    icon: "Wrench",
    title: "Aprenda na prática",
    text: "Tenha contato com situações e conhecimentos utilizados no dia a dia de empresas reais.",
  },
  {
    icon: "Sparkles",
    title: "Desenvolva habilidades",
    text: "Aprenda não apenas tecnologia, mas também comunicação, organização e postura profissional.",
  },
  {
    icon: "LayoutGrid",
    title: "Conheça diferentes áreas",
    text: "Tenha contato com tecnologia, suporte, comercial, fiscal, hardware e sistemas de gestão.",
  },
  {
    icon: "TrendingUp",
    title: "Construa experiência",
    text: "Desenvolva conhecimentos que podem fazer diferença no início da sua carreira.",
  },
  {
    icon: "Award",
    title: "Certifique-se",
    text: "Receba certificação ao concluir o programa.",
  },
  {
    icon: "Rocket",
    title: "Novas oportunidades",
    text: "Os participantes de melhor desempenho poderão ter a oportunidade de fazer parte da equipe da Visual Software & Informática.",
  },
];

export const steps = [
  { number: "01", title: "Inscrição", text: "Preencha o formulário com seus dados, foto e currículo." },
  { number: "02", title: "Avaliação das inscrições", text: "Nosso time analisa todas as inscrições recebidas." },
  { number: "03", title: "Seleção dos participantes", text: "As vagas são confirmadas e os selecionados são avisados." },
  { number: "04", title: "4 semanas de formação", text: "Treinamento presencial, intensivo e 100% prático." },
  { number: "05", title: "Certificação", text: "Certificado de conclusão do programa." },
  { number: "06", title: "Possibilidade de novas oportunidades", text: "Os melhores desempenhos podem ser convidados a integrar a equipe." },
];

export const programInfo = [
  { icon: "CalendarDays", label: "Duração", value: "4 semanas" },
  { icon: "Building2", label: "Modalidade", value: "Presencial" },
  { icon: "MapPin", label: "Local", value: "Reserva · PR" },
  { icon: "Wallet", label: "Investimento", value: "R$ 0", accent: true },
  { icon: "BadgeCheck", label: "Certificação", value: "Sim" },
  { icon: "Clock", label: "Início", value: "Em breve" },
  {
    icon: "Users",
    label: "Público",
    value: "Jovens interessados em tecnologia e desenvolvimento profissional",
    wide: true,
  },
];

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
  instagram: "@gp.visualsoftware",
  instagramHref: "https://instagram.com/gp.visualsoftware",
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
        "Nome completo, telefone/WhatsApp, e-mail, foto, currículo em PDF e como você conheceu o programa. Nada além disso é solicitado.",
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

export const local = {
  cidade: "Reserva",
  estado: "PR",
  titulo: "Inovação que nasce em Reserva.",
  texto:
    "O Group Phoenix acredita na inovação dentro do próprio município. Por meio da Visual Software & Informática, este programa existe para que o jovem de Reserva encontre aqui, na sua cidade, a formação e a oportunidade de começar uma carreira em tecnologia.",
  pilares: [
    {
      icon: "MapPin",
      title: "Feito aqui",
      text: "Formação presencial em Reserva, para quem é de Reserva e região.",
    },
    {
      icon: "Lightbulb",
      title: "Inovação local",
      text: "Tecnologia, sistemas de gestão e soluções que atendem empresas da região.",
    },
    {
      icon: "Users",
      title: "Talento da cidade",
      text: "Investir nos jovens daqui é investir no futuro do nosso município.",
    },
  ],
};
