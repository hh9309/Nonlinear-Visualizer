
import React, { useState, useEffect } from 'react';
import { X, Cpu, Key, CheckCircle2, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import { AIModel, AISettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isGeminiActive, setIsGeminiActive] = useState(false);

  useEffect(() => {
    if (isOpen && (window as any).aistudio?.hasSelectedApiKey) {
      (window as any).aistudio.hasSelectedApiKey().then(setIsGeminiActive);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGeminiActivation = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setIsGeminiActive(true);
    } catch (err) {
      console.error("Gemini 密钥激活失败", err);
    }
  };

  const isConfigured = localSettings.model === AIModel.GEMINI 
    ? isGeminiActive 
    : (localSettings.deepseekKey && localSettings.deepseekKey.length > 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 transition-all">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            AI 引擎激活
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* 统一的配置逻辑：先激活密钥，再选择模型 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Key className="w-3 h-3" />
              第一步：激活 API 密钥
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={handleGeminiActivation}
                className={`w-full py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                  isGeminiActive 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src="https://www.gstatic.com/lamda/images/favicon_v2_16x16.png" className="w-4 h-4" alt="" />
                  <span className="font-black text-xs">Gemini 官方密钥激活</span>
                </div>
                {isGeminiActive ? (
                  <span className="text-[10px] font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 已激活</span>
                ) : (
                  <span className="text-[10px] font-bold flex items-center gap-1"><Zap className="w-3 h-3" /> 点击激活</span>
                )}
              </button>

              <div className={`p-4 rounded-2xl border-2 transition-all ${
                localSettings.deepseekKey ? 'border-indigo-600 bg-white' : 'border-slate-100 bg-slate-50'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-xs font-black text-slate-700">
                  <div className="w-4 h-4 bg-slate-800 text-white text-[8px] rounded-full flex items-center justify-center font-black">D</div>
                  DeepSeek 手动密钥
                </div>
                <input 
                  type="password"
                  value={localSettings.deepseekKey || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, deepseekKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none font-mono text-[10px]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3" />
              第二步：选择生效模型
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                disabled={!isGeminiActive}
                onClick={() => setLocalSettings({ ...localSettings, model: AIModel.GEMINI })}
                className={`py-3 rounded-xl border-2 font-black text-xs transition-all ${
                  localSettings.model === AIModel.GEMINI 
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'border-slate-100 bg-slate-50 text-slate-400'
                } ${!isGeminiActive && 'opacity-30 cursor-not-allowed'}`}
              >
                Gemini 3 Pro
              </button>
              <button 
                disabled={!localSettings.deepseekKey}
                onClick={() => setLocalSettings({ ...localSettings, model: AIModel.DEEPSEEK })}
                className={`py-3 rounded-xl border-2 font-black text-xs transition-all ${
                  localSettings.model === AIModel.DEEPSEEK 
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'border-slate-100 bg-slate-50 text-slate-400'
                } ${!localSettings.deepseekKey && 'opacity-30 cursor-not-allowed'}`}
              >
                DeepSeek V3
              </button>
            </div>
          </div>

          {!isConfigured && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 border border-amber-100">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] font-bold leading-tight">请先完成 API 密钥激活或输入，然后再选择模型并保存。</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            disabled={!isConfigured}
            onClick={() => { onSave(localSettings); onClose(); }}
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${
              isConfigured 
                ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            保存并立即应用
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
