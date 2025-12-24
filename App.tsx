
import React, { useState } from 'react';
import { Activity, Bell, BookOpen, Menu, X, FileText, Users } from 'lucide-react';
import NLPModule from './components/NLPModule';
import SettingsModal from './components/SettingsModal';
import KnowledgeModule from './components/KnowledgeModule';
import DocsModule from './components/DocsModule';
import ExpertsModule from './components/ExpertsModule';
import { AISettings, AIModel } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'nlp' | 'knowledge' | 'docs' | 'experts'>('nlp');
  const [solveStatus, setSolveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [aiSettings, setAiSettings] = useState<AISettings>({
    model: AIModel.GEMINI
  });

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* 侧边栏 */}
      <aside className={`fixed lg:relative z-20 h-full bg-white border-r border-slate-200 w-72 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => setCurrentView('nlp')}>
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200 transition-transform group-hover:scale-110">
                <Activity className="text-white w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Smart Lab</h1>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 inline-block">Professional Ver</span>
              </div>
            </div>

            <nav className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 ml-4">核心求解</p>
              <button 
                onClick={() => { setCurrentView('nlp'); setSolveStatus('idle'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'nlp' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 font-bold' : 'text-slate-500 hover:bg-slate-50 font-medium'}`}
              >
                <Activity className="w-5 h-5" />
                <span>NLP 非线性规划</span>
              </button>
              
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 mt-8 ml-4">知识仓库</p>
              <button 
                onClick={() => setCurrentView('experts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'experts' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 font-bold' : 'text-slate-500 hover:bg-slate-50 font-medium'}`}
              >
                <Users className="w-5 h-5" />
                <span>运筹学大家</span>
              </button>
              <button 
                onClick={() => setCurrentView('knowledge')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'knowledge' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 font-bold' : 'text-slate-500 hover:bg-slate-50 font-medium'}`}
              >
                <BookOpen className="w-5 h-5" />
                <span>算法百科</span>
              </button>
            </nav>

            <div className="mt-8 space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 ml-4">系统支持</p>
               <button 
                onClick={() => setCurrentView('docs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'docs' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 font-bold' : 'text-slate-500 hover:bg-slate-50 font-medium'}`}
               >
                 <FileText className="w-5 h-5" />
                 <span>算法说明文档</span>
               </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 主界面 */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
               {isSidebarOpen ? <X /> : <Menu />}
             </button>
             <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Workspace</span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  {currentView === 'nlp' && 'Non-Linear Solver'}
                  {currentView === 'knowledge' && 'Wiki'}
                  {currentView === 'docs' && 'Documentation'}
                  {currentView === 'experts' && 'Experts'}
                </span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className={`p-3 rounded-xl transition-all relative ${
               solveStatus === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
               solveStatus === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 
               'text-slate-400 hover:bg-slate-100 bg-white border border-slate-100'
             }`}>
               <Bell className={`w-5 h-5 ${solveStatus === 'error' ? 'animate-bounce' : ''}`} />
               {solveStatus !== 'idle' && (
                 <span className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                   solveStatus === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                 }`} />
               )}
             </button>
             {/* 此处设置图标已移除，符合用户要求 */}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
           {currentView === 'nlp' && (
             <>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">非线性规划工作台</h2>
               <NLPModule 
                 settings={aiSettings} 
                 onOpenSettings={() => setIsSettingsOpen(true)} 
                 onSolveStatusChange={setSolveStatus}
               />
             </>
           )}
           {currentView === 'knowledge' && <KnowledgeModule />}
           {currentView === 'docs' && <DocsModule />}
           {currentView === 'experts' && <ExpertsModule />}
        </div>

        <footer className="mt-12 py-10 px-8 border-t border-slate-200/50 text-center bg-white/50">
           <p className="text-slate-400 text-xs font-medium tracking-tight">
             © 2025 Smart Lab AI Optimization Engine. 驱动于下一代运筹学推理技术。
           </p>
        </footer>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={aiSettings}
        onSave={setAiSettings}
      />
    </div>
  );
};

export default App;
