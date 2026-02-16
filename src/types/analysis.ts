export type SkillCategory =
  | 'Core CS'
  | 'Languages'
  | 'Web'
  | 'Data'
  | 'Cloud/DevOps'
  | 'Testing'
  | 'General';

export type ExtractedSkills = Record<SkillCategory, string[]>;

export interface RoundChecklist {
  round: string;
  items: string[];
}

export interface DayPlan {
  day: string;
  focus: string;
  items: string[];
}

export interface AnalysisOutput {
  extractedSkills: ExtractedSkills;
  checklist: RoundChecklist[];
  plan: DayPlan[];
  questions: string[];
  readinessScore: number;
}

export interface AnalysisEntry extends AnalysisOutput {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
}
