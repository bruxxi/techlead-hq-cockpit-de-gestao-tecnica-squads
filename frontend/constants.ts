import { 
  WeeklyChecklistItem, 
  SlideItem, 
  GuildTopic, 
  StakeholderRelationship, 
  SupportCadenceTask, 
  TrainingInitiative, 
  TeamEvent,
  ReminderTemplate
} from './types';

export const INITIAL_CHECKLIST: WeeklyChecklistItem[] = [
  {
    id: 'c1',
    category: 'slides',
    title: 'Montar pauta e slides da Weekly',
    description: 'Estruturar apresentador, repassar metas da sprint anterior e objetivos da nova semana.',
    completed: false,
    priority: 'alta',
    assignedRole: 'Tech Lead',
    targetDate: 'Toda Segunda 10:00'
  },
  {
    id: 'c2',
    category: 'cadence_mural',
    title: 'Cobrar cadeia de apoio para atualizar Mural e Publisher',
    description: 'Alinhar com PO e Agile Coach para atualizar dependências no Mural e status de releases no Publisher corporativo.',
    completed: false,
    priority: 'urgente',
    assignedRole: 'Cadeia de Apoio',
    targetDate: 'Segunda 14:00'
  },
  {
    id: 'c3',
    category: 'guilda_nudge',
    title: 'Incentivar devs a apresentarem nas Guildas',
    description: 'Convidar quem fez a última POC ou refatoração relevante para compartilhar conhecimento no comitê de Engenharia.',
    completed: true,
    priority: 'alta',
    assignedRole: 'Tech Lead'
  },
  {
    id: 'c4',
    category: 'initiatives',
    title: 'Divulgar novos treinamentos e iniciativas institucionais',
    description: 'Avisar o time sobre os vouchers de certificação Cloud e programa de mentoria interna.',
    completed: false,
    priority: 'media',
    assignedRole: 'Tech Lead'
  },
  {
    id: 'c5',
    category: 'stakeholder',
    title: 'Check-in com os Gestores de Pessoas (People Leads)',
    description: 'Passar visibilidade sobre performance técnica, engajamento e planos de 1:1 dos desenvolvedores.',
    completed: false,
    priority: 'alta',
    assignedRole: 'Tech Lead'
  },
  {
    id: 'c6',
    category: 'stakeholder',
    title: 'Alinhamento com o Cliente e Product Sponsor',
    description: 'Fortalecer a relação de confiança, repassar roadmap de mitigação de débitos técnicos e valor entregue.',
    completed: false,
    priority: 'alta',
    assignedRole: 'Tech Lead'
  },
  {
    id: 'c7',
    category: 'culture',
    title: 'Organizar próximo encontro presencial do time',
    description: 'Programar café/almoço técnico ou dia no escritório para fortalecer o entrosamento do time híbrido/remoto.',
    completed: false,
    priority: 'media',
    assignedRole: 'Tech Lead'
  }
];

export const INITIAL_SLIDES: SlideItem[] = [
  {
    id: 's1',
    order: 1,
    category: 'icebreaker',
    title: '1. Abertura & Quebra-Gelo do Time',
    bulletPoints: [
      'Como foi o fim de semana? Destaques pessoais ou indicações de séries/jogos.',
      'Check de energia da squad (1 a 5 no chat).'
    ],
    notes: 'Manter tom leve e acolhedor nos primeiros 5 minutos.'
  },
  {
    id: 's2',
    order: 2,
    category: 'goals',
    title: '2. Goals da Sprint & OKRs do Trimestre',
    bulletPoints: [
      'Entrega do MVP da nova API de pagamentos (90% concluído).',
      'Taxa de cobertura de testes unitários atingiu 82% (meta era 80%).',
      'Desafio da semana: Resolver gargalo de latência no microsserviço de Checkout.'
    ],
    notes: 'Parabenizar o time pela superação da meta de testes.'
  },
  {
    id: 's3',
    order: 3,
    category: 'initiatives',
    title: '3. Iniciativas da Empresa & Comunidade',
    bulletPoints: [
      'Migração corporativa para plataforma centralizada de observabilidade (Datadog).',
      'Campanha de Hackathon interno aberto para inscrições até sexta-feira.',
      'Programa de Diversidade & Inclusão em Tech.'
    ]
  },
  {
    id: 's4',
    order: 4,
    category: 'trainings',
    title: '4. Treinamentos Disponíveis & Upskilling',
    bulletPoints: [
      'Trilha de Arquitetura Orientada a Eventos na plataforma corporativa.',
      '10 vouchers para certificação AWS/GCP liberados para a squad.',
      'Workshop prático de Engenharia de Prompts na próxima quinta às 16h.'
    ]
  },
  {
    id: 's5',
    order: 5,
    category: 'guildas',
    title: '5. Espaço das Guildas - Compartilhe seu Conhecimento!',
    bulletPoints: [
      'Próxima Guilda Backend: Convite aberto para apresentar nossa solução de cache Redis.',
      'Falar em guilda conta positivamente na avaliação de carreira e visibilidade!',
      'Quem tiver interesse em qualquer tópico técnico, eu ajudo a estruturar os slides.'
    ],
    notes: 'Incentivar principalmente os devs juniores e plenos a perderem a timidez.'
  },
  {
    id: 's6',
    order: 6,
    category: 'shoutouts',
    title: '6. Reconhecimentos & Encontros Presenciais',
    bulletPoints: [
      'Kudos especiais para Marina pelo refactor que reduziu o tempo de build em 40%!',
      'Nosso almoço presencial / dia no escritório será dia 24/Outubro. Confirmem presença no convite!'
    ]
  }
];

export const INITIAL_GUILDS: GuildTopic[] = [
  {
    id: 'g1',
    title: 'Otimização de Queries SQL & Índices em Alta Escala',
    speaker: 'Lucas Silva (Pleno)',
    status: 'agendado',
    guildArea: 'Backend',
    dateScheduled: 'Próxima Terça, 15:00',
    incentiveNotes: 'Ele refinou a query do relatório financeiro semana passada; excelente caso real para compartilhar.'
  },
  {
    id: 'g2',
    title: 'Migrando Micro-frontends com Module Federation',
    speaker: 'Mariana Costa (Sênior)',
    status: 'concluido',
    guildArea: 'Frontend',
    dateScheduled: '12/Setembro',
    feedback: 'Mais de 45 pessoas assistiram! Feedback excelente da liderança de engenharia.'
  },
  {
    id: 'g3',
    title: 'Boas Práticas de Observabilidade com OpenTelemetry',
    speaker: 'Rafael Mendes (Júnior)',
    status: 'convidado',
    guildArea: 'DevOps & Cloud',
    incentiveNotes: 'Rafael implementou os primeiros traces. Ele está com receio de apresentar; marquei 15min para ensaiarmos juntos!'
  },
  {
    id: 'g4',
    title: 'Clean Architecture na Prática em Microsserviços',
    speaker: 'A definir (Candidatos: André ou Camila)',
    status: 'idea',
    guildArea: 'Arquitetura',
    incentiveNotes: 'Tópico de interesse levantado na última retrospectiva da squad.'
  }
];

export const INITIAL_STAKEHOLDERS: StakeholderRelationship[] = [
  {
    id: 'st1',
    name: 'Carlos Oliveira',
    role: 'Gestor de Pessoas',
    organization: 'Engenharia / People Hub',
    healthScore: 4,
    lastTouchpoint: 'Há 5 dias',
    actionItems: 'Enviar feedback de evolução do Rafael e alinhar promoção da Marina no ciclo semestral.',
    talkingPoints: [
      'Alinhamento do PDI (Plano de Desenvolvimento Individual)',
      'Clima e carga de trabalho da squad',
      'Feedbacks de entregas recentes'
    ],
    contactEmail: 'carlos.oliveira@empresa.com'
  },
  {
    id: 'st2',
    name: 'Patrícia Duarte',
    role: 'Cliente / Product Sponsor',
    organization: 'FinTech Parceira (Cliente Principal)',
    healthScore: 5,
    lastTouchpoint: 'Ontem',
    actionItems: 'Apresentar no comitê quinzenal a redução do débito técnico e como isso viabilizou o novo feature de PIX.',
    talkingPoints: [
      'Estabilidade do ambiente de produção (99.98% uptime)',
      'Previsibilidade das entregas da sprint',
      'Transparência sobre riscos de integração externa'
    ],
    contactEmail: 'patricia@cliente.com'
  },
  {
    id: 'st3',
    name: 'Felipe Rocha',
    role: 'Dev Squad',
    organization: 'Squad Checkout & Pagamentos',
    healthScore: 4,
    lastTouchpoint: 'Esta semana',
    actionItems: '1:1 técnico agendado para desatar nó da arquitetura de mensageria Kafka.',
    talkingPoints: [
      'Apoio técnico no épico atual',
      'Incentivo para apresentar na Guilda de Backend',
      'Equilíbrio entre trabalho e qualidade de código'
    ]
  },
  {
    id: 'st4',
    name: 'Juliana Prado',
    role: 'Cadeia de Apoio',
    organization: 'Agile Management Office',
    healthScore: 3,
    lastTouchpoint: 'Há 1 semana',
    actionItems: 'Cobrar preenchimento do Mural com as histórias do próximo trimestre e atualização do Publisher corporativo.',
    talkingPoints: [
      'Fluxo de upstream e downstream das histórias',
      'Sincronização de métricas de vazão (throughput)',
      'Garantir visibilidade para os executivos'
    ]
  }
];

export const INITIAL_CADENCE_TASKS: SupportCadenceTask[] = [
  {
    id: 'cad1',
    tool: 'Mural',
    responsibleName: 'Juliana Prado',
    role: 'Scrum Master / Agile Coach',
    status: 'pendente',
    lastUpdated: '12 dias atrás',
    notes: 'Atualizar dependências de arquitetura cross-squad e matriz de riscos do Q4.',
    contactHandle: '@juliana.prado',
    boardUrl: 'https://mural.co/squad-checkout-roadmap'
  },
  {
    id: 'cad2',
    tool: 'Publisher',
    responsibleName: 'Thiago Mendes',
    role: 'Product Owner',
    status: 'em_andamento',
    lastUpdated: 'Ontem',
    notes: 'Publicar release notes da versão v2.4 e links de homologação para o cliente.',
    contactHandle: '@thiago.mendes',
    boardUrl: 'https://publisher.corp.internal/releases/v2-4'
  },
  {
    id: 'cad3',
    tool: 'Mural',
    responsibleName: 'Larissa Rocha',
    role: 'Cadeia de Apoio',
    status: 'pendente',
    lastUpdated: '14 dias atrás',
    notes: 'Mapear upstream de infraestrutura Cloud e esteira de testes de carga.',
    contactHandle: '@larissa.rocha'
  },
  {
    id: 'cad4',
    tool: 'Publisher',
    responsibleName: 'Carlos Delivery',
    role: 'Product Owner',
    status: 'atualizado',
    lastUpdated: 'Hoje às 09:30',
    notes: 'Changelog da API de liquidação instantânea devidamente sincronizado.',
    contactHandle: '@carlos.delivery'
  },
  {
    id: 'cad5',
    tool: 'Jira / Board',
    responsibleName: 'Squad Checkout',
    role: 'Tech Lead',
    status: 'atualizado',
    lastUpdated: 'Hoje',
    notes: 'Sprint corrente com apontamentos e estimativas revisadas.',
    contactHandle: '@techlead'
  }
];

export const DEFAULT_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'rem_slack_friendly',
    name: 'Slack Amigável (Lembrete Semanal)',
    tone: 'amigavel_slack',
    message: 'Oi {nome}! Tudo bem? Passando rapidinho para lembrar de dar uma checada no {ferramenta} antes da nossa Weekly. Precisamos deixar atualizado o item: "{detalhes}". Se precisar de apoio técnico ou alinhamento, só me avisar! Valeu demais!'
  },
  {
    id: 'rem_pre_weekly',
    name: 'Alinhamento Pré-Weekly (Mural & Publisher)',
    tone: 'amigavel_slack',
    message: 'Fala {nome}! Estamos montando os slides da Weekly de hoje. Notamos que o {ferramenta} consta como desatualizado ({dias}). Consegue dar um refresh em: "{detalhes}" para darmos a visibilidade correta ao cliente e diretoria? Muito obrigado!'
  },
  {
    id: 'rem_release_urgent',
    name: 'Urgente: Bloqueio de Release & Auditoria',
    tone: 'urgente_release',
    subject: 'URGENTE: Atualização obrigatória no {ferramenta} da Squad',
    message: 'Prezado(a) {nome}, identificamos que a documentação oficial no {ferramenta} está pendente ({detalhes}). Como a release está prevista no roadmap, precisamos dessa atualização para garantir conformidade e mitigar riscos com o cliente. Poderia confirmar a atualização até o fim do dia de hoje?'
  }
];

export const INITIAL_TRAININGS: TrainingInitiative[] = [
  {
    id: 'tr1',
    type: 'treinamento',
    title: 'Formação em Arquitetura Serverless & Resiliência',
    description: 'Curso oficial com laboratórios práticos de AWS Lambda, SQS e DLQ.',
    targetAudience: 'Desenvolvedores Plenos e Seniores',
    deadline: 'Vagas abertas até o fim do mês',
    linkOrRef: 'portal.treinamentos.empresa/serverless-2025',
    status: 'ativo'
  },
  {
    id: 'tr2',
    type: 'iniciativa_empresa',
    title: 'Migração de Segurança: Zero Trust & Rotação de Segredos',
    description: 'Normativa de segurança corporativa exigindo migração para o HashiCorp Vault em todas as squads.',
    targetAudience: 'Toda a Squad',
    deadline: 'Conclusão até o meio do trimestre',
    status: 'em_divulgacao'
  },
  {
    id: 'tr3',
    type: 'meta_squad',
    title: 'Meta de Engenharia: Redução de 50% em Falhas em Prod',
    description: 'Adoção de Canary deployments e testes de mutação automatizados no pipeline CI/CD.',
    targetAudience: 'Squad Checkout & Time de QA',
    deadline: 'Q4 Goal',
    status: 'ativo'
  }
];

export const INITIAL_EVENTS: TeamEvent[] = [
  {
    id: 'ev1',
    title: 'Almoço de Integração & Boas-Vindas aos Novos Devs',
    type: 'presencial_almoco',
    date: '2025-10-24T12:30',
    location: 'Restaurante Varanda Gourmet',
    locationDetails: 'Av. Paulista, 1100 - Próximo à estação Trianon-Masp',
    budgetPerPerson: 95,
    totalEstimatedBudget: 760,
    budgetApproved: true,
    agendaSummary: 'Celebração informal da entrega da API de pagamentos, quebra-gelo presencial e bate-papo descontraído com o time.',
    status: 'confirmado',
    schedule: [
      { time: '12:30', title: 'Ponto de encontro', description: 'Reunir no lobby do prédio ou restaurante' },
      { time: '13:00', title: 'Almoço & Brinde', description: 'Comemoração dos resultados da sprint' },
      { time: '14:30', title: 'Café & Troca de experiências', description: 'Papo leve sobre planos de carreira e vida pessoal' }
    ],
    rsvps: [
      { id: 'r1', name: 'Marina Costa', role: 'Dev Sênior', status: 'confirmado', dietaryNotes: 'Vegetariana' },
      { id: 'r2', name: 'Lucas Silva', role: 'Dev Pleno', status: 'confirmado' },
      { id: 'r3', name: 'Rafael Mendes', role: 'Dev Júnior', status: 'confirmado' },
      { id: 'r4', name: 'Juliana Prado', role: 'Scrum Master', status: 'confirmado' },
      { id: 'r5', name: 'Thiago Mendes', role: 'Product Owner', status: 'pendente' },
      { id: 'r6', name: 'Camila Pires', role: 'QA Engineer', status: 'confirmado' },
      { id: 'r7', name: 'André Farias', role: 'Dev Backend', status: 'confirmado' },
      { id: 'r8', name: 'Você (Tech Lead)', role: 'Tech Lead', status: 'confirmado' }
    ]
  },
  {
    id: 'ev2',
    title: 'Team Day no Escritório + Retrospectiva Técnica',
    type: 'team_day',
    date: '2025-11-05T09:30',
    location: 'Sede Central - Sala de Inovação 3B',
    locationDetails: 'Andar 8, Torre Sul - Estacionamento conveniado no local',
    budgetPerPerson: 60,
    totalEstimatedBudget: 480,
    budgetApproved: true,
    agendaSummary: 'Dia de imersão presencial: alinhamento de dívidas técnicas da squad, retrospectiva semestral com dinâmicas visuais e pair programming.',
    status: 'planejado',
    schedule: [
      { time: '09:30', title: 'Café de boas-vindas & Setup', description: 'Café da manhã na sala e alinhamento dos objetivos' },
      { time: '10:15', title: 'Retrospectiva Técnica', description: 'Mapeamento no quadro de dívidas técnicas e gargalos de CI/CD' },
      { time: '12:30', title: 'Almoço em equipe', description: 'Praça de alimentação do centro corporativo' },
      { time: '14:00', title: 'Hands-on Pair Programming', description: 'Refatoração da camada de cache e observabilidade' },
      { time: '16:30', title: 'Wrap-up & Happy Hour', description: 'Encerramento com feedbacks mútuos' }
    ],
    rsvps: [
      { id: 'r1', name: 'Marina Costa', role: 'Dev Sênior', status: 'confirmado' },
      { id: 'r2', name: 'Lucas Silva', role: 'Dev Pleno', status: 'confirmado' },
      { id: 'r3', name: 'Rafael Mendes', role: 'Dev Júnior', status: 'pendente' },
      { id: 'r4', name: 'Juliana Prado', role: 'Scrum Master', status: 'confirmado' },
      { id: 'r5', name: 'Camila Pires', role: 'QA Engineer', status: 'confirmado' },
      { id: 'r6', name: 'André Farias', role: 'Dev Backend', status: 'pendente' },
      { id: 'r7', name: 'Você (Tech Lead)', role: 'Tech Lead', status: 'confirmado' }
    ]
  }
];
