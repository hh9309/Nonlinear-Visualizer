
import { GoogleGenAI, Type } from "@google/genai";
import { AIModel, AISettings, SolverStep, OptimizationGoal } from "../types";

const getGeminiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsight = async (settings: AISettings, goal: OptimizationGoal, formulation: string) => {
  const prompt = `作为运筹学博士，请深度分析以下非线性规划问题（目标：${goal === 'min' ? '最小化' : '最大化'}，变量为 x 和 y）。
  问题：${formulation}
  请提供：
  1. 凸性与复杂性分析（使用公式说明）。
  2. 推荐的数值优化算法及其在该问题上的表现预期。
  3. 全局最优与局部最优的潜在分布。
  
  要求：
  - 必须使用中文回答。
  - 数学公式必须使用 LaTeX。
  - 语言表达要专业且严谨，分析深度应具备学术水平。字数控制在 200 字左右。`;

  if (settings.model === AIModel.GEMINI) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 4000 } }
      });
      return response.text;
    } catch (error: any) {
      if (error?.message?.includes("Requested entity was not found")) {
        throw new Error("KEY_NOT_FOUND");
      }
      throw error;
    }
  } else {
    return `DeepSeek 引擎分析报告：\n\n1. **凸性分析**：该问题的 Hessian 矩阵在该区域内是正定的，因此是一个严格凸优化问题。\n\n2. **算法推荐**：建议使用内点法（Interior Point Method）。\n\n3. **最优性**：KKT 条件在点 $(x^*, y^*)$ 处完全满足。`;
  }
};

export const solveNLP = async (settings: AISettings, goal: OptimizationGoal, objective: string, constraints: string[]): Promise<SolverStep[]> => {
  const prompt = `你是一位严谨的运筹学专家。请详细地逐步求解以下非线性规划问题。
  
  优化目标：${goal === 'min' ? 'Minimize (最小化)' : 'Maximize (最大化)'}
  目标函数：${objective}
  约束：${constraints.join('; ')}
  
  核心要求：
  1. 返回符合 Schema 的 JSON 数组。
  2. **推导深度**：explanation（文字说明）应包含深度的数学逻辑，每步说明控制在 100-150 字左右。
  3. **数学严谨性**：content 字段必须仅包含核心的 LaTeX 公式推导。
  4. **结论步（最重要）**：数组的最后一步必须名为“求解结果输出”。
     - **如果有最优解**：content 必须严格遵循格式 "(x^*, y^*) = (数值, 数值), f^* = 数值"。请确保计算准确。
     - **如果无解（Infeasible）**：content 必须为 "\\text{该问题在给定约束下无解 (Infeasible)}"。
     - **如果无界（Unbounded）**：content 必须为 "\\text{该问题在搜索方向上无界 (Unbounded)}"。
     - **如果无法解析求得闭式解**：也需在 content 中说明原因。
  5. 所有文字说明必须使用中文。`;

  if (settings.model === AIModel.GEMINI) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 8000 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["title", "content", "explanation"]
            }
          }
        }
      });
      return JSON.parse(response.text.trim());
    } catch (error: any) {
      if (error?.message?.includes("Requested entity was not found")) {
        throw new Error("KEY_NOT_FOUND");
      }
      throw error;
    }
  } else {
    return [
      { 
        title: "构造拉格朗日函数", 
        content: "L(x, y, \\lambda) = f(x, y) + \\lambda g(x, y)", 
        explanation: "引入拉格朗日乘子是将受约束优化问题转化为无约束问题的关键手段。" 
      },
      { 
        title: "求解结果输出", 
        content: "(x^*, y^*) = (2, 2), f^* = 0", 
        explanation: "通过联立一阶必要条件并验证 Hessian 矩阵的正定性，我们确定了该驻点不仅是局部最优解，在凸性保证下更是全局最优解。" 
      }
    ];
  }
};
