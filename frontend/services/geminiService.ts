import { GoogleGenAI } from '@google/genai';
import { SlideItem } from '../types';

// Initialize the GoogleGenAI client using pre-configured API_KEY and vertexai: true
const getAi = () => {
  return new GoogleGenAI({
    apiKey: process.env.API_KEY,
    vertexai: true
  });
};

export async function generateWeeklySlideContent(topicFocus: string, teamContext: string): Promise<string> {
  try {
    const ai = getAi();
    const prompt = `Você é um Tech Lead sênior e mentor exemplar.
Gere uma estrutura dinâmica para a reunião semanal (Weekly) da squad.
Foco principal desta semana: "${topicFocus}"
Contexto atual da squad: "${teamContext}"

Retorne uma estrutura pronta com 5 a 6 seções claras:
1. Abertura & Quebra-Gelo humano
2. Metas & Goals da Squad (comemorar vitórias e apontar gargalos)
3. Iniciativas da Empresa & Treinamentos recomendados
4. Estímulo à Guilda técnica (dica de como puxar voluntários)
5. Alinhamento de cadeia de apoio (lembrete de Mural/Publisher)
6. Próximos passos e evento de integração.

Escreva em Português do Brasil com tom motivador, objetivo, técnico e humano. Use marcadores (bullet points) limpos.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || 'Não foi possível gerar os slides. Tente novamente.';
  } catch (error) {
    console.error('Error generating slide content with Gemini:', error);
    return 'Erro ao comunicar com a IA do Gemini. Verifique a chave ou tente mais tarde.';
  }
}

export async function generateCustomWeeklyAgendaAI(
  selectedTopics: { title: string; notes?: string; durationMin: number }[],
  squadContext: {
    squadName: string;
    meetingDurationMin: number;
    tone: string;
    highlightOfWeek: string;
    upcomingGuilds: string[];
    activeTrainings: string[];
    muralTasks: string[];
    nextEvent?: string;
  }
): Promise<{ markdownNotes: string; slides: SlideItem[] }> {
  try {
    const ai = getAi();
    const prompt = `Você é um Tech Lead Staff conduzindo a reunião semanal (Weekly) da squad "${squadContext.squadName}".
Duração planejada: ${squadContext.meetingDurationMin} minutos.
Tom da reunião: ${squadContext.tone}.
Destaque/Marco da semana: "${squadContext.highlightOfWeek}".

Tópicos selecionados para a pauta:
${selectedTopics.map((t) => `- ${t.title} (~${t.durationMin}min): ${t.notes || 'Padrão'}`).join('\n')}

Dados reais do painel para enriquecer a pauta:
- Guildas ativas / Palestras de devs: ${squadContext.upcomingGuilds.length > 0 ? squadContext.upcomingGuilds.join(', ') : 'Incentivar novos palestrantes'}
- Treinamentos & Vouchers corporativos: ${squadContext.activeTrainings.length > 0 ? squadContext.activeTrainings.join(', ') : 'Relembrar trilhas disponíveis'}
- Atualizações de Mural & Publisher (Cadeia de apoio): ${squadContext.muralTasks.length > 0 ? squadContext.muralTasks.join(', ') : 'Verificar status com PO/SM'}
- Encontro Presencial / Team Building: ${squadContext.nextEvent || 'Propor data de almoço ou dia no escritório'}

Por favor, forneça a resposta em formato JSON estrito, sem tags markdown adicionais fora do JSON, no seguinte esquema:
{
  "markdownNotes": "Resumo completo da pauta formatado em Markdown com emojis, divisão de tempo (timebox), recados para copiar e colar no Slack/Teams",
  "slides": [
    {
      "order": 1,
      "title": "1. Nome do Slide",
      "category": "goals",
      "bulletPoints": ["Tópico 1", "Tópico 2", "Tópico 3"],
      "notes": "Notas de oratória para o Tech Lead falar em sala"
    }
  ]
}

As categorias de slide devem ser uma destas: "icebreaker" | "goals" | "initiatives" | "trainings" | "guildas" | "shoutouts" | "open_floor".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const raw = response.text ? response.text.trim() : '{}';
    const parsed = JSON.parse(raw);

    const slides: SlideItem[] = (parsed.slides || []).map((s: any, idx: number) => ({
      id: `ai_gen_${Date.now()}_${idx}`,
      order: s.order || idx + 1,
      title: s.title || `Slide ${idx + 1}`,
      category: s.category || 'goals',
      bulletPoints: Array.isArray(s.bulletPoints) ? s.bulletPoints : ['Ponto importante'],
      notes: s.notes || ''
    }));

    return {
      markdownNotes: parsed.markdownNotes || 'Pauta gerada com sucesso.',
      slides: slides.length > 0 ? slides : []
    };
  } catch (error) {
    console.error('Error generating custom weekly agenda with Gemini:', error);
    throw error;
  }
}

export async function generateGuildIncentivePitch(devName: string, featDone: string, guildName: string): Promise<string> {
  try {
    const ai = getAi();
    const prompt = `Você é um Tech Lead atencioso e empático.
Escreva uma mensagem acolhedora, animadora e persuasiva no WhatsApp/Slack para convidar o desenvolvedor(a) "${devName}" a apresentar uma palestra na "${guildName}".
Motivo / O que essa pessoa fez recentemente de destaque: "${featDone}".

Diretrizes:
- Reconheça o ótimo trabalho técnico dele(a).
- Desmistifique o medo de falar em público (ofereça ajuda para revisar os slides e ensaiar 15min antes).
- Destaque o benefício na carreira (visibilidade, promoção, reconhecimento perante gestores).
- Seja breve, caloroso e informal como um bom Tech Lead.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || 'Erro ao gerar texto.';
  } catch (error) {
    console.error('Error creating guild pitch:', error);
    return 'Não foi possível gerar a mensagem de incentivo. Verifique os parâmetros e tente novamente.';
  }
}

export async function generateStakeholderBriefing(stakeholderRole: string, currentStatus: string): Promise<string> {
  try {
    const ai = getAi();
    const prompt = `Como Tech Lead, crie um roteiro rápido (bullet points) para uma conversa estratégica com o seguinte stakeholder:
Tipo de Stakeholder: "${stakeholderRole}"
Situação / Desafios do momento: "${currentStatus}"

Oriente o Tech Lead com:
- O que falar para passar segurança e clareza
- Métricas e evidências que geram valor (velocidade, estabilidade, moral do time, negócios)
- Perguntas inteligentes a fazer para estreitar relacionamento e evitar surpresas
- Como blindar o time e ao mesmo tempo satisfazer expectativas do cliente/gestor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || 'Erro ao gerar o briefing.';
  } catch (error) {
    console.error('Error generating stakeholder briefing:', error);
    return 'Erro ao gerar briefing com a IA.';
  }
}
