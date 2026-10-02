export type TabType = 
  | 'cockpit'
  | 'agenda_builder'
  | 'weekly_slides'
  | 'guildas'
  | 'mural_cadence'
  | 'stakeholders'
  | 'initiatives_trainings'
  | 'events';

export interface WeeklyChecklistItem {
  id: string;
  category: 'weekly_prep' | 'slides' | 'initiatives' | 'cadence_mural' | 'guilda_nudge' | 'stakeholder' | 'culture';
  title: string;
  description: string;
  completed: boolean;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  targetDate?: string;
  assignedRole?: string;
}

export interface SlideItem {
  id: string;
  order: number;
  title: string;
  category: 'icebreaker' | 'goals' | 'initiatives' | 'trainings' | 'guildas' | 'shoutouts' | 'open_floor';
  bulletPoints: string[];
  notes?: string;
}

export interface GuildTopic {
  id: string;
  title: string;
  speaker: string;
  status: 'idea' | 'convidado' | 'agendado' | 'concluido';
  guildArea: 'Frontend' | 'Backend' | 'DevOps & Cloud' | 'Arquitetura' | 'QA & Testes' | 'Mobile' | 'Soft Skills';
  dateScheduled?: string;
  incentiveNotes?: string;
  feedback?: string;
}

export interface StakeholderRelationship {
  id: string;
  name: string;
  role: 'Dev Squad' | 'Gestor de Pessoas' | 'Cliente / Product Sponsor' | 'Gerente de Contas' | 'Cadeia de Apoio';
  organization: string;
  healthScore: number;
  lastTouchpoint: string;
  actionItems: string;
  talkingPoints: string[];
  contactEmail?: string;
}

export interface SupportCadenceTask {
  id: string;
  tool: 'Mural' | 'Publisher' | 'Jira / Board' | 'Confluence / Doc' | 'Release Radar';
  responsibleName: string;
  role: 'Product Owner' | 'Scrum Master / Agile Coach' | 'Tech Lead' | 'Cadeia de Apoio' | 'Dev';
  status: 'pendente' | 'em_andamento' | 'atualizado';
  lastUpdated: string;
  notes: string;
  contactHandle?: string;
  boardUrl?: string;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  tone: 'amigavel_slack' | 'formal_email' | 'urgente_release';
  subject?: string;
  message: string;
}

export interface SquadMemberRSVP {
  id: string;
  name: string;
  role: string;
  status: 'confirmado' | 'pendente' | 'recusado';
  dietaryNotes?: string;
}

export interface EventAgendaScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface TeamEvent {
  id: string;
  title: string;
  type: 'presencial_almoco' | 'team_day' | 'retro_presencial' | 'hack_day' | 'coffee_break';
  date: string;
  location: string;
  locationDetails?: string;
  budgetPerPerson?: number;
  totalEstimatedBudget?: number;
  budgetApproved?: boolean;
  agendaSummary: string;
  schedule: EventAgendaScheduleItem[];
  rsvps: SquadMemberRSVP[];
  status: 'planejado' | 'confirmado' | 'realizado';
}

export interface AgendaTopicOption {
  id: string;
  label: string;
  category: SlideItem['category'];
  defaultDurationMin: number;
  description: string;
  selected: boolean;
  customDetails?: string;
}

export interface GeneratedAgenda {
  title: string;
  totalDurationMin: number;
  markdownSummary: string;
  slides: SlideItem[];
  generatedAt: string;
}
