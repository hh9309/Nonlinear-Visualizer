
import React from 'react';
import { Sparkles, Loader2, Settings, Cpu, BrainCircuit, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AISettings, AIModel } from '../types';

interface InsightPanelProps {
  insight?: string;
  loading: boolean;
  settings: AISettings;
  onOpenSettings: () => void;
  onGenerate: () => void;
  canGenerate: boolean;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ insight, loading, settings, onOpenSettings, onGenerate, canGenerate }) => {
  if (loading) {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="p-4 bg-white rounded-2xl shadow-xl shadow-indigo-100">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-indigo-900 font-black text-xl tracking-tight">AI 洞察分析生成中...</p>
          <p className="text-indigo-400 text-sm font-medium mt-1">正在调用 {settings.model === AIModel.GEMINI ? 'Google Gemini' : 'DeepSeek'} 进行数学逻辑推理</p>
        </div>
      </div>
    );
  }

  return (
    <div id="ai-insight-module" className="bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden animate-in zoom-in-95 duration-700">
      <div className="bg-slate-900 px-8 py-5 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-lg tracking-tight leading-none">AI 洞察分析</h3>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1 inline-block">Optimization & Insight Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
              {settings.model === AIModel.GEMINI ? 'Gemini 3.0 Pro' : 'DeepSeek Engine'}
            </span>
          </div>
          <button 
            onClick={onOpenSettings}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all group active:scale-95 border border-slate-700"
            title="配置大语言模型"
          >
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>
      
      {insight ? (
        <div className="relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <BrainCircuit className="w-64 h-64" />
          </div>
          
          <div className="p-10 prose prose-indigo max-w-none relative z-10">
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg font-medium tracking-tight">
               <ReactMarkdown>{insight}</ReactMarkdown>
            </div>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-4">
               <span>Mode: Expert Analysis</span>
               <span className="w-px h-3 bg-slate-200"></span>
               <span>Engine: {settings.model}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>分析报告已就绪</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-slate-50/30 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200 flex items-center justify-center mb-6 border border-slate-100 group">
            <BrainCircuit className="w-10 h-10 text-slate-200 group-hover:text-indigo-400 transition-colors" />
          </div>
          <h4 className="text-slate-800 font-black text-xl mb-2">准备进行深度洞察分析</h4>
          <p className="text-slate-400 font-medium max-w-xs mx-auto mb-8">
            {canGenerate ? '数学模型已加载，现在可以启动 AI 专家级深度分析。' : '请先在上方点击“执行求解”以初始化数学模型数据。'}
          </p>
          
          <button
            onClick={onGenerate}
            disabled={!canGenerate}
            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-95 ${
              canGenerate 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none grayscale'
            }`}
          >
            <Zap className={`w-5 h-5 ${canGenerate ? 'fill-current text-yellow-300' : ''}`} />
            开始 AI 专家洞察
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightPanel;
