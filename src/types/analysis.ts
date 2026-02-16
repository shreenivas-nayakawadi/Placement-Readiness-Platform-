export type SkillConfidence = 'know' | 'practice';
export type SkillConfidenceMap = Record<string, SkillConfidence>;

export interface ExtractedSkills {
  coreCS: string[];
  languages: string[];
  web: string[];
  data: string[];
  cloud: string[];
  testing: string[];
  other: string[];
}

export interface ChecklistRound {
  roundTitle: string;
  items: string[];
}

export interface DayPlan {
  day: string;
  focus: string;
  tasks: string[];
}

export interface RoundMappingItem {
  roundTitle: string;
  focusAreas: string[];
  whyItMatters: string;
}

export type CompanySizeCategory = 'Startup' | 'Mid-size' | 'Enterprise';

export interface CompanyIntel {
  companyName: string;
  industry: string;
  sizeCategory: CompanySizeCategory;
  typicalHiringFocus: string;
  note: string;
}

export interface AnalysisOutput {
  extractedSkills: ExtractedSkills;
  roundMapping: RoundMappingItem[];
  checklist: ChecklistRound[];
  plan7Days: DayPlan[];
  questions: string[];
  baseScore: number;
  skillConfidenceMap: SkillConfidenceMap;
  finalScore: number;
  companyIntel: CompanyIntel | null;
}

export interface AnalysisEntry extends AnalysisOutput {
  id: string;
  createdAt: string;
  updatedAt: string;
  company: string;
  role: string;
  jdText: string;
}
