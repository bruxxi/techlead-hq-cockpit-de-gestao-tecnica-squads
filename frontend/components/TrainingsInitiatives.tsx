import React, { useState } from 'react';
import { TrainingInitiative } from '../types';
import { 
  GraduationCap, 
  Plus, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

interface TrainingsInitiativesProps {
  trainings: TrainingInitiative[];
  onAddTraining: (training: Omit<TrainingInitiative, 'id'>) => void;
}

export const TrainingsInitiatives: React.FC<TrainingsInitiativesProps> = ({
  trainings,
  onAddTraining
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TrainingInitiative['type']>('treinamento');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTraining({
      title: title.trim(),
      type,
      description: description.trim() || 'Disponível na plataforma corporativa',
      targetAudience: audience.trim() || 'Toda a squad',
      deadline: deadline.trim() || 'Contínuo',
      status: 'ativo'
    });

    setTitle('');
    setDescription('');
    setAudience('');
    setDeadline('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Treinamentos, Upskilling & Iniciativas da Empresa</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Catálogo de cursos internos, certificações patrocinadas e programas institucionais prontos para serem apresentados na Weekly.
          </p>
        </div>
      </div>

      {/* Add New Training */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
          <Plus className="w-4 h-4 text-sky-400" />
          <span>Cadastrar Novo Treinamento ou Iniciativa</span>
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome do curso / iniciativa (ex: Formação em Kafka)..."
            className="sm:col-span-5 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="sm:col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="treinamento">Treinamento / Certificação</option>
            <option value="iniciativa_empresa">Iniciativa Corporativa</option>
            <option value="meta_squad">Meta Técnica da Squad</option>
          </select>

          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Público-alvo (ex: Devs Backend)..."
            className="sm:col-span-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />

          <button
            type="submit"
            className="sm:col-span-2 bg-sky-600 hover:bg-sky-500 text-white font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center space-x-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      {/* Grid of Trainings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trainings.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {item.type === 'treinamento' ? 'Treinamento' : item.type === 'iniciativa_empresa' ? 'Iniciativa' : 'Meta Squad'}
              </span>

              <h4 className="text-sm font-bold text-white mt-2">{item.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <p>🎯 Público: <span className="text-slate-200">{item.targetAudience}</span></p>
              {item.deadline && <p>⏳ Prazo: <span className="text-amber-300">{item.deadline}</span></p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
