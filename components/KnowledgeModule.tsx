
import React from 'react';
import { BookOpen, Zap, Target, Layers, Cpu } from 'lucide-react';

const KnowledgeModule: React.FC = () => {
  const algorithms = [
    {
      title: "经典数值优化算法",
      icon: <Target className="w-6 h-6 text-indigo-600" />,
      desc: "核心包括梯度下降法、牛顿法、内点法及拉格朗日乘子法。梯度下降法利用一阶导数寻找最速下降方向，适用于大规模简单问题。牛顿法则结合二阶 Hessian 矩阵，收敛速度极快但计算代价高。内点法通过构造惩罚函数在可行域内部搜索，是处理复杂约束的主流工业级方法，能够保证在多项式时间内找到局部最优解，在解决凸优化问题时表现极其稳健。"
    },
    {
      title: "启发式算法 (Heuristic)",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      desc: "当问题具有高度非线性、非凸或不连续特性时，经典导数方法易陷入局部最优。启发式算法如遗传算法（模拟进化的交叉变异）、模拟退火（模拟固体降温过程）和粒子群优化（模拟鸟群寻食），通过随机搜索与群体协作，在大范围解空间内寻找全局最优解。它们不依赖梯度信息，鲁棒性极强，广泛应用于工程设计、排程优化及复杂的组合优化场景，是解决非凸 NP-hard 问题的利器。"
    },
    {
      title: "信赖域与线搜索",
      icon: <Layers className="w-6 h-6 text-emerald-500" />,
      desc: "这是保证算法全局收敛的两大核心框架。线搜索确定方向后寻找步长，而信赖域则在每一步构造一个局部的二阶近似模型，并限制步长在模型可信的区域内。信赖域方法在处理 Hessian 矩阵奇异或非正定时表现更佳，常用于复杂的非线性最小二乘问题。通过动态调整信赖域半径，算法能在探索（Exploration）与利用（Exploitation）之间取得完美平衡。"
    },
    {
      title: "进化策略与差分进化",
      icon: <Cpu className="w-6 h-6 text-purple-500" />,
      desc: "作为启发式算法的进阶分支，进化策略侧重于实值向量的参数优化，通过自适应调整变异强度来加速搜索。差分进化则利用群体中个体间的向量差值进行扰动，具有参数少、寻优能力强的特点。这些算法在处理目标函数存在大量噪声、不连续或维度极高的黑盒优化问题时具有天然优势，是现代机器学习超参数调节及复杂系统控制中不可或缺的工具。"
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">NLP 算法百科</h2>
        <p className="text-slate-500 mt-2 font-medium">深入了解非线性规划的核心理论与前沿优化算法。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {algorithms.map((alg, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                {alg.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800">{alg.title}</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              {alg.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-4">想要更深度的学术洞察？</h3>
          <p className="opacity-80 max-w-2xl leading-relaxed mb-6">
            在工作台中点击“开始 AI 专家洞察”，我们的推理引擎将基于 KKT 条件、Hessian 矩阵性质及可行域拓扑结构为您生成专属的分析报告。
          </p>
          <button className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-black hover:bg-indigo-50 transition-colors">
            立即去求解
          </button>
        </div>
        <BookOpen className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10 rotate-12" />
      </div>
    </div>
  );
};

export default KnowledgeModule;
