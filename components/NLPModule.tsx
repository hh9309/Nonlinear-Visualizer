
import React, { useState } from 'react';
import { StepForward, Calculator, Plus, Trash2, Sliders, CheckCircle, BarChart3, Target, Zap, Info, Award, CheckCircle2, RefreshCcw, AlertCircle, TrendingUp } from 'lucide-react';
import MathDisplay from './MathDisplay';
import NLPVisualizer from './NLPVisualizer';
import { solveNLP, getAIInsight } from '../services/aiService';
import { SolverStep, AISettings, OptimizationGoal } from '../types';
import InsightPanel from './InsightPanel';

interface NLPModuleProps {
  settings: AISettings;
  onOpenSettings: () => void;
  onSolveStatusChange: (status: 'idle' | 'success' | 'error') => void;
}

const NLPModule: React.FC<NLPModuleProps> = ({ settings, onOpenSettings, onSolveStatusChange }) => {
  const [goal, setGoal] = useState<OptimizationGoal>('min');
  const [objective, setObjective] = useState('(x-2)^2 + (y-3)^2');
  const [constraints, setConstraints] = useState<string[]>(['x + y <= 4', 'x >= 0', 'y >= 0']);
  
  // 确认后的模型状态，用于绘图和求解引擎
  const [finalObjective, setFinalObjective] = useState('(x-2)^2 + (y-3)^2');
  const [finalConstraints, setFinalConstraints] = useState<string[]>(['x + y <= 4', 'x >= 0', 'y >= 0']);
  const [finalGoal, setFinalGoal] = useState<OptimizationGoal>('min');
  const [modelConfirmed, setModelConfirmed] = useState(true);

  const [steps, setSteps] = useState<SolverStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string>();
  const [insightLoading, setInsightLoading] = useState(false);

  // 建模完成：锁定当前模型定义，并更新可视化图表
  const handleCompleteModeling = () => {
    setFinalObjective(objective);
    setFinalConstraints([...constraints]);
    setFinalGoal(goal);
    setModelConfirmed(true);
    
    // 重置之前的求解结果
    setSteps([]);
    setCurrentStep(-1);
    setInsight(undefined);
    onSolveStatusChange('idle');
  };

  // 开始符号推理推导
  const handleSolve = async () => {
    if (!modelConfirmed) {
        handleCompleteModeling();
    }
    setLoading(true);
    setInsight(undefined); 
    onSolveStatusChange('idle');
    
    try {
      const solveResult = await solveNLP(settings, finalGoal, finalObjective, finalConstraints);
      setSteps(solveResult);
      setCurrentStep(0);
      onSolveStatusChange('success');
    } catch (err: any) {
      console.error(err);
      onSolveStatusChange('error');
      if (err.message === "KEY_NOT_FOUND") {
        alert("API 密钥无效或已过期，请重新配置。");
        onOpenSettings();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    if (!finalObjective) return;
    setInsightLoading(true);
    try {
      const insightResult = await getAIInsight(settings, finalGoal, `目标: ${finalObjective}, 约束: ${finalConstraints.join(', ')}`);
      setInsight(insightResult);
    } catch (err: any) {
      console.error(err);
      if (err.message === "KEY_NOT_FOUND") {
        onOpenSettings();
      }
    } finally {
      setInsightLoading(false);
    }
  };

  const isLastStepRevealed = currentStep === steps.length - 1;
  const hasChanges = (objective !== finalObjective || JSON.stringify(constraints) !== JSON.stringify(finalConstraints) || goal !== finalGoal);

  // 解析最后一步的结果
  const getFinalResultInfo = () => {
    if (steps.length === 0) return null;
    const finalStep = steps[steps.length - 1];
    const content = finalStep.content || '';
    
    // 尝试识别格式: (x*, y*) = ..., f* = ...
    const parts = content.split(',');
    if (parts.length >= 2 && content.includes('=') && content.includes('(')) {
      return {
        type: 'success' as const,
        point: parts[0].trim(),
        value: parts[1].trim(),
        explanation: finalStep.explanation
      };
    }
    
    // 否则认为是无解或无界等文本结论
    return {
      type: 'message' as const,
      text: content,
      explanation: finalStep.explanation
    };
  };

  const finalResult = getFinalResultInfo();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* 核心板块：建模与控制 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 flex flex-col transition-all hover:shadow-md h-full min-h-[420px]">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner">
                <Calculator className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">1. 建模配置 (Standard Form)</h3>
            </div>
            
            <button 
              onClick={handleCompleteModeling}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[11px] whitespace-nowrap transition-all active:scale-95 ${
                !hasChanges
                  ? 'bg-slate-100 text-slate-400 cursor-default' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
              }`}
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${hasChanges ? 'animate-spin-slow' : ''}`} />
              建模完成并刷新图
            </button>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 tracking-[3px] text-center">优化目标与函数 (Objective)</label>
              <div className="flex gap-3">
                <select 
                  value={goal}
                  onChange={(e) => {
                      setGoal(e.target.value as OptimizationGoal);
                      setModelConfirmed(false);
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-lg outline-none cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  <option value="min">min</option>
                  <option value="max">max</option>
                </select>
                <input 
                  value={objective}
                  onChange={e => {
                      setObjective(e.target.value);
                      setModelConfirmed(false);
                  }}
                  className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-mono text-indigo-700 transition-all text-2xl font-bold text-center shadow-inner"
                  placeholder="f(x, y)..."
                />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex-1 mt-2 flex flex-col">
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 tracking-[3px] text-center">约束集合 (Feasible Set)</label>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[120px] max-h-[200px]">
                {constraints.map((c, i) => (
                  <div key={i} className="flex gap-4 animate-in slide-in-from-right-1">
                    <input 
                      value={c}
                      onChange={e => {
                        const newC = [...constraints];
                        newC[i] = e.target.value;
                        setConstraints(newC);
                        setModelConfirmed(false);
                      }}
                      className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-lg font-bold outline-none transition-all focus:ring-2 focus:ring-indigo-100 shadow-sm"
                      placeholder="x + y <= 4"
                    />
                    <button onClick={() => {
                        setConstraints(constraints.filter((_, idx) => idx !== i));
                        setModelConfirmed(false);
                    }} className="text-slate-300 p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                    setConstraints([...constraints, '']);
                    setModelConfirmed(false);
                }}
                className="mt-4 mx-auto text-indigo-600 text-xs font-black uppercase tracking-[2px] flex items-center gap-3 hover:bg-white px-6 py-3 rounded-2xl transition-all border border-dashed border-indigo-200 bg-white/50 w-full justify-center"
              >
                <Plus className="w-5 h-5" /> 添加新约束
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 flex flex-col transition-all hover:shadow-md h-full min-h-[420px]">
          <div className="flex items-center gap-4 mb-6 shrink-0">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">2. 智能求解引擎</h3>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex-1 flex flex-col justify-center min-h-[200px]">
              <label className="block text-xs font-black text-slate-400 uppercase mb-4 tracking-[3px] text-center">AI 引擎实时状态</label>
              <div className="flex items-center justify-center gap-5 p-5 bg-white rounded-[1.5rem] border border-slate-200 mb-5 shadow-sm">
                <div className={`w-4 h-4 rounded-full ${loading ? 'bg-amber-500 animate-bounce' : 'bg-emerald-500 animate-pulse'} shadow-[0_0_12px_rgba(16,185,129,0.6)]`}></div>
                <span className="text-sm font-black text-slate-700 uppercase tracking-widest">
                    {loading ? 'Solver Engine : Thinking' : 'Optimizer Core : Active'}
                </span>
              </div>
              <div className="p-5 rounded-[1.5rem] bg-indigo-50/50 border border-indigo-100 text-center">
                <p className="text-slate-700 text-lg font-bold leading-relaxed italic">
                  系统将依据建模定义，自动完成几何分析与符号展开。
                  <br/>
                  <span className="text-indigo-600 font-black">当前锁定目标：{finalGoal === 'min' ? '寻求极小值 (Minimize)' : '寻求极大值 (Maximize)'}</span>
                </p>
              </div>
            </div>

            <button 
              onClick={handleSolve}
              disabled={loading || !finalObjective}
              className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-2xl hover:bg-black shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-5 active:scale-[0.98] disabled:opacity-50 mt-6 shrink-0"
            >
              {loading ? <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full" /> : <Zap className="w-7 h-7 fill-yellow-400 text-yellow-400" />}
              开始符号推理推导
            </button>
          </div>
        </div>
      </div>

      {/* 函数空间几何解析 */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <Sliders className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">几何投影与拓扑分析</h3>
          </div>
          <div className="flex items-center gap-2">
            {!modelConfirmed && (
                <span className="text-[10px] font-black text-amber-500 animate-pulse uppercase tracking-[2px] mr-2">模型已更改，请点击“建模完成并刷新图”同步视图</span>
            )}
            <span className="px-4 py-1.5 bg-indigo-50 rounded-xl text-xs font-black text-indigo-600 uppercase tracking-[3px]">Visual Analytics</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[540px]">
          <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 relative flex flex-col shadow-inner overflow-hidden h-full">
            <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-[2px] z-10 flex items-center gap-3 shrink-0">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> 可行域等值线图 (Contour)
            </div>
            <div className="flex-1 w-full p-3">
              <NLPVisualizer objective={finalObjective} type="contour" constraints={finalConstraints} />
            </div>
          </div>
          <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 relative flex flex-col shadow-inner overflow-hidden h-full">
            <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-[2px] z-10 flex items-center gap-3 shrink-0">
              <Target className="w-5 h-5 text-emerald-500" /> 3D 目标函数曲面 (Surface)
            </div>
            <div className="flex-1 w-full p-3">
              <NLPVisualizer objective={finalObjective} type="surface" constraints={finalConstraints} />
            </div>
          </div>
        </div>
      </div>

      {/* 推导步骤 */}
      {steps.length > 0 && (
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
          <div className="px-10 py-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100">AI</div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">数学逻辑推导路径</h3>
            </div>
            <button 
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={isLastStepRevealed}
              className="bg-indigo-600 text-white px-8 py-3 rounded-[1.25rem] font-black text-sm flex items-center gap-3 hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              {isLastStepRevealed ? '已到达最终结论' : '推导下一步'} <StepForward className="w-5 h-5" />
            </button>
          </div>

          <div className="p-10 space-y-8 max-w-6xl mx-auto overflow-y-auto max-h-[700px] custom-scrollbar">
            {steps.slice(0, currentStep + 1).map((step, i) => {
              const isLast = i === steps.length - 1;
              const hasContent = step.content && step.content.trim().length > 0 && 
                                !['无', 'none', 'null', '','undefined'].includes(step.content.trim().toLowerCase());
              
              return (
                <div key={i} className={`flex gap-8 animate-in slide-in-from-left-4 duration-300 ${isLast ? 'bg-indigo-50/60 p-8 rounded-[3rem] border border-indigo-100 shadow-sm' : 'pb-6'}`}>
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center text-sm font-black shadow-md ${isLast ? 'bg-indigo-600 text-white' : 'bg-white border border-indigo-200 text-indigo-600'}`}>
                      {isLast ? <CheckCircle className="w-5 h-5" /> : i + 1}
                    </div>
                    {!isLast && <div className="w-0.5 h-full bg-slate-100 my-3"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xl font-black mb-4 flex items-center gap-4 ${isLast ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {step.title}
                    </h4>
                    
                    {hasContent && (
                      <div className={`mb-5 px-8 py-5 rounded-[1.5rem] border ${isLast ? 'bg-white border-indigo-200' : 'bg-slate-50 border-slate-100'} text-indigo-900 shadow-inner overflow-x-auto`}>
                        <MathDisplay math={step.content} block />
                      </div>
                    )}
                    
                    <div className={`p-6 rounded-[1.5rem] ${isLast ? 'bg-white text-slate-800' : 'bg-white text-slate-700'} border-l-[6px] border-indigo-500 shadow-sm`}>
                      <p className="leading-relaxed text-[17px] font-bold">
                        {step.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 结果输出卡片：当推导完成时显示 */}
            {isLastStepRevealed && finalResult && (
              <div className="mt-12 animate-in zoom-in-95 duration-500">
                <div className={`rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border-4 ${finalResult.type === 'success' ? 'bg-slate-900 border-indigo-500/30' : 'bg-rose-950 border-rose-500/30'}`}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${finalResult.type === 'success' ? 'bg-indigo-500 shadow-indigo-500/50' : 'bg-rose-500 shadow-rose-500/50'}`}>
                          {finalResult.type === 'success' ? <Award className="w-8 h-8 text-white" /> : <AlertCircle className="w-8 h-8 text-white" />}
                       </div>
                       <div>
                          <h4 className="text-3xl font-black tracking-tight">求解最终报告</h4>
                          <p className={`text-xs font-black uppercase tracking-[4px] mt-1 ${finalResult.type === 'success' ? 'text-indigo-400' : 'text-rose-400'}`}>
                            {finalResult.type === 'success' ? 'Optimization Result Found' : 'No Optimal Solution Found'}
                          </p>
                       </div>
                    </div>

                    {finalResult.type === 'success' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-4">
                               <Target className="w-4 h-4 text-indigo-400" />
                               <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px]">最优解坐标 (Point)</p>
                            </div>
                            <div className="text-4xl font-black text-indigo-300">
                               <MathDisplay math={finalResult.point} />
                            </div>
                         </div>
                         <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-4">
                               <TrendingUp className="w-4 h-4 text-emerald-400" />
                               <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px]">最优函数值 (Value)</p>
                            </div>
                            <div className="text-4xl font-black text-emerald-400">
                               <MathDisplay math={finalResult.value} />
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 backdrop-blur-sm text-center">
                         <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-4">分析结论 (Conclusion)</p>
                         <div className="text-3xl font-black text-rose-300">
                            <MathDisplay math={finalResult.text} />
                         </div>
                      </div>
                    )}

                    <div className="mt-8 flex items-start gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                       <div className="mt-1">
                          <Info className={`w-6 h-6 flex-shrink-0 ${finalResult.type === 'success' ? 'text-indigo-400' : 'text-rose-400'}`} />
                       </div>
                       <div className="text-sm font-medium text-slate-300 leading-relaxed">
                          {finalResult.explanation}
                       </div>
                    </div>
                  </div>
                  <Target className="absolute -bottom-16 -right-16 w-80 h-80 opacity-[0.05] rotate-12" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI 洞察分析 */}
      <div className="pt-6">
        <InsightPanel 
          insight={insight} 
          loading={insightLoading} 
          settings={settings}
          onOpenSettings={onOpenSettings}
          onGenerate={handleGenerateInsight}
          canGenerate={steps.length > 0}
        />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 12px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default NLPModule;
