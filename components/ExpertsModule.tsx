
import React from 'react';
import { Users, Quote, Award, ExternalLink } from 'lucide-react';

const ExpertsModule: React.FC = () => {
  const experts = [
    {
      name: "Joseph-Louis Lagrange",
      title: "拉格朗日 (1736-1813)",
      tags: ["拉格朗日乘子法", "分析力学"],
      desc: "18世纪最伟大的数学家之一。他在《分析力学》中提出的拉格朗日乘子法，通过引入辅助变量将带约束的极值问题转化为无约束问题，奠定了现代最优化理论的基石。在本项目中，他是构造目标函数与约束平衡点的核心灵魂，其优雅的代数方法至今仍是处理等式约束的首选。",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lagrange"
    },
    {
      name: "Harold W. Kuhn & Albert W. Tucker",
      title: "库恩与塔克",
      tags: ["KKT条件", "非线性规划"],
      desc: "两位数学家共同定义的 KKT 条件（Kuhn-Tucker conditions）是非线性规划领域的最高准则。他们将拉格朗日乘子法推广到了包含不等式约束的更广泛场景，确立了局部最优解必须满足的一组一阶必要条件。这一成就标志着非线性规划作为一个独立学科的正式成熟。",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tucker"
    },
    {
      name: "John von Neumann",
      title: "约翰·冯·诺依曼 (1903-1957)",
      tags: ["对偶理论", "博弈论"],
      desc: "被誉为“计算机之父”和“博弈论之父”。他在运筹学领域的卓越贡献在于提出了对偶理论，揭示了原问题与对偶问题之间深邃的数学联系。他的思想为算法收敛性分析和复杂规划问题的计算界限提供了强大的理论支撑，直接影响了后续大规模数值优化算法的发展。",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neumann"
    },
    {
      name: "George Dantzig",
      title: "乔治·丹齐格 (1914-2005)",
      tags: ["单纯形法", "运筹学之父"],
      desc: "作为运筹学的核心人物，他发明的单纯形法是线性规划历史上最重要的算法。虽然主要针对线性领域，但其处理约束条件的思想深度影响了非线性规划中的序列二次规划（SQP）等算法。他的工作让复杂的资源分配问题能够在电子计算机上得到高效解决，开启了现代工业优化的新纪元。",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dantzig"
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <Users className="w-10 h-10 text-indigo-600" />
          运筹学专家馆
        </h2>
        <p className="text-slate-500 mt-2 font-medium">致敬那些用数学之美重塑世界资源分配规则的先行者。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {experts.map((expert, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all group">
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-110 transition-transform">
                    <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{expert.title}</h3>
                    <p className="text-sm font-bold text-indigo-500 uppercase tracking-tighter mt-1">{expert.name}</p>
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  <Award className="w-5 h-5 text-indigo-400" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {expert.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-full uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-slate-100 group-hover:text-indigo-50 transition-colors -z-10" />
                <p className="text-slate-600 leading-relaxed font-medium text-lg italic">
                  {expert.desc}
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center group-hover:bg-indigo-50/30 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400">Classical Achievement</span>
              <button className="text-indigo-600 p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        <div className="flex-1 relative z-10">
          <h3 className="text-3xl font-black mb-6">连接过去与未来的数学桥梁</h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl">
            正如这些大师们在纸笔间推演宇宙的秩序，现代 AI 引擎在本项目中将这些经典的 KKT 条件与拉格朗日算子自动化，使得复杂的优化问题能够实时可视化并得到启发。
          </p>
          <div className="flex gap-4">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                   {i}
                 </div>
               ))}
             </div>
             <p className="text-xs font-bold text-slate-500 mt-2">以及无数默默奉献的算法工程师</p>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex justify-center relative z-10">
           <div className="p-10 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 text-center">
             <div className="text-5xl font-black text-indigo-400 mb-2">∞</div>
             <p className="text-xs font-black uppercase tracking-[4px] text-white/40">Mathematical Infinity</p>
           </div>
        </div>
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none">
           <Users className="w-96 h-96" />
        </div>
      </div>
    </div>
  );
};

export default ExpertsModule;
