import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  WeeklyChecklistItem, 
  SlideItem, 
  GuildTopic, 
  StakeholderRelationship, 
  SupportCadenceTask, 
  TrainingInitiative, 
  TeamEvent,
  SquadMemberRSVP 
} from './types';
import { 
  INITIAL_CHECKLIST, 
  INITIAL_SLIDES, 
  INITIAL_GUILDS, 
  INITIAL_STAKEHOLDERS, 
  INITIAL_CADENCE_TASKS, 
  INITIAL_TRAININGS, 
  INITIAL_EVENTS 
} from './constants';
import { Navbar } from './components/Navbar';
import { WeeklyCockpit } from './components/WeeklyCockpit';
import { WeeklyAgendaBuilder } from './components/WeeklyAgendaBuilder';
import { SlideDeckPlanner } from './components/SlideDeckPlanner';
import { GuildsHub } from './components/GuildsHub';
import { MuralPublisherChecklist } from './components/MuralPublisherChecklist';
import { StakeholderMatrix } from './components/StakeholderMatrix';
import { TrainingsInitiatives } from './components/TrainingsInitiatives';
import { TeamEventsPlanner } from './components/TeamEventsPlanner';
import { AIAssistantModal } from './components/AIAssistantModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cockpit');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // LocalStorage-backed state
  const [checklist, setChecklist] = useState<WeeklyChecklistItem[]>(() => {
    const saved = localStorage.getItem('tl_checklist');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  const [slides, setSlides] = useState<SlideItem[]>(() => {
    const saved = localStorage.getItem('tl_slides');
    return saved ? JSON.parse(saved) : INITIAL_SLIDES;
  });

  const [guilds, setGuilds] = useState<GuildTopic[]>(() => {
    const saved = localStorage.getItem('tl_guilds');
    return saved ? JSON.parse(saved) : INITIAL_GUILDS;
  });

  const [cadenceTasks, setCadenceTasks] = useState<SupportCadenceTask[]>(() => {
    const saved = localStorage.getItem('tl_cadence');
    return saved ? JSON.parse(saved) : INITIAL_CADENCE_TASKS;
  });

  const [stakeholders, setStakeholders] = useState<StakeholderRelationship[]>(() => {
    const saved = localStorage.getItem('tl_stakeholders');
    return saved ? JSON.parse(saved) : INITIAL_STAKEHOLDERS;
  });

  const [trainings, setTrainings] = useState<TrainingInitiative[]>(() => {
    const saved = localStorage.getItem('tl_trainings');
    return saved ? JSON.parse(saved) : INITIAL_TRAININGS;
  });

  const [events, setEvents] = useState<TeamEvent[]>(() => {
    const saved = localStorage.getItem('tl_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tl_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('tl_slides', JSON.stringify(slides));
  }, [slides]);

  useEffect(() => {
    localStorage.setItem('tl_guilds', JSON.stringify(guilds));
  }, [guilds]);

  useEffect(() => {
    localStorage.setItem('tl_cadence', JSON.stringify(cadenceTasks));
  }, [cadenceTasks]);

  useEffect(() => {
    localStorage.setItem('tl_stakeholders', JSON.stringify(stakeholders));
  }, [stakeholders]);

  useEffect(() => {
    localStorage.setItem('tl_trainings', JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem('tl_events', JSON.stringify(events));
  }, [events]);

  // Handlers
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddChecklist = (item: Omit<WeeklyChecklistItem, 'id'>) => {
    const newItem: WeeklyChecklistItem = {
      ...item,
      id: 'chk_' + Date.now()
    };
    setChecklist((prev) => [newItem, ...prev]);
  };

  const handleDeleteChecklist = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddGuildTopic = (topic: Omit<GuildTopic, 'id'>) => {
    const newTopic: GuildTopic = {
      ...topic,
      id: 'guild_' + Date.now()
    };
    setGuilds((prev) => [newTopic, ...prev]);
  };

  const handleUpdateGuildStatus = (id: string, status: GuildTopic['status']) => {
    setGuilds((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status } : g))
    );
  };

  const handleUpdateCadenceStatus = (id: string, status: SupportCadenceTask['status']) => {
    setCadenceTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, lastUpdated: 'Agora' } : t))
    );
  };

  const handleAddCadenceTask = (task: Omit<SupportCadenceTask, 'id'>) => {
    const newTask: SupportCadenceTask = {
      ...task,
      id: 'cad_' + Date.now()
    };
    setCadenceTasks((prev) => [newTask, ...prev]);
  };

  const handleAddStakeholder = (st: Omit<StakeholderRelationship, 'id'>) => {
    const newSt: StakeholderRelationship = {
      ...st,
      id: 'st_' + Date.now()
    };
    setStakeholders((prev) => [newSt, ...prev]);
  };

  const handleUpdateStakeholderScore = (id: string, healthScore: number) => {
    setStakeholders((prev) =>
      prev.map((s) => (s.id === id ? { ...s, healthScore } : s))
    );
  };

  const handleAddTraining = (tr: Omit<TrainingInitiative, 'id'>) => {
    const newTr: TrainingInitiative = {
      ...tr,
      id: 'tr_' + Date.now()
    };
    setTrainings((prev) => [newTr, ...prev]);
  };

  const handleAddEvent = (ev: Omit<TeamEvent, 'id'>) => {
    const newEv: TeamEvent = {
      ...ev,
      id: 'ev_' + Date.now()
    };
    setEvents((prev) => [newEv, ...prev]);
  };

  const handleUpdateEventRSVP = (eventId: string, memberId: string, status: SquadMemberRSVP['status']) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const updatedRsvps = ev.rsvps.map((m) => (m.id === memberId ? { ...m, status } : m));
        const confirmed = updatedRsvps.filter((m) => m.status === 'confirmado').length;
        const totalEstimated = confirmed * (ev.budgetPerPerson || 0);
        return {
          ...ev,
          rsvps: updatedRsvps,
          totalEstimatedBudget: totalEstimated
        };
      })
    );
  };

  const handleApplyGeneratedSlides = (newSlides: SlideItem[]) => {
    setSlides(newSlides);
  };

  const pendingChecklistCount = checklist.filter((i) => !i.completed).length;

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiCopilot={() => setIsAiModalOpen(true)}
        pendingCount={pendingChecklistCount}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {activeTab === 'cockpit' && (
          <WeeklyCockpit
            checklist={checklist}
            onToggleChecklist={handleToggleChecklist}
            onAddChecklist={handleAddChecklist}
            onDeleteChecklist={handleDeleteChecklist}
            setActiveTab={setActiveTab}
            openAiCopilot={() => setIsAiModalOpen(true)}
          />
        )}

        {activeTab === 'agenda_builder' && (
          <WeeklyAgendaBuilder
            guilds={guilds}
            trainings={trainings}
            cadenceTasks={cadenceTasks}
            events={events}
            onApplyGeneratedSlides={handleApplyGeneratedSlides}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'weekly_slides' && (
          <SlideDeckPlanner
            slides={slides}
            onUpdateSlides={setSlides}
            onOpenAgendaBuilder={() => setActiveTab('agenda_builder')}
          />
        )}

        {activeTab === 'mural_cadence' && (
          <MuralPublisherChecklist
            tasks={cadenceTasks}
            onUpdateTaskStatus={handleUpdateCadenceStatus}
            onAddTask={handleAddCadenceTask}
          />
        )}

        {activeTab === 'events' && (
          <TeamEventsPlanner
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEventRSVP={handleUpdateEventRSVP}
          />
        )}

        {activeTab === 'guildas' && (
          <GuildsHub
            guilds={guilds}
            onAddGuildTopic={handleAddGuildTopic}
            onUpdateGuildStatus={handleUpdateGuildStatus}
          />
        )}

        {activeTab === 'stakeholders' && (
          <StakeholderMatrix
            stakeholders={stakeholders}
            onAddStakeholder={handleAddStakeholder}
            onUpdateHealthScore={handleUpdateStakeholderScore}
          />
        )}

        {activeTab === 'initiatives_trainings' && (
          <TrainingsInitiatives
            trainings={trainings}
            onAddTraining={handleAddTraining}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>TechLead HQ • Cockpit de Gestão Técnica • Potencializado com Gemini 2.5 Flash</p>
      </footer>

      {/* Global AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};

export default App;
