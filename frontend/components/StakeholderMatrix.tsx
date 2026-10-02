import React, { useState } from 'react';
import { StakeholderRelationship } from '../types';
import { 
  Users, 
  Star, 
  Sparkles, 
  MessageCircle, 
  Plus, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Mail
} from 'lucide-react';
import { generateStakeholderBriefing } from '../services/geminiService';

interface StakeholderMatrixProps {
  stakeholders: StakeholderRelationship[];
  onAddStakeholder: (stakeholder: Omit<StakeholderRelationship, 'id'>) => void;
  onUpdateHealthScore: (id: string, score: number) => void;
}

export const StakeholderMatrix: React.FC<StakeholderMatrixProps> = ({
  stakeholders,
  onAddStakeholder,
  onUpdateHealthScore
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<StakeholderRelationship['role']>('Gestor de Pessoas');
  const [organization, setOrganization] = useState('');
  const [actionItems, setActionItems] = useState('');

  // AI briefing state
  const [activeBriefingStakeholder, setActiveBriefingStakeholder] = useState<StakeholderRelationship | null>(null);
  const [briefingText, setBriefingText] = useState('');
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddStakeholder({
      name: name.trim(),
      role,
      organization: organization.trim() || 'Organização Interna',
      healthScore: 4,
      lastTouchpoint: 'Hoje',
      actionItems: actionItems.trim() || 'Alinhar prioridades e expectativas mútuas',
      talkingPoints: ['Metas do trimestre', 'Moral e saúde técnica do time', 'Próximos passos']
    });

    setName('');
    setOrganization('');
    setActionItems('');
  };

  const handleOpenAiBriefing = async (st: StakeholderRelationship) => {
    setActiveBriefingStakeholder(st);
    setIsLoadingBriefing(true);
    setBriefingText('');
    const result = await generateStakeholderBriefing(
      `${st.role} - ${st.name} (${st.organization})`,
      st.actionItems || 'Garantir alinhamento de roadmap e feedback mútuo'
    );
    setBriefingText(result);
    setIsLoadingBriefing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Matriz de Relacionamento: Gestores & Clientes</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Como Tech Lead, o sucesso da squad depende de pontes sólidas com os <strong className="text-purple-300">Gestores de Pessoas</strong> dos devs e com o <strong className="text-emerald-300">Cliente</strong> final. Monitore a saúde da relação e antecipe ruídos.
          </p>
        </div>
      </div>

      {/* Register New Stakeholder */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
          <Plus className="w-4 h-4 text-purple-400" />
          <span>Cadastrar Novo Stakeholder Estratégico</span>
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome (ex: Juliana Gerente de Conta)..."
            className="sm:col-span-4 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="sm:col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="Gestor de Pessoas">Gestor de Pessoas (People)</option>
            <option value="Cliente / Product Sponsor">Cliente / Product Sponsor</option>
            <option value="Dev Squad">Dev Squad</option>
            <option value="Gerente de Contas">Gerente de Contas</option>
            <option value="Cadeia de Apoio">Cadeia de Apoio</option>
          </select>

          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Área ou Empresa (ex: FinTech Cliente)..."
            className="sm:col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            className="sm:col-span-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center space-x-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      {/* Stakeholders Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stakeholders.map((st) => (
          <div
            key={st.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{st.name}</h4>
                  <p className="text-xs text-purple-300 font-medium">{st.role} • {st.organization}</p>
                </div>

                {/* Health Rating Stars */}
                <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 mr-1">Relação:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => onUpdateHealthScore(st.id, star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          star <= st.healthScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Item Box */}
              <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-indigo-300">Próxima Ação do Tech Lead:</span>
                <p className="mt-0.5">{st.actionItems}</p>
              </div>

              {/* Talking Points */}
              <div className="mt-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pontos de Pauta Sugeridos:
                </span>
                <ul className="mt-1 space-y-1">
                  {st.talkingPoints.map((pt, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Último contato: {st.lastTouchpoint}</span>
              <button
                onClick={() => handleOpenAiBriefing(st)}
                className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gerar Roteiro de Conversa (IA)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Briefing Modal */}
      {activeBriefingStakeholder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-400 font-bold">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base text-white">
                  Roteiro de Reunião com {activeBriefingStakeholder.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveBriefingStakeholder(null)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Orientações estratégicas geradas pelo Gemini 2.5 Flash para conduzir a conversa com assertividade e sem fricção.
            </p>

            {isLoadingBriefing ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span>Montando briefing de liderança...</span>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                {briefingText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
