
export enum AIModel {
  GEMINI = 'gemini-3-pro-preview',
  DEEPSEEK = 'deepseek-chat'
}

export enum PlanningType {
  NLP = 'NLP'
}

export type OptimizationGoal = 'min' | 'max';

export interface AISettings {
  model: AIModel;
  deepseekKey?: string;
}

export interface SolverStep {
  title: string;
  content: string; // LaTeX
  explanation: string;
}

export interface NLPInput {
  objective: string;
  constraints: string[];
  initialPoint: { x: number; y: number };
}
