import React, { useState } from 'react';
import { 
  AgendaTopicOption, 
  SlideItem, 
  GuildTopic, 
  TrainingInitiative, 
  SupportCadenceTask, 
  TeamEvent, 
  TabType 
} from '../types';
import { 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  Clock, 
  Presentation, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  Circle, 
  SlidersHorizontal, 
  ArrowRight,
  Flame,
  Award,
  BookOpen,
  KanbanSquare,
  Users,
  CalendarDays,
  FileText
} from 'lucide-react';
import { generateCustomWeeklyAgendaAI } from '../services/geminiService';

interface WeeklyAgendaBuilderProps {
  guilds: GuildTopic[];
  trainings: TrainingInitiative[];
  cadenceTasks: SupportCadenceTask[];
  events: TeamEvent[];
  onApplyGeneratedSlides: (slides: SlideItem[]) => void;
  setActiveTab: (tab: TabType) => void;
}

const DEFAULT_TOPICS: AgendaTopicOption[] = [
  {
    id: 'top_icebreaker',
    label: 'Check-in de Energia & Quebra-Gelo',
    category: 'icebreaker',
    defaultDurationMin: 5,
    description: 'Como foi a semana, notas de 1 a 5 de bem-estar e conexões interpessoais.',
    selected: true,
    customDetails: 'Check rápido de energia do time antes de entrar em tópicos pesados.'
  },
  {
    id: 'top_goals',
    label: 'Metas da Sprint, Entregas & OKRs',
    category: 'goals',
    defaultDurationMin: 15,
    description: 'Revisar status de valor entregue, PRs críticas aprovadas e metas do trimestre.',
    selected: true,
    customDetails: 'Focar na entrega da API de pagamentos e na redução da dívida técnica.'
  },
  {
    id: 'top_guildas',
    label: 'Incentivo a Guildas & Compartilhamento',
    category: 'guildas',
    defaultDurationMin: 10,
    description: 'Convidar devs a exporem POCs e soluções técnicas para a engenharia da empresa.',
    selected: true,
    customDetails: 'Dar parabéns a quem apresentou e incentivar os devs plenos/juniores.'
  },
  {
    id: 'top_trainings',
    label: 'Treinamentos Corporativos & Upskilling',
    category: 'trainings',
    defaultDurationMin: 5,
    description: 'Vouchers de certificação, trilhas abertas e workshops técnicos recomendados.',
    selected: true,
    customDetails: 'Lembrar dos vouchers de AWS/GCP e do workshop de IA generativa.'
  },
  {
    id: 'top_mural',
    label: 'Cadeia de Apoio: Mural & Publisher',
    category: 'initiatives',
    defaultDurationMin: 5,
    description: 'Cobrar PO e Scrum Master sobre atualização de roadmap visual e release notes.',
    selected: true,
    customDetails: 'Verificar se o Mural do Q4 está sincronizado e se o Publisher de releases está em dia.'
  },
  {
    id: 'top_stakeholders',
    label: 'Alinhamento com Cliente & Gestores (People Leads)',
    category: 'shoutouts',
    defaultDurationMin: 5,
    description: 'Repassar elogios do cliente, feedback de 1:1 e clareza sobre expectativas externas.',
    selected: true,
    customDetails: 'Transmitir segurança técnica e repassar feedback positivo do cliente parceiro.'
  },
  {
    id: 'top_events',
    label: 'Encontros Presenciais & Celebração',
    category: 'shoutouts',
    defaultDurationMin: 5,
    description: 'Almoço do time, retrospectiva presencial, hack days ou dia no escritório.',
    selected: true,
    customDetails: 'Confirmar quem vai ao almoço presencial ou dia no escritório na próxima semana.'
  }
];

export const WeeklyAgendaBuilder: React.FC<WeeklyAgendaBuilderProps> = ({
  guilds,
  trainings,
  cadenceTasks,
  events,
  onApplyGeneratedSlides,
  setActiveTab
}) => {
  const [topics, setTopics] = useState<AgendaTopicOption[]>(DEFAULT_TOPICS);
  const [squadName, setSquadName] = useState('Squad Checkout & Core Services');
  const [meetingDuration, setMeetingDuration] = useState(45);
  const [tone, setTone] = useState<'Motivador & Reconhecedor' | 'Direto & Focado em Métricas' | 'Estratégico & Técnico'>('Motivador & Reconhecedor');
  const [highlightOfWeek, setHighlightOfWeek] = useState('Conclusão com sucesso do deploy do microsserviço com zero downtime');
  
  // Generation output state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
  const [generatedSlides, setGeneratedSlides] = useState<SlideItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [appliedAlert, setAppliedAlert] = useState(false);

  // Timebox calculation
  const totalAllocatedMinutes = topics
    .filter((t) => t.selected)
    .reduce((acc, curr) => acc + curr.defaultDurationMin, 0);

  const toggleTopic = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const updateDuration = (id: string, mins: number) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, defaultDurationMin: Math.max(1, mins) } : t))
    );
  };

  const updateDetails = (id: string, details: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, customDetails: details } : t))
    );
  };

  // Instant local template generator (works offline without API call)
  const handleGenerateInstantTemplate = () => {
    const selected = topics.filter((t) => t.selected);
    
    const scheduledGuild = guilds.find((g) => g.status === 'agendado' || g.status === 'convidado');
    const activeTraining = trainings.find((tr) => tr.status === 'ativo');
    const nextEvent = events[0];
    const pendingMural = cadenceTasks.find((c) => c.status === 'pendente');

    let order = 1;
    const slides: SlideItem[] = [];

    selected.forEach((t) => {
      if (t.id === 'top_icebreaker') {
        slides.push({
          id: `slide_gen_${order}`,
          order: order++,
          title: '1. Abertura & Check-in de Energia do Time',
          category: 'icebreaker',
          bulletPoints: [
            'Como estão todos hoje? (Termômetro de 1 a 5 no chat)',
            'Destaques pessoais do fim de semana ou curiosidades',
            'Tempo estimado: 5 minutos'
          ],
          notes: 'Quebrar o gelo antes de discutir prazos e tarefas pesadas.'
        });
      } else if (t.id === 'top_goals') {
        slides.push({
          id: `slide_gen_${order}`,
          order: order++,
          title: `${order}. Goals da Squad & Andamento da Sprint`,
          category: 'goals',
          bulletPoints: [
            `Marco recente: ${highlightOfWeek}`,
            'Progresso dos itens prioritários no Board (Jira)',
            'Gargalos identificados: Onde a equipe precisa de apoio do Tech Lead?'
          ],
          notes: 'Focar em soluções e parabenizar entregas que avançaram sem bugs.'
        });
      } else if (t.id === 'top_guildas') {
        slides.push({
          id: `slide_gen_${order}`,
          order: order++,
          title: `${order}. Momento Guildas: Disseminação de Conhecimento`,
          category: 'guildas',
          bulletPoints: [
            scheduledGuild 
              ? `Próxima apresentação: "${scheduledGuild.title}" com ${scheduledGuild.speaker}` 
              : 'Espaço aberto para novas palestras técnicas na guilda de engenharia',
            'Palestra em guilda fortalece seu PDI e visibilidade para promoções!',
            'Tech Lead oferece mentoria técnica de 20min para estruturar seus slides.'
          ],
          notes: 'Estimular os desenvolvedores plenos e juniores a perderem o receio.'
        });
      } else if (t.id === 'top_trainings') {
        slides.push({
          id: `slide_gen_${order}`,
          order: order++,
          title: `${order}. Treinamentos Disponíveis & Upskilling`,
          category: 'trainings',
          bulletPoints: [
            activeTraining ? `Em destaque: ${activeTraining.title} (${activeTraining.targetAudience})` : 'Cursos da plataforma corporativa abertos',
            'Vouchers de certificação disponíveis para quem quiser se qualificar',
            'Reserve horas na semana para estudos e laboratórios práticos.'
          ],
          notes: 'Apoiar o desenvolvimento contínuo da equipe.'
        });
      } else if (t.id === 'top_mural') {
        slides.push({
          id: `slide_gen_${order}`,
          order: order++,
          title: `${order}. Cadeia de Apoio: Mural & Publisher`,
          category: 'initiatives',
          bulletPoints: [
            pendingMural 
              ? `Atenção: Cobrar ${pendingMural.responsibleName} para atualizar ${pendingMural.tool}` 
              : 'Mural de dependências do Q4 alinhado',
            'Publisher corporativo: Garantir release notes atualizadas para clientes e executivos',
            'Transparência é a melhor ferramenta para blindar a squad.'
          ],
          notes: 'Alinhar com PO e Scrum Master os pontos que dependem de outras squads.'
        });
      } else if (t.id === 'top_stakeholders') {
        slides.push({
          id: `slide_gen_${order}`,
          order: order++,
          title: `${order}. Relações Externas: Clientes & Gestores`,
          category: 'shoutouts',
          bulletPoints: [
            'Status de confiança com o cliente: entregas pontuais e estáveis',
            'Alinhamento com People Leads: visibilidade do esforço de cada dev',
            'Feedbacks coletados e próximos passos estratégicos'
          ],
          notes: 'Evidenciar o trabalho da equipe perante as lideranças.'
        });
      } else if (t.id === 'top_events') {
        slides.push({
          id: `slide_gen_${order}`,
          order: order++,
          title: `${order}. Integração & Encontro Presencial da Squad`,
          category: 'shoutouts',
          bulletPoints: [
            nextEvent 
              ? `Próximo evento: ${nextEvent.title} (${nextEvent.date}) no local: ${nextEvent.location}` 
              : 'Planejamento do próximo almoço presencial ou dia no escritório',
            'Momento descontraído para troca de experiências e celebração.',
            'Confirmem sua presença para fecharmos a reserva!'
          ],
          notes: 'Valorizar a conexão humana da equipe, principalmente se for remota.'
        });
      }
    });

    const markdown = `# 📋 Pauta da Reunião Weekly - ${squadName}
**Duração estimada:** ${totalAllocatedMinutes} min | **Tom:** ${tone}
**Destaque da semana:** ${highlightOfWeek}

---

${slides.map((s) => `### ${s.title}
${s.bulletPoints.map((b) => `- ${b}`).join('\n')}
*Notas de oratória do Tech Lead:* ${s.notes || 'Conduzir com foco e clareza.'}
`).join('\n---\n')}

---
*Gerado pelo TechLead HQ - Cockpit de Gestão Técnica*`;

    setGeneratedMarkdown(markdown);
    setGeneratedSlides(slides);
  };

  // Advanced Gemini AI generator
  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    setGeneratedMarkdown('');
    setGeneratedSlides([]);

    const selectedTopicsList = topics
      .filter((t) => t.selected)
      .map((t) => ({
        title: t.label,
        notes: t.customDetails,
        durationMin: t.defaultDurationMin
      }));

    try {
      const result = await generateCustomWeeklyAgendaAI(selectedTopicsList, {
        squadName,
        meetingDurationMin: meetingDuration,
        tone,
        highlightOfWeek,
        upcomingGuilds: guilds.map((g) => `${g.title} (${g.speaker} - ${g.status})`),
        activeTrainings: trainings.map((t) => t.title),
        muralTasks: cadenceTasks.map((c) => `${c.tool}: ${c.notes} (${c.responsibleName})`),
        nextEvent: events[0] ? `${events[0].title} em ${events[0].date}` : undefined
      });

      setGeneratedMarkdown(result.markdownNotes);
      setGeneratedSlides(result.slides);
    } catch (err) {
      console.error(err);
      // Fallback to instant local template if API encounters error
      handleGenerateInstantTemplate();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToSlides = () => {
    if (generatedSlides.length === 0) return;
    onApplyGeneratedSlides(generatedSlides);
    setAppliedAlert(true);
    setTimeout(() => {
      setAppliedAlert(false);
      setActiveTab('weekly_slides');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gerador Inteligente de Pauta Semanal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Weekly Agenda & Slide Builder
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monte pautas estruturadas em segundos. Selecione os ritos recorrentes (goals, incentivo a guildas, treinamentos, mural/publisher, encontros presenciais) e gere o roteiro completo pronto para copiar no Slack e exportar diretamente aos slides.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-w-[250px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Tempo planejado:</span>
              <strong className="text-indigo-400">{meetingDuration} min</strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Tempo alocado nos tópicos:</span>
              <strong className={totalAllocatedMinutes > meetingDuration ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {totalAllocatedMinutes} min
              </strong>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  totalAllocatedMinutes > meetingDuration ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, Math.round((totalAllocatedMinutes / meetingDuration) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 text-right">
              {totalAllocatedMinutes > meetingDuration ? '⚠️ Ajuste os minutos para não estourar a reunião' : '✅ Reunião bem calibrada!'}
            </p>
          </div>
        </div>

        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recurring Topics Selection */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  <span>Tópicos Recorrentes da Reunião</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Marque o que entrará na pauta desta semana e ajuste a duração (timeboxing).
                </p>
              </div>

              <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                {topics.filter((t) => t.selected).length} de {topics.length} selecionados
              </span>
            </div>

            <div className="space-y-3">
              {topics.map((topic) => {
                const getIcon = () => {
                  switch (topic.id) {
                    case 'top_icebreaker': return <Flame className="w-4 h-4 text-amber-400" />;
                    case 'top_goals': return <Award className="w-4 h-4 text-emerald-400" />;
                    case 'top_guildas': return <BookOpen className="w-4 h-4 text-indigo-400" />;
                    case 'top_trainings': return <Sparkles className="w-4 h-4 text-sky-400" />;
                    case 'top_mural': return <KanbanSquare className="w-4 h-4 text-amber-400" />;
                    case 'top_stakeholders': return <Users className="w-4 h-4 text-purple-400" />;
                    case 'top_events': return <CalendarDays className="w-4 h-4 text-rose-400" />;
                    default: return <Clock className="w-4 h-4 text-slate-400" />;
                  }
                };

                return (
                  <div
                    key={topic.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      topic.selected
                        ? 'bg-slate-800/60 border-indigo-500/40 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleTopic(topic.id)}
                          className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                        >
                          {topic.selected ? (
                            <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            {getIcon()}
                            <h4 className="text-sm font-semibold text-white truncate">{topic.label}</h4>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{topic.description}</p>
                        </div>
                      </div>

                      {/* Timebox input */}
                      <div className="flex items-center space-x-1.5 shrink-0 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="number"
                          value={topic.defaultDurationMin}
                          onChange={(e) => updateDuration(topic.id, parseInt(e.target.value) || 1)}
                          disabled={!topic.selected}
                          className="w-9 bg-transparent text-xs text-center font-bold text-white focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-400">min</span>
                      </div>
                    </div>

                    {/* Custom focus input if selected */}
                    {topic.selected && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/50">
                        <input
                          type="text"
                          value={topic.customDetails || ''}
                          onChange={(e) => updateDetails(topic.id, e.target.value)}
                          placeholder="Foco específico deste tópico para esta semana..."
                          className="w-full bg-slate-900/80 border border-slate-700/60 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Squad Context & Action Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Presentation className="w-4 h-4 text-emerald-400" />
              <span>Contexto & Customização da Weekly</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nome da Squad / Time</label>
                <input
                  type="text"
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Duração Total da Reunião (minutos)</label>
                <select
                  value={meetingDuration}
                  onChange={(e) => setMeetingDuration(parseInt(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={30}>30 minutos (Weekly Express)</option>
                  <option value={45}>45 minutos (Recomendado)</option>
                  <option value={60}>60 minutos (Weekly Completa com Guilda)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tom da Reunião</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Motivador & Reconhecedor">Motivador & Reconhecedor (Celebrar vitórias)</option>
                  <option value="Direto & Focado em Métricas">Direto & Focado em Métricas (Gargalos & prazos)</option>
                  <option value="Estratégico & Técnico">Estratégico & Técnico (Arquitetura & Guildas)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Destaque Principal da Semana</label>
                <textarea
                  value={highlightOfWeek}
                  onChange={(e) => setHighlightOfWeek(e.target.value)}
                  rows={2}
                  placeholder="Ex: Entrega do recurso X, resolução do incidente de latência..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Generation Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGenerating || topics.filter((t) => t.selected).length === 0}
                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sintetizando Pauta com Gemini 2.5 Flash...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
                    <span>Gerar Pauta & Slides com IA</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGenerateInstantTemplate}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Gerar Roteiro Instantâneo (Offline/Rápido)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output Section: Generated Outline & Slide Preview */}
      {generatedMarkdown && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold text-white">Roteiro Gerado com Sucesso!</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {generatedSlides.length} slides prontos para apresentação e notas estruturadas com timeboxing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado para o Clipboard!' : 'Copiar Pauta (Slack/Teams)'}</span>
              </button>

              <button
                type="button"
                onClick={handleApplyToSlides}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
              >
                <Presentation className="w-4 h-4" />
                <span>{appliedAlert ? '✅ Aplicado aos Slides!' : 'Carregar nos Slides da Reunião'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>

          {/* Quick Slides Preview Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Estrutura de Slides Gerada:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {generatedSlides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase">
                      Slide {idx + 1}
                    </span>
                    <h5 className="text-sm font-semibold text-white mt-1.5 line-clamp-1">{slide.title}</h5>
                    <ul className="mt-2 space-y-1">
                      {slide.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx} className="text-xs text-slate-300 flex items-start space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {slide.notes && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 italic line-clamp-2">
                      💡 {slide.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Markdown Text Area Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Texto Formatado para o Canal da Squad:</span>
              </span>
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="text-indigo-400 hover:text-indigo-300 text-xs"
              >
                {copied ? 'Copiado!' : 'Copiar todo o texto'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
              {generatedMarkdown}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
