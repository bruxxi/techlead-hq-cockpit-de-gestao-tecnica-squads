import React, { useState } from 'react';
import { GuildTopic } from '../types';
import { 
  Compass, 
  Plus, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  UserPlus
} from 'lucide-react';
import { generateGuildIncentivePitch } from '../services/geminiService';

interface GuildsHubProps {
  guilds: GuildTopic[];
  onAddGuildTopic: (topic: Omit<GuildTopic, 'id'>) => void;
  onUpdateGuildStatus: (id: string, status: GuildTopic['status']) => void;
}

export const GuildsHub: React.FC<GuildsHubProps> = ({
  guilds,
  onAddGuildTopic,
  onUpdateGuildStatus
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newArea, setNewArea] = useState<GuildTopic['guildArea']>('Backend');
  const [newNotes, setNewNotes] = useState('');

  // AI pitch modal state
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [pitchDevName, setPitchDevName] = useState('');
  const [pitchFeat, setPitchFeat] = useState('');
  const [pitchGuild, setPitchGuild] = useState('Guilda de Engenharia');
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [isPitchLoading, setIsPitchLoading] = useState(false);
  const [pitchCopied, setPitchCopied] = useState(false);

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddGuildTopic({
      title: newTitle.trim(),
      speaker: newSpeaker.trim() || 'Voluntário da Squad',
      guildArea: newArea,
      status: 'convidado',
      incentiveNotes: newNotes.trim()
    });

    setNewTitle('');
    setNewSpeaker('');
    setNewNotes('');
  };

  const handleGeneratePitch = async () => {
    if (!pitchDevName.trim()) return;
    setIsPitchLoading(true);
    const result = await generateGuildIncentivePitch(
      pitchDevName,
      pitchFeat || 'construiu uma feature excelente na última sprint e otimizou a base de código',
      pitchGuild
    );
    setGeneratedPitch(result);
    setIsPitchLoading(false);
  };

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(generatedPitch);
    setPitchCopied(true);
    setTimeout(() => setPitchCopied(false), 2000);
  };

  const getStatusBadge = (status: GuildTopic['status']) => {
    switch (status) {
      case 'concluido':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">Apresentado</span>;
      case 'agendado':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">Agendado</span>;
      case 'convidado':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">Em incentivo</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px]">Ideia de Pauta</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Mission */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Hub de Guildas & Disseminação de Conhecimento</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Incentivar os desenvolvedores a apresentarem em guildas gera visibilidade para o time perante a diretoria, acelera a senioridade deles e fortalece a cultura de engenharia.
          </p>
        </div>

        <button
          onClick={() => setIsPitchModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Criar Convite com IA para o Dev</span>
        </button>
      </div>

      {/* Add New Guild Topic */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
          <UserPlus className="w-4 h-4 text-indigo-400" />
          <span>Sugerir ou Registrar Tópico para Guilda</span>
        </h3>

        <form onSubmit={handleCreateTopic} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Título da palestra técnica (ex: Como usamos CDC com Debezium)..."
            className="sm:col-span-5 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <input
            type="text"
            value={newSpeaker}
            onChange={(e) => setNewSpeaker(e.target.value)}
            placeholder="Desenvolvedor responsável (ex: André Pleno)..."
            className="sm:col-span-3 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <select
            value={newArea}
            onChange={(e) => setNewArea(e.target.value as any)}
            className="sm:col-span-2 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="DevOps & Cloud">DevOps & Cloud</option>
            <option value="Arquitetura">Arquitetura</option>
            <option value="QA & Testes">QA & Testes</option>
            <option value="Mobile">Mobile</option>
            <option value="Soft Skills">Soft Skills</option>
          </select>

          <button
            type="submit"
            className="sm:col-span-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center space-x-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      {/* Guild Topics List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guilds.map((topic) => (
          <div
            key={topic.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {topic.guildArea}
                </span>
                {getStatusBadge(topic.status)}
              </div>

              <h4 className="text-base font-bold text-white mt-2 leading-snug">
                {topic.title}
              </h4>

              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1.5">
                <span className="font-semibold text-slate-300">Palestrante:</span>
                <span>{topic.speaker}</span>
                {topic.dateScheduled && (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 ml-2" />
                    <span>{topic.dateScheduled}</span>
                  </span>
                )}
              </div>

              {topic.incentiveNotes && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-amber-400 font-semibold">Dica de abordagem do Tech Lead:</span>{' '}
                  {topic.incentiveNotes}
                </div>
              )}

              {topic.feedback && (
                <div className="mt-2 text-xs text-emerald-300 bg-emerald-950/20 border border-emerald-500/20 p-2 rounded">
                  <strong>Resultado:</strong> {topic.feedback}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Alterar status:</span>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onUpdateGuildStatus(topic.id, 'convidado')}
                  className={`px-2 py-1 rounded text-[11px] ${
                    topic.status === 'convidado' ? 'bg-amber-500/30 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Convidar
                </button>
                <button
                  onClick={() => onUpdateGuildStatus(topic.id, 'agendado')}
                  className={`px-2 py-1 rounded text-[11px] ${
                    topic.status === 'agendado' ? 'bg-indigo-500/30 text-indigo-300' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Agendado
                </button>
                <button
                  onClick={() => onUpdateGuildStatus(topic.id, 'concluido')}
                  className={`px-2 py-1 rounded text-[11px] ${
                    topic.status === 'concluido' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Concluído
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: AI Incentive Message Generator */}
      {isPitchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base text-white">Gerador de Convite Acolhedor para Guilda</h3>
              </div>
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Devs muitas vezes têm vergonha de palestrar. A IA gera um pitch motivador e humanizado para você enviar via Slack/Teams.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nome do Desenvolvedor(a)</label>
                <input
                  type="text"
                  value={pitchDevName}
                  onChange={(e) => setPitchDevName(e.target.value)}
                  placeholder="Ex: Rafael, Marina, Lucas..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">O que ele(a) fez de bom recentemente?</label>
                <input
                  type="text"
                  value={pitchFeat}
                  onChange={(e) => setPitchFeat(e.target.value)}
                  placeholder="Ex: refatorou o serviço de mensageria com Kafka e reduziu custos..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nome da Guilda</label>
                <input
                  type="text"
                  value={pitchGuild}
                  onChange={(e) => setPitchGuild(e.target.value)}
                  placeholder="Ex: Guilda Backend, Guilda de DevOps..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleGeneratePitch}
                disabled={isPitchLoading || !pitchDevName}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isPitchLoading ? <span>Redigindo mensagem...</span> : <span>Gerar Mensagem com IA</span>}
              </button>
            </div>

            {generatedPitch && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Mensagem Sugerida:</span>
                  <button
                    onClick={handleCopyPitch}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    {pitchCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{pitchCopied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {generatedPitch}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
