import React, { useState } from 'react';
import { SupportCadenceTask, ReminderTemplate } from '../types';
import { DEFAULT_REMINDER_TEMPLATES } from '../constants';
import { 
  KanbanSquare, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  Plus, 
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Copy,
  Check,
  Send,
  Sparkles,
  Users,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';

interface MuralPublisherChecklistProps {
  tasks: SupportCadenceTask[];
  onUpdateTaskStatus: (id: string, status: SupportCadenceTask['status']) => void;
  onAddTask: (task: Omit<SupportCadenceTask, 'id'>) => void;
}

export const MuralPublisherChecklist: React.FC<MuralPublisherChecklistProps> = ({
  tasks,
  onUpdateTaskStatus,
  onAddTask
}) => {
  const [tool, setTool] = useState<SupportCadenceTask['tool']>('Mural');
  const [responsible, setResponsible] = useState('');
  const [role, setRole] = useState<SupportCadenceTask['role']>('Product Owner');
  const [notes, setNotes] = useState('');
  const [contactHandle, setContactHandle] = useState('');
  const [boardUrl, setBoardUrl] = useState('');

  // Filter and search
  const [filterTool, setFilterTool] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reminder modal state
  const [activeReminderTask, setActiveReminderTask] = useState<SupportCadenceTask | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReminderTemplate>(DEFAULT_REMINDER_TEMPLATES[0]);
  const [customizedMessage, setCustomizedMessage] = useState('');
  const [copiedReminder, setCopiedReminder] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responsible.trim()) return;

    onAddTask({
      tool,
      responsibleName: responsible.trim(),
      role,
      status: 'pendente',
      lastUpdated: 'Hoje',
      notes: notes.trim() || 'Atualização periódica da ferramenta',
      contactHandle: contactHandle.trim() || undefined,
      boardUrl: boardUrl.trim() || undefined
    });

    setResponsible('');
    setNotes('');
    setContactHandle('');
    setBoardUrl('');
  };

  const openReminderModal = (task: SupportCadenceTask) => {
    setActiveReminderTask(task);
    const msg = selectedTemplate.message
      .replace('{nome}', task.responsibleName)
      .replace('{ferramenta}', task.tool)
      .replace('{detalhes}', task.notes)
      .replace('{dias}', task.lastUpdated);
    setCustomizedMessage(msg);
  };

  const handleSelectTemplate = (template: ReminderTemplate) => {
    setSelectedTemplate(template);
    if (!activeReminderTask) return;
    const msg = template.message
      .replace('{nome}', activeReminderTask.responsibleName)
      .replace('{ferramenta}', activeReminderTask.tool)
      .replace('{detalhes}', activeReminderTask.notes)
      .replace('{dias}', activeReminderTask.lastUpdated);
    setCustomizedMessage(msg);
  };

  const handleCopyReminder = () => {
    navigator.clipboard.writeText(customizedMessage);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2000);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesTool = filterTool === 'all' || task.tool === filterTool;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = 
      task.responsibleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tool.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTool && matchesStatus && matchesSearch;
  });

  const pendingCount = tasks.filter((t) => t.status === 'pendente').length;
  const inProgressCount = tasks.filter((t) => t.status === 'em_andamento').length;
  const updatedCount = tasks.filter((t) => t.status === 'atualizado').length;

  const getStatusBadge = (status: SupportCadenceTask['status']) => {
    switch (status) {
      case 'atualizado':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Atualizado</span>
          </span>
        );
      case 'em_andamento':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Em atualização</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cobrança Pendente</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <KanbanSquare className="w-3.5 h-3.5" />
            <span>Cadence & Boards Tracking</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Painel da Cadeia de Apoio: Mural & Publisher
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Acompanhe o status e a data da última atualização feita por POs, Scrum Masters e cadeia de apoio nos murais de dependências e lançamentos oficiais do Publisher. Envie lembretes padronizados com um clique.
          </p>
        </div>

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 font-medium">Pendentes</span>
            <p className="text-xl font-bold text-rose-400">{pendingCount}</p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 font-medium">Em Andamento</span>
            <p className="text-xl font-bold text-amber-400">{inProgressCount}</p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 font-medium">Atualizados</span>
            <p className="text-xl font-bold text-emerald-400">{updatedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por responsável ou nota..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterTool}
            onChange={(e) => setFilterTool(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todas as ferramentas</option>
            <option value="Mural">Apenas Mural</option>
            <option value="Publisher">Apenas Publisher</option>
            <option value="Jira / Board">Jira / Board</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todos os status</option>
            <option value="pendente">Pendentes</option>
            <option value="em_andamento">Em andamento</option>
            <option value="atualizado">Atualizados</option>
          </select>
        </div>
      </div>

      {/* Add New Checkpoint Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Cadastrar Responsável & Cobrança de Quadro</span>
        </h3>

        <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value as any)}
            className="sm:col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="Mural">Mural (Mapa Visual & Riscos)</option>
            <option value="Publisher">Publisher (Releases & Notas)</option>
            <option value="Jira / Board">Jira / Board</option>
            <option value="Confluence / Doc">Confluence / Doc</option>
            <option value="Release Radar">Release Radar</option>
          </select>

          <input
            type="text"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            placeholder="Nome do responsável (ex: Juliana Prado)..."
            className="sm:col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="sm:col-span-2 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="Scrum Master / Agile Coach">Scrum Master / Agile Coach</option>
            <option value="Product Owner">Product Owner</option>
            <option value="Cadeia de Apoio">Cadeia de Apoio</option>
            <option value="Tech Lead">Tech Lead</option>
            <option value="Dev">Dev</option>
          </select>

          <input
            type="text"
            value={contactHandle}
            onChange={(e) => setContactHandle(e.target.value)}
            placeholder="@slack ou email..."
            className="sm:col-span-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="O que deve ser atualizado (ex: épico Q4, status de homologação)..."
            className="sm:col-span-10 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            className="sm:col-span-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-3 py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-amber-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-slate-900 border rounded-xl p-5 space-y-3.5 flex flex-col justify-between transition-all ${
              task.status === 'pendente' 
                ? 'border-rose-500/30 hover:border-rose-500/50' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                    task.tool === 'Mural'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      : task.tool === 'Publisher'
                      ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                      : 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                  }`}>
                    {task.tool}
                  </span>
                  {task.boardUrl && (
                    <a
                      href={task.boardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-300 p-1"
                      title="Abrir quadro externo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {getStatusBadge(task.status)}
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-semibold text-white leading-snug">{task.notes}</h4>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <strong className="text-white">{task.responsibleName}</strong>
                    <span className="text-slate-500">({task.role})</span>
                  </span>

                  {task.contactHandle && (
                    <span className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {task.contactHandle}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-[11px] text-slate-400 flex items-center space-x-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Última atualização registrada: <strong className="text-slate-300">{task.lastUpdated}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions: Status toggles and Reminder Message trigger */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateTaskStatus(task.id, 'pendente')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    task.status === 'pendente' 
                      ? 'bg-rose-500/30 text-rose-300 font-bold border border-rose-500/40' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Pendente
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateTaskStatus(task.id, 'em_andamento')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    task.status === 'em_andamento' 
                      ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Em andamento
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateTaskStatus(task.id, 'atualizado')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    task.status === 'atualizado' 
                      ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Atualizado
                </button>
              </div>

              <button
                type="button"
                onClick={() => openReminderModal(task)}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Gerar Lembrete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reminder Message Modal */}
      {activeReminderTask && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <MessageSquare className="w-5 h-5" />
                <h3 className="text-base text-white">
                  Lembrete para {activeReminderTask.responsibleName} ({activeReminderTask.tool})
                </h3>
              </div>
              <button
                onClick={() => setActiveReminderTask(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Escolha um modelo pronto ou ajuste a mensagem antes de copiar e enviar no Slack/Teams/Email.
            </p>

            {/* Template Selector Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-1 text-xs">
              {DEFAULT_REMINDER_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-all ${
                    selectedTemplate.id === tpl.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>

            {/* Editable Message Box */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Mensagem para Envio:
              </label>
              <textarea
                value={customizedMessage}
                onChange={(e) => setCustomizedMessage(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {activeReminderTask.contactHandle ? `Destino: ${activeReminderTask.contactHandle}` : 'Copie e cole no canal'}
              </span>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveReminderTask(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleCopyReminder}
                  className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md shadow-amber-600/25 transition-all"
                >
                  {copiedReminder ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedReminder ? 'Copiado para Clipboard!' : 'Copiar Mensagem'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
