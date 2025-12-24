
import React from 'react';
import { FileText, Cpu, CheckCircle2, ChevronRight, Hash } from 'lucide-react';
import MathDisplay from './MathDisplay';

const DocsModule: React.FC = () => {
  const sections = [
    {
      id: "lagrange",
      title: "拉格朗日乘子法 (Lagrange Multipliers)",
      content: "拉格朗日乘子法是求解受约束优化问题的基础。通过引入辅助变量 $\\lambda$，我们将受约束的目标极值问题转化为增广拉格朗日函数的无约束驻点问题。",
      math: "L(x, y, \\lambda) = f(x, y) + \\sum_{i=1}^m \\lambda_i g_i(x, y)",
      detail: "在执行求解时，第一步通常是构造拉格朗日函数。该函数将目标函数 $f$ 与约束函数 $g$ 线性组合，其极值点处的梯度必须为零，从而揭示了最优解的必要条件。对于 NLP 问题，这是从理论走向数值算法的第一步。"
    },
    {
      id: "kkt",
      title: "KKT 最优性条件 (KKT Conditions)",
      content: "对于包含不等式约束的非线性规划问题，KKT 条件是判定局部最优解的核心必要准则，是对拉格朗日法的进阶推广。",
      math: "\\begin{cases} \\nabla L(x^*, \\lambda^*, \\mu^*) = 0 \\\\ \\mu_j^* h_j(x^*) = 0, \\mu_j^* \\ge 0 \\\\ g_i(x^*) = 0, h_j(x^*) \\le 0 \\end{cases}",
      detail: "求解器会逐步验证这些条件：1. 稳态条件（梯度消失）；2. 互补松弛性（Active/Inactive 约束判定）；3. 原始与对偶可行性验证。这是 AI 推导逻辑中最为严谨的部分。"
    },
    {
      id: "gradient",
      title: "二阶导数与 Hessian 矩阵",
      content: "为了判定最点的性质（极大或极小），系统会分析目标函数的二阶导数矩阵，即 Hessian 矩阵的正定性。",
      math: "H = \\begin{bmatrix} \\frac{\\partial^2 f}{\\partial x^2} & \\frac{\\partial^2 f}{\\partial x \\partial y} \\\\ \\frac{\\partial^2 f}{\\partial y \\partial x} & \\frac{\\partial^2 f}{\\partial y^2} \\end{bmatrix}",
      detail: "Hessian 矩阵的特征值分布决定了曲面的凸性。如果 $H$ 在驻点处正定，则该点为局部极小点；若负定，则为极大点。AI 在“凸性分析”步骤中会详细阐述此项指标。"
    },
    {
      id: "penalty",
      title: "数值罚函数法 (Penalty Functions)",
      content: "为了处理边界复杂的非线性约束，系统常利用罚函数将违反约束的惩罚项整合进目标函数，使得迭代过程回归可行域。",
      math: "P(x; \\rho) = f(x) + \\rho \\sum_{i} [\\max(0, g_i(x))]^2",
      detail: "内点法（Barrier Method）通过在可行域边缘添加无穷大障碍项，强制迭代点在内部移动。随着参数 $\\rho$ 的演化，数值解将收敛至真实的边界最优解点。"
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <FileText className="w-10 h-10 text-indigo-600" />
            算法核心文档
          </h2>
          <p className="text-slate-500 mt-2 text-lg font-medium italic">深入解析工作台背后运行的数学公理与推导逻辑。</p>
        </div>
        <div className="hidden lg:flex items-center gap-3 px-6 py-2 bg-slate-100 rounded-xl border border-slate-200">
          <Cpu className="w-5 h-5 text-indigo-500" />
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Logic-Solver v9.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-2 bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[2px] mb-2 ml-1">知识图谱索引</p>
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-2 transition-all" />
                {s.title.split(' ')[0]}
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {sections.map((section, idx) => (
            <div key={section.id} id={section.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden scroll-mt-24 transition-all hover:shadow-md">
              <div className="p-8 flex flex-col">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{section.title}</h3>
                </div>
                
                {/* 移除 mb-4 改为 mb-1 消除空行 */}
                <p className="text-slate-600 text-base leading-relaxed font-medium mb-1">
                  {section.content}
                </p>

                {section.math && (
                  <div className="my-2 py-3 border-y border-slate-50 flex items-center justify-center overflow-x-auto bg-slate-50/50 rounded-2xl">
                    <MathDisplay math={section.math} block={true} />
                  </div>
                )}

                {section.detail && (
                  <div className="flex gap-4 mt-1"> {/* 减小 mt-2 到 mt-1 */}
                    <div className="mt-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-indigo-900 flex items-center gap-2 mb-0.5"> {/* 减小 mb-1 到 mb-0.5 */}
                        <Hash className="w-4 h-4 text-indigo-400" />
                        求解实现细节
                      </h4>
                      <p className="text-indigo-800/80 leading-relaxed text-sm font-bold">
                        {section.detail}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3 tracking-tight">计算稳定性与收敛校正</h3>
              <p className="text-slate-400 text-base leading-relaxed max-w-2xl mb-6 font-medium">
                我们的引擎内置了自适应步长（Adaptive Step Size）和二阶 Hessian 信息修正逻辑。对于高度非凸的问题，系统会自动切换至 Trust Region 方法以确保求解稳定性。
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-white/10 rounded-xl text-xs font-black tracking-widest border border-white/10 uppercase">Hessian Correction</span>
                <span className="px-4 py-1.5 bg-white/10 rounded-xl text-xs font-black tracking-widest border border-white/10 uppercase">Auto-differentiation</span>
                <span className="px-4 py-1.5 bg-white/10 rounded-xl text-xs font-black tracking-widest border border-white/10 uppercase">Trust Region</span>
              </div>
            </div>
            <Cpu className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.05] rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsModule;
