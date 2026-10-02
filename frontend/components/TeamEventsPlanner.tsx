import React, { useState } from 'react';
import { TeamEvent, SquadMemberRSVP, EventAgendaScheduleItem } from '../types';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Trash2,
  Utensils,
  Laptop,
  Flame,
  Coffee,
  HelpCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface TeamEventsPlannerProps {
  events: TeamEvent[];
  onAddEvent: (event: Omit<TeamEvent, 'id'>) => void;
  onUpdateEventRSVP?: (eventId: string, memberId: string, status: SquadMemberRSVP['status']) => void;
}

export const TeamEventsPlanner: React.FC<TeamEventsPlannerProps> = ({ 
  events, 
  onAddEvent,
  onUpdateEventRSVP 
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Form states for adding new event
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TeamEvent['type']>('presencial_almoco');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [budgetPerPerson, setBudgetPerPerson] = useState<number>(85);
  const [agendaSummary, setAgendaSummary] = useState('');
  const [scheduleItems, setScheduleItems] = useState<EventAgendaScheduleItem[]>([
    { time: '12:30', title: 'Ponto de encontro', description: 'Reunir no local' },
    { time: '13:00', title: 'Almoço & Bate-papo', description: 'Momento de integração' }
  ]);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleAddScheduleItem = () => {
    setScheduleItems((prev) => [
      ...prev,
      { time: '14:00', title: 'Nova atividade', description: 'Descrição da dinâmica' }
    ]);
  };

  const handleScheduleChange = (index: number, field: keyof EventAgendaScheduleItem, value: string) => {
    setScheduleItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveScheduleItem = (index: number) => {
    setScheduleItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Default squad members to populate RSVP checklist
    const defaultMembers: SquadMemberRSVP[] = [
      { id: 'm1', name: 'Marina Costa', role: 'Dev Sênior', status: 'confirmado' },
      { id: 'm2', name: 'Lucas Silva', role: 'Dev Pleno', status: 'confirmado' },
      { id: 'm3', name: 'Rafael Mendes', role: 'Dev Júnior', status: 'pendente' },
      { id: 'm4', name: 'Juliana Prado', role: 'Scrum Master', status: 'confirmado' },
      { id: 'm5', name: 'Thiago Mendes', role: 'Product Owner', status: 'pendente' },
      { id: 'm6', name: 'Camila Pires', role: 'QA Engineer', status: 'confirmado' },
      { id: 'm7', name: 'André Farias', role: 'Dev Backend', status: 'pendente' },
      { id: 'm8', name: 'Você (Tech Lead)', role: 'Tech Lead', status: 'confirmado' }
    ];

    const confirmedCount = defaultMembers.filter((m) => m.status === 'confirmado').length;
    const totalEst = confirmedCount * budgetPerPerson;

    onAddEvent({
      title: title.trim(),
      type,
      date: date || new Date().toISOString().slice(0, 16),
      location: location.trim() || 'Escritório Central',
      locationDetails: locationDetails.trim() || undefined,
      budgetPerPerson,
      totalEstimatedBudget: totalEst,
      budgetApproved: true,
      agendaSummary: agendaSummary.trim() || 'Encontro de integração e alinhamento do time',
      schedule: scheduleItems,
      rsvps: defaultMembers,
      status: 'planejado'
    });

    setTitle('');
    setLocation('');
    setLocationDetails('');
    setAgendaSummary('');
    setShowAddForm(false);
  };

  const handleToggleRSVP = (eventId: string, memberId: string, currentStatus: SquadMemberRSVP['status']) => {
    const nextStatus: SquadMemberRSVP['status'] = 
      currentStatus === 'confirmado' ? 'recusado' : currentStatus === 'recusado' ? 'pendente' : 'confirmado';

    if (onUpdateEventRSVP) {
      onUpdateEventRSVP(eventId, memberId, nextStatus);
    } else {
      // Local mutation if prop wasn't piped
      const ev = events.find((e) => e.id === eventId);
      if (ev) {
        const member = ev.rsvps.find((m) => m.id === memberId);
        if (member) member.status = nextStatus;
      }
    }
  };

  const handleCopyInvitation = (event: TeamEvent) => {
    const formattedDate = new Date(event.date).toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });

    const inviteText = `🎉 *Convite: ${event.title}*
📍 *Local:* ${event.location} ${event.locationDetails ? `(${event.locationDetails})` : ''}
🗓️ *Data & Horário:* ${formattedDate}

📋 *Agenda do Encontro:*
${event.schedule.map((s) => `• *${s.time}* - ${s.title}: ${s.description}`).join('\n')}

💰 *Orçamento:* Reembolso aprovado pela gerência (~R$ ${event.budgetPerPerson || 0}/pessoa)

👉 *Confirme sua presença ou restrições alimentares no link ou avise o Tech Lead!*`;

    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const getTypeBadge = (type: TeamEvent['type']) => {
    switch (type) {
      case 'presencial_almoco':
        return (
          <span className="flex items-center space-x-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            <Utensils className="w-3.5 h-3.5" />
            <span>Almoço de Time</span>
          </span>
        );
      case 'team_day':
        return (
          <span className="flex items-center space-x-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            <Laptop className="w-3.5 h-3.5" />
            <span>Team Day no Hub</span>
          </span>
        );
      case 'retro_presencial':
        return (
          <span className="flex items-center space-x-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>Retrospectiva Técnica</span>
          </span>
        );
      case 'coffee_break':
        return (
          <span className="flex items-center space-x-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            <Coffee className="w-3.5 h-3.5" />
            <span>Coffee Break / Happy Hour</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Hack Day / Lab</span>
          </span>
        );
    }
  };

  // Metrics for selected event
  const confirmedCount = selectedEvent?.rsvps.filter((r) => r.status === 'confirmado').length || 0;
  const pendingCount = selectedEvent?.rsvps.filter((r) => r.status === 'pendente').length || 0;
  const declinedCount = selectedEvent?.rsvps.filter((r) => r.status === 'recusado').length || 0;
  const estimatedCost = confirmedCount * (selectedEvent?.budgetPerPerson || 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
            <span>Team Gatherings & Cultura Presencial</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Planejador de Encontros Presenciais da Squad
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Organize almoços, retrospectivas técnicas presenciais e dias de escritório no hub. Gerencie o orçamento estimado, o checklist de RSVP com restrições alimentares e a agenda horária.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/25 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fechar Formulário' : 'Novo Encontro Presencial'}</span>
        </button>
      </div>

      {/* Add New Event Accordion Form */}
      {showAddForm && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-lg animate-in fade-in">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Criar Novo Encontro de Time</span>
          </h3>

          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Título do Evento</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Almoço de Celebração de Release, Retrospectiva Trimestral..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Tipo de Evento</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="presencial_almoco">Almoço Presencial</option>
                <option value="team_day">Team Day no Hub / Escritório</option>
                <option value="retro_presencial">Retrospectiva Técnica</option>
                <option value="coffee_break">Coffee Break / Happy Hour</option>
                <option value="hack_day">Hack Day / POC Lab</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Data & Horário</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Local Principal</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Restaurante Varanda Gourmet ou Sede Central 3B..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Endereço / Detalhes de Acesso</label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="Ex: Próximo ao metrô, estacionamento gratuito..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Orçamento / Pessoa (R$)</label>
              <input
                type="number"
                value={budgetPerPerson}
                onChange={(e) => setBudgetPerPerson(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-12">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Resumo da Proposta & Propósito</label>
              <textarea
                value={agendaSummary}
                onChange={(e) => setAgendaSummary(e.target.value)}
                rows={2}
                placeholder="Qual o objetivo desse encontro? (Celebrar entrega, quebrar isolamento, desenhar arquitetura)..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Dynamic Schedule Items Editor */}
            <div className="sm:col-span-12 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Programação / Horários do Evento:
                </label>
                <button
                  type="button"
                  onClick={handleAddScheduleItem}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Horário</span>
                </button>
              </div>

              <div className="space-y-2">
                {scheduleItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                      placeholder="12:30"
                      className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white text-center font-mono"
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleScheduleChange(idx, 'title', e.target.value)}
                      placeholder="Atividade"
                      className="w-48 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleScheduleChange(idx, 'description', e.target.value)}
                      placeholder="Detalhes ou objetivos"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    />
                    {scheduleItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveScheduleItem(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:col-span-12 pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Salvar e Publicar Evento</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: Left Event Selector & Summary, Right Detail with RSVP & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Events Navigation Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Próximos Encontros Cadastrados ({events.length})
          </div>

          <div className="space-y-2.5">
            {events.map((ev) => {
              const isSelected = ev.id === (selectedEvent?.id || '');
              const confirmedInEv = ev.rsvps.filter((r) => r.status === 'confirmado').length;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {getTypeBadge(ev.type)}
                    <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {ev.status === 'confirmado' ? 'Confirmado' : 'Em planejamento'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 line-clamp-1">{ev.title}</h4>

                  <div className="mt-2 space-y-1 text-xs text-slate-400">
                    <p className="flex items-center space-x-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{ev.date ? new Date(ev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Data a definir'}</span>
                    </p>
                    <p className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span className="truncate">{ev.location}</span>
                    </p>
                    <p className="flex items-center space-x-1.5 text-emerald-400">
                      <Users className="w-3.5 h-3.5" />
                      <span><strong>{confirmedInEv}</strong> de {ev.rsvps.length} confirmados</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Event Stage (RSVP checklist, budget, agenda timeline) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedEvent ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    {getTypeBadge(selectedEvent.type)}
                    <span className="text-xs text-slate-400">
                      Status: <strong className="text-emerald-400 capitalize">{selectedEvent.status}</strong>
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mt-2">{selectedEvent.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">{selectedEvent.agendaSummary}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                    <span className="flex items-center space-x-1 text-slate-200">
                      <CalendarDays className="w-4 h-4 text-indigo-400" />
                      <span>{new Date(selectedEvent.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-200">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span>{selectedEvent.location} {selectedEvent.locationDetails && `• ${selectedEvent.locationDetails}`}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyInvitation(selectedEvent)}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all shadow-sm"
                >
                  {copiedInvite ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedInvite ? 'Convite Copiado!' : 'Copiar Convite (Slack/Email)'}</span>
                </button>
              </div>

              {/* Budget & Capacity Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Orçamento / Pessoa</span>
                    <p className="text-base font-bold text-white">R$ {selectedEvent.budgetPerPerson || 0}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Confirmados / Total</span>
                    <p className="text-base font-bold text-white">
                      <span className="text-emerald-400">{confirmedCount}</span> / {selectedEvent.rsvps.length} pessoas
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Estimativa Total (Aprovado)</span>
                    <p className="text-base font-bold text-emerald-300">R$ {estimatedCost}</p>
                  </div>
                </div>
              </div>

              {/* RSVP Squad Members Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Checklist de RSVP da Squad ({confirmedCount} Confirmados, {pendingCount} Pendentes, {declinedCount} Recusados)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">Clique para alternar o status</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedEvent.rsvps.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => handleToggleRSVP(selectedEvent.id, member.id, member.status)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                        member.status === 'confirmado'
                          ? 'bg-slate-950/90 border-emerald-500/40 hover:border-emerald-500/60'
                          : member.status === 'recusado'
                          ? 'bg-slate-950/40 border-rose-500/30 opacity-60'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          member.status === 'confirmado'
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                            : member.status === 'recusado'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {member.name.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{member.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{member.role}</p>
                          {member.dietaryNotes && (
                            <span className="inline-block mt-0.5 text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded">
                              🥗 {member.dietaryNotes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status indicator button */}
                      <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                        member.status === 'confirmado'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : member.status === 'recusado'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-slate-800 text-amber-300'
                      }`}>
                        {member.status === 'confirmado' ? 'Confirmado' : member.status === 'recusado' ? 'Não vai' : 'Pendente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agenda / Schedule Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Programação Horária (Timeboxing do Encontro)</span>
                </h4>

                <div className="divide-y divide-slate-800/80 bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden">
                  {selectedEvent.schedule.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-start space-x-3.5 hover:bg-slate-900/40 transition-colors">
                      <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 shrink-0">
                        {item.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs sm:text-sm font-semibold text-white">{item.title}</h5>
                        <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-sm">
              Nenhum encontro presencial selecionado. Crie um novo no botão acima!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
