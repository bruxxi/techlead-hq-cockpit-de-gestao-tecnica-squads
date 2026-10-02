import React, { useState } from 'react';
import { 
  WeeklyChecklistItem, 
  TabType 
} from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Trash2, 
  Sparkles, 
  Presentation, 
  KanbanSquare, 
  Compass, 
  Users, 
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Wand2
} from 'lucide-react';

interface WeeklyCockpitProps {
  checklist: WeeklyChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onAddChecklist: (item: Omit<WeeklyChecklistItem, 'id'>) => void;
  onDeleteChecklist: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
  openAiCopilot: () => void;
}

export const WeeklyCockpit: React.FC<WeeklyCockpitProps> = ({
  checklist,
  onToggleChecklist,
  onAddChecklist,
  onDeleteChecklist,
  setActiveTab,
  openAiCopilot,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<WeeklyChecklistItem['category']>('weekly_prep');
  const [newPriority, setNewPriority] = useState<WeeklyChecklistItem['priority']>('alta');
  const [newRole, setNewRole] = useState('Tech Lead');

  const completedCount = checklist.filter((i) => i.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddChecklist({
      title: newTitle.trim(),
      description: 'Tarefa criada no cockpit semanal',
      category: newCategory,
      priority: newPriority,
      completed: false,
      assignedRole: newRole
    });

    setNewTitle('');
  };

  const getPriorityBadge = (priority: WeeklyChecklistItem['priority']) => {
    switch (priority) {
      case 'urgente':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">Urgente</span>;
      case 'alta':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">Alta</span>;
      case 'media':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">Média</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px]">Baixa</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rotina do Tech Lead & Gestão da Squad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cockpit de Operação Semanal
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Estruture sua reunião <span className="text-indigo-300 font-semibold">Weekly</span>, gere pautas automáticas no <span className="text-emerald-300 font-semibold">Agenda Builder</span>, promova guildas, cobre as atualizações do <span className="text-amber-300 font-semibold">Mural & Publisher</span> e garanta alinhamento contínuo com clientes e gestores de pessoas.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                onClick={() => setActiveTab('agenda_builder')}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-emerald-600/30"
              >
                <Wand2 className="w-4 h-4" />
                <span>Novo Agenda Builder</span>
              </button>
              <button
                onClick={() => setActiveTab('weekly_slides')}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/30"
              >
                <Presentation className="w-4 h-4" />
                <span>Ver Slides da Weekly</span>
              </button>
              <button
                onClick={() => setActiveTab('mural_cadence')}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition-all"
              >
                <KanbanSquare className="w-4 h-4 text-amber-400" />
                <span>Mural & Publisher</span>
              </button>
              <button
                onClick={openAiCopilot}
                className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Copilot IA</span>
              </button>
            </div>
          </div>

          {/* Circular / Progress Metric Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 min-w-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Ritos & Cadência da Semana</span>
              <span className="text-indigo-400 font-bold">{progressPercent}%</span>
            </div>
            
            <div className="my-3">
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Concluídas: <strong className="text-emerald-400">{completedCount}</strong>/{totalCount}</span>
              <span className="text-slate-400">Pendentes: <strong className="text-rose-400">{totalCount - completedCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Action Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('agenda_builder')}
          className="bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-800/60 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Wand2 className="w-5 h-5 text-emerald-300" />
          </div>
          <h3 className="font-semibold text-white text-sm group-hover:text-emerald-300 flex items-center justify-between">
            <span>Weekly Agenda Builder</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">Novo</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Gere a pauta com tópicos recorrentes e envie para os slides com 1 clique.</p>
        </div>

        <div 
          onClick={() => setActiveTab('weekly_slides')}
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-800/50 group"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Presentation className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300">Slides da Weekly</h3>
          <p className="text-xs text-slate-400 mt-1">Apresentação ao vivo com notas de oratória do Tech Lead.</p>
        </div>

        <div 
          onClick={() => setActiveTab('guildas')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-800/50 group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-sm group-hover:text-emerald-300">Incentivo a Guildas</h3>
          <p className="text-xs text-slate-400 mt-1">Encoraje desenvolvedores tímidos a palestrar e expor sucessos da squad.</p>
        </div>

        <div 
          onClick={() => setActiveTab('mural_cadence')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-800/50 group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <KanbanSquare className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-sm group-hover:text-amber-300">Mural & Publisher</h3>
          <p className="text-xs text-slate-400 mt-1">Acompanhe se a cadeia de apoio (PO/SM) atualizou mapas e releases.</p>
        </div>
      </div>

      {/* Main Checklist Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Checklist Semanal do Tech Lead</span>
              <span className="text-xs font-normal text-slate-400">({checklist.length} tarefas)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Itens críticos de gestão técnica, alinhamentos interpessoais e processos da squad
            </p>
          </div>

          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/60 flex items-center space-x-1.5 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Rotina recorrente</span>
          </span>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleCreateItem} className="my-4 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Adicionar nova tarefa do Tech Lead (ex: Alinhar métricas com PO)..."
            className="sm:col-span-6 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="sm:col-span-2 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="weekly_prep">Weekly Prep</option>
            <option value="slides">Slides</option>
            <option value="cadence_mural">Mural / Publisher</option>
            <option value="guilda_nudge">Guildas</option>
            <option value="initiatives">Iniciativas</option>
            <option value="stakeholder">Gestores/Cliente</option>
            <option value="culture">Presencial/Time</option>
          </select>

          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as any)}
            className="sm:col-span-2 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="urgente">Urgente</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <button
            type="submit"
            className="sm:col-span-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>

        {/* Task Items List */}
        <div className="divide-y divide-slate-800/60 mt-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`py-3.5 flex items-start sm:items-center justify-between gap-3 group transition-all rounded-lg px-2 ${
                item.completed ? 'opacity-60 bg-slate-900/40' : 'hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleChecklist(item.id)}
                  className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-semibold tracking-tight ${
                        item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {item.title}
                    </span>
                    {getPriorityBadge(item.priority)}
                    {item.assignedRole && (
                      <span className="text-[11px] bg-slate-800 border border-slate-700/60 text-indigo-300 px-2 py-0.5 rounded">
                        {item.assignedRole}
                      </span>
                    )}
                    {item.targetDate && (
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.targetDate}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDeleteChecklist(item.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1.5 transition-all"
                title="Excluir tarefa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
