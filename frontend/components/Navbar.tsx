import React from 'react';
import { 
  TabType 
} from '../types';
import { 
  LayoutDashboard, 
  Presentation, 
  Sparkles, 
  Users, 
  KanbanSquare, 
  GraduationCap, 
  CalendarDays,
  Compass,
  Wand2
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  openAiCopilot: () => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  openAiCopilot,
  pendingCount 
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number; highlight?: boolean }[] = [
    { id: 'cockpit', label: 'Cockpit Semanal', icon: <LayoutDashboard className="w-4 h-4" />, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'agenda_builder', label: 'Agenda Builder', icon: <Wand2 className="w-4 h-4 text-emerald-300" />, highlight: true },
    { id: 'weekly_slides', label: 'Slides da Weekly', icon: <Presentation className="w-4 h-4" /> },
    { id: 'mural_cadence', label: 'Cadence & Boards', icon: <KanbanSquare className="w-4 h-4 text-amber-400" /> },
    { id: 'events', label: 'Team Gatherings', icon: <CalendarDays className="w-4 h-4 text-emerald-400" /> },
    { id: 'guildas', label: 'Hub de Guildas', icon: <Compass className="w-4 h-4" /> },
    { id: 'stakeholders', label: 'Gestores & Clientes', icon: <Users className="w-4 h-4" /> },
    { id: 'initiatives_trainings', label: 'Treinamentos', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('cockpit')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 text-lg">TL</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">TechLead HQ</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  Cockpit da Squad
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Gestão técnica, ritos, cadeia de apoio & conexões</p>
            </div>
          </div>

          {/* Action Button: AI Copilot */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={openAiCopilot}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium shadow-md shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span className="hidden md:inline">Copilot Tech Lead</span>
              <span className="md:hidden">IA</span>
            </button>
          </div>
        </div>

        {/* Scrollable Nav Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60 text-sm">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium text-xs sm:text-sm ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : item.highlight
                    ? 'text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
