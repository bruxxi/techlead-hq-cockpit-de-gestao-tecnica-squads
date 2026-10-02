import React, { useState } from 'react';
import { SlideItem } from '../types';
import { 
  Presentation, 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  Check, 
  MonitorPlay, 
  X,
  Layers,
  FileText,
  Wand2
} from 'lucide-react';
import { generateWeeklySlideContent } from '../services/geminiService';

interface SlideDeckPlannerProps {
  slides: SlideItem[];
  onUpdateSlides: (slides: SlideItem[]) => void;
  onOpenAgendaBuilder?: () => void;
}

export const SlideDeckPlanner: React.FC<SlideDeckPlannerProps> = ({ 
  slides, 
  onUpdateSlides,
  onOpenAgendaBuilder 
}) => {
  const [selectedSlideId, setSelectedSlideId] = useState<string>(slides[0]?.id || '');
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResultText, setAiResultText] = useState<string | null>(null);

  const selectedSlide = slides.find((s) => s.id === selectedSlideId) || slides[0];

  const handleUpdateBullet = (bulletIndex: number, text: string) => {
    if (!selectedSlide) return;
    const updatedBullets = [...selectedSlide.bulletPoints];
    updatedBullets[bulletIndex] = text;
    
    const updated = slides.map((s) => 
      s.id === selectedSlide.id ? { ...s, bulletPoints: updatedBullets } : s
    );
    onUpdateSlides(updated);
  };

  const handleAddBullet = () => {
    if (!selectedSlide) return;
    const updated = slides.map((s) => 
      s.id === selectedSlide.id 
        ? { ...s, bulletPoints: [...s.bulletPoints, 'Novo ponto a discutir...'] } 
        : s
    );
    onUpdateSlides(updated);
  };

  const handleDeleteBullet = (bulletIndex: number) => {
    if (!selectedSlide) return;
    const updatedBullets = selectedSlide.bulletPoints.filter((_, idx) => idx !== bulletIndex);
    const updated = slides.map((s) => 
      s.id === selectedSlide.id ? { ...s, bulletPoints: updatedBullets } : s
    );
    onUpdateSlides(updated);
  };

  const handleUpdateNotes = (notes: string) => {
    if (!selectedSlide) return;
    const updated = slides.map((s) => 
      s.id === selectedSlide.id ? { ...s, notes } : s
    );
    onUpdateSlides(updated);
  };

  const handleAddSlide = () => {
    const newSlide: SlideItem = {
      id: 'slide_' + Date.now(),
      order: slides.length + 1,
      title: `${slides.length + 1}. Novo Slide de Pauta`,
      category: 'initiatives',
      bulletPoints: ['Ponto de discussão 1', 'Ponto de discussão 2'],
      notes: 'Notas do Tech Lead para guiar a fala.'
    };
    const newSlides = [...slides, newSlide];
    onUpdateSlides(newSlides);
    setSelectedSlideId(newSlide.id);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    const filtered = slides.filter((s) => s.id !== id);
    onUpdateSlides(filtered);
    if (selectedSlideId === id) {
      setSelectedSlideId(filtered[0]?.id || '');
    }
  };

  const handleGenerateAiSlides = async () => {
    setIsGenerating(true);
    setAiResultText(null);
    const result = await generateWeeklySlideContent(
      aiTopic || 'Status geral de entregas, dívidas técnicas, e incentivo a guildas',
      'Squad ágil trabalhando em arquitetura de microsserviços com relacionamento forte com gestor e cliente'
    );
    setAiResultText(result);
    setIsGenerating(false);
  };

  const handleCopyMarkdownDeck = () => {
    const fullText = slides.map((s) => `### ${s.title}\n${s.bulletPoints.map(b => `- ${b}`).join('\n')}\n${s.notes ? `*Notas:* ${s.notes}\n` : ''}`).join('\n---\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header with quick presentation launch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Presentation className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Montador de Slides & Pauta da Weekly</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mantenha o time engajado com uma reunião objetiva, clara sobre os goals, iniciativas, treinamentos e guildas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenAgendaBuilder && (
            <button
              onClick={onOpenAgendaBuilder}
              className="flex items-center space-x-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              <Wand2 className="w-4 h-4 text-emerald-400" />
              <span>Agenda Builder</span>
            </button>
          )}

          <button
            onClick={handleCopyMarkdownDeck}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Pauta (Markdown)'}</span>
          </button>

          <button
            onClick={() => {
              setPresentationIndex(0);
              setIsPresentationOpen(true);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Modo Apresentação (Ao Vivo)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Slide Thumbnails, Right Slide Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Thumbnails List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Slides da Reunião ({slides.length})</span>
            <button
              onClick={handleAddSlide}
              className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Slide</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {slides.map((slide, index) => {
              const isSelected = slide.id === selectedSlideId;
              return (
                <div
                  key={slide.id}
                  onClick={() => setSelectedSlideId(slide.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Slide {index + 1}
                    </span>
                    {slides.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(slide.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1 line-clamp-1">{slide.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {slide.bulletPoints[0] || 'Sem pontos definidos'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* AI Generator Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ideias com Gemini 2.5 Flash</span>
            </div>
            <p className="text-xs text-slate-400">
              Precisa de inspiração para a pauta desta semana?
            </p>
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Ex: Reforçar prazos e incentivar guildas..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerateAiSlides}
              disabled={isGenerating}
              className="w-full bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <span>Criando com IA...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gerar Pauta Personalizada</span>
                </>
              )}
            </button>

            {aiResultText && (
              <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                {aiResultText}
              </div>
            )}
          </div>
        </div>

        {/* Right Slide Canvas / Editor */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between min-h-[480px]">
          {selectedSlide ? (
            <div className="space-y-6">
              {/* Slide Title Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Título do Slide
                </label>
                <input
                  type="text"
                  value={selectedSlide.title}
                  onChange={(e) => {
                    const updated = slides.map((s) => 
                      s.id === selectedSlide.id ? { ...s, title: e.target.value } : s
                    );
                    onUpdateSlides(updated);
                  }}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-base font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Bullet Points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Tópicos de Apresentação (Bullet Points)
                  </label>
                  <button
                    onClick={handleAddBullet}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Tópico</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {selectedSlide.bulletPoints.map((bullet, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                        className="flex-1 bg-slate-800/60 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleDeleteBullet(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Lead Speaker Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Notas de Fala do Tech Lead (visível apenas para você)
                </label>
                <textarea
                  value={selectedSlide.notes || ''}
                  onChange={(e) => handleUpdateNotes(e.target.value)}
                  placeholder="Lembretes pessoais: citar o nome de quem se destacou, enfatizar que falar em guilda conta para a promoção..."
                  rows={3}
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              Selecione um slide para editar
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Dica: Use tópicos curtos nos slides para reter a atenção do time e detalhe na sua fala oral.</span>
            <button
              onClick={() => {
                setPresentationIndex(slides.findIndex((s) => s.id === selectedSlideId));
                setIsPresentationOpen(true);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Testar visualização
            </button>
          </div>
        </div>
      </div>

      {/* Presentation Fullscreen Modal */}
      {isPresentationOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 sm:p-12 animate-in fade-in duration-200">
          {/* Top Presentation Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2.5 py-1 rounded font-bold">
                Slide {presentationIndex + 1} de {slides.length}
              </span>
              <span className="text-slate-400 text-xs">Reunião Weekly da Squad</span>
            </div>

            <button
              onClick={() => setIsPresentationOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Slide Center Stage */}
          <div className="max-w-4xl mx-auto w-full my-auto py-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight mb-8">
              {slides[presentationIndex]?.title}
            </h1>

            <div className="space-y-4">
              {slides[presentationIndex]?.bulletPoints.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <p className="text-lg sm:text-xl text-slate-100 font-medium leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {slides[presentationIndex]?.notes && (
              <div className="mt-8 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm">
                <strong>Notas do Tech Lead:</strong> {slides[presentationIndex].notes}
              </div>
            )}
          </div>

          {/* Bottom Presentation Controls */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              onClick={() => setPresentationIndex((prev) => Math.max(0, prev - 1))}
              disabled={presentationIndex === 0}
              className="flex items-center space-x-2 text-slate-300 hover:text-white disabled:opacity-30 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </button>

            <span className="text-xs text-slate-500">
              Pressione as setas para navegar
            </span>

            <button
              onClick={() => setPresentationIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={presentationIndex === slides.length - 1}
              className="flex items-center space-x-2 text-slate-300 hover:text-white disabled:opacity-30 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <span>Próximo</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
