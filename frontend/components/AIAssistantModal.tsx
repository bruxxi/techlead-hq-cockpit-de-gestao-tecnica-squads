import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Lightbulb, 
  Presentation, 
  Users 
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Olá, Tech Lead! Sou seu copiloto de gestão técnica com Gemini 2.5 Flash. Como posso te apoiar hoje? Posso montar a pauta da sua Weekly, criar argumentos para convencer devs a apresentarem guildas, cobrar a cadeia de apoio sobre o Mural/Publisher ou desenhar alinhamentos com clientes e gestores.'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.API_KEY,
        vertexai: true
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textToSend.trim(),
        config: {
          systemInstruction: 'Você é um Tech Lead Staff e mentor experiente em liderança técnica, agilidade, arquitetura e gestão de pessoas. Ajude o usuário com conselhos diretos, roteiros práticos em tópicos, mensagens amigáveis para Slack/Teams e foco em valor de negócio, estabilidade técnica e motivação da equipe.',
          temperature: 0.7
        }
      });

      const replyMsg: ChatMessage = {
        id: 'reply_' + Date.now(),
        sender: 'assistant',
        text: response.text || 'Não consegui obter uma resposta adequada. Tente reformular a pergunta.'
      };
      setMessages((prev) => [...prev, replyMsg]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMsg: ChatMessage = {
        id: 'error_' + Date.now(),
        sender: 'assistant',
        text: 'Desculpe, ocorreu um erro na comunicação com a API do Gemini. Verifique a conexão e tente novamente.'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'Montar pauta da Weekly com 5 slides focados em metas e celebração',
    'Mensagem amigável cobrando o PO para atualizar o Mural e Publisher',
    'Como destravar um dev tímido para apresentar na guilda backend?',
    'Roteiro para 1:1 com o Gestor de Pessoas sobre o crescimento do time'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>Copilot do Tech Lead</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-normal">
                  Gemini 2.5 Flash
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Auxílio em ritos, alinhamentos, slides e pessoas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-emerald-400 border border-slate-700'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap relative group ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  {m.text}

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white p-1"
                      title="Copiar texto"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 italic py-2">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Pensando como Tech Lead...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700/70 px-2.5 py-1 rounded-full text-[11px] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Pergunte qualquer coisa sobre liderança técnica, weekly ou squad..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
