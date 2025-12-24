
import { GoogleGenAI, Type } from "@google/genai";
import { PlanningType, SolverStep } from "../types";

const getGeminiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsight = async (type: PlanningType, formulation: string) => {
  const ai = getGeminiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `作为一名运筹学专家，请分析以下非线性规划问题。
      问题描述：${formulation}
      
      请提供：
      1. 问题的复杂性分析（如：凸性、二阶导数性质）。
      2. 求解此问题的推荐策略（例如：梯度下降、内点法、拉格朗日乘子法等）。
      3. 可能存在的陷阱（如：局部最优、鞍点、约束非正则性）。
      4. 对实际工业或研究应用的建议。
      
      请使用中文回答，并使用 LaTeX 格式输出数学公式。`,
      config: {
          thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return response.text;
  } catch (error: any) {
    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("KEY_NOT_FOUND");
    }
    throw error;
  }
};

export const solveStepByStep = async (type: PlanningType, input: any): Promise<SolverStep[]> => {
  const ai = getGeminiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `请逐步求解以下非线性规划问题：
      输入参数：${JSON.stringify(input)}
      
      请返回一个 JSON 数组，每个元素包含：
      - title: 步骤名称（如：构造拉格朗日函数、求解 KKT 条件等）
      - content: 具体的数学计算过程 (使用 LaTeX)
      - explanation: 这一步的逻辑解释和运筹学背景
      
      确保步骤逻辑严密，适合教学演示。`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
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
    console.error("Failed to solve step by step", error);
    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("KEY_NOT_FOUND");
    }
    return [];
  }
};
