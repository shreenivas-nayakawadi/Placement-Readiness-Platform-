import { calculateFinalScore, deriveCompanyIntel, deriveRoundMapping, getFallbackOtherSkills } from './analysis';
import type {
  AnalysisEntry,
  ChecklistRound,
  ExtractedSkills,
  RoundMappingItem,
  SkillConfidenceMap,
} from '../types/analysis';

const HISTORY_KEY = 'placement.analysis.history.v1';
const ACTIVE_KEY = 'placement.analysis.activeId.v1';

let lastSkippedCount = 0;

function safeArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeExtractedSkills(raw: unknown): ExtractedSkills {
  const source = (raw ?? {}) as Record<string, unknown>;

  const coreCS = safeArray(source.coreCS ?? source['Core CS']);
  const languages = safeArray(source.languages ?? source.Languages);
  const web = safeArray(source.web ?? source.Web);
  const data = safeArray(source.data ?? source.Data);
  const cloud = safeArray(source.cloud ?? source['Cloud/DevOps']);
  const testing = safeArray(source.testing ?? source.Testing);
  let other = safeArray(source.other ?? source.General);

  const technicalCount = coreCS.length + languages.length + web.length + data.length + cloud.length + testing.length;
  if (technicalCount === 0 && other.length === 0) {
    other = getFallbackOtherSkills();
  }

  return { coreCS, languages, web, data, cloud, testing, other };
}

function normalizeRoundMapping(raw: unknown): RoundMappingItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const row = item as Record<string, unknown>;
      const roundTitle = typeof row.roundTitle === 'string' ? row.roundTitle : typeof row.round === 'string' ? row.round : '';
      const focusAreas = safeArray(row.focusAreas).length
        ? safeArray(row.focusAreas)
        : typeof row.focus === 'string'
          ? [row.focus]
          : [];
      const whyItMatters = typeof row.whyItMatters === 'string'
        ? row.whyItMatters
        : typeof row.whyThisRoundMatters === 'string'
          ? row.whyThisRoundMatters
          : '';

      if (!roundTitle) {
        return null;
      }

      return { roundTitle, focusAreas, whyItMatters };
    })
    .filter((item): item is RoundMappingItem => Boolean(item));
}

function normalizeChecklist(raw: unknown): ChecklistRound[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const row = item as Record<string, unknown>;
      const roundTitle = typeof row.roundTitle === 'string' ? row.roundTitle : typeof row.round === 'string' ? row.round : '';
      const items = safeArray(row.items);

      if (!roundTitle) {
        return null;
      }

      return { roundTitle, items };
    })
    .filter((item): item is ChecklistRound => Boolean(item));
}

function normalizePlan(raw: unknown): AnalysisEntry['plan7Days'] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const row = item as Record<string, unknown>;
      const day = typeof row.day === 'string' ? row.day : '';
      const focus = typeof row.focus === 'string' ? row.focus : '';
      const tasks = safeArray(row.tasks).length ? safeArray(row.tasks) : safeArray(row.items);

      if (!day) {
        return null;
      }

      return { day, focus, tasks };
    })
    .filter((item): item is AnalysisEntry['plan7Days'][number] => Boolean(item));
}

function normalizeConfidenceMap(raw: unknown, skills: ExtractedSkills): SkillConfidenceMap {
  const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const allSkills = Array.from(new Set([
    ...skills.coreCS,
    ...skills.languages,
    ...skills.web,
    ...skills.data,
    ...skills.cloud,
    ...skills.testing,
    ...skills.other,
  ]));

  const map: SkillConfidenceMap = {};
  allSkills.forEach((skill) => {
    const value = source[skill];
    map[skill] = value === 'know' ? 'know' : 'practice';
  });

  return map;
}

function normalizeEntry(raw: unknown): AnalysisEntry | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const entry = raw as Record<string, unknown>;
  const id = typeof entry.id === 'string' ? entry.id : '';
  const createdAt = typeof entry.createdAt === 'string' ? entry.createdAt : new Date().toISOString();
  const updatedAt = typeof entry.updatedAt === 'string' ? entry.updatedAt : createdAt;
  const company = typeof entry.company === 'string' ? entry.company : '';
  const role = typeof entry.role === 'string' ? entry.role : '';
  const jdText = typeof entry.jdText === 'string' ? entry.jdText : '';

  if (!id || !jdText) {
    return null;
  }

  const extractedSkills = normalizeExtractedSkills(entry.extractedSkills);
  const checklist = normalizeChecklist(entry.checklist);
  const plan7Days = normalizePlan(entry.plan7Days ?? entry.plan);

  const questionsRaw = safeArray(entry.questions).slice(0, 10);
  const questions = questionsRaw.length === 10
    ? questionsRaw
    : [...questionsRaw, ...Array.from({ length: Math.max(0, 10 - questionsRaw.length) }, (_, i) => `Question placeholder ${i + 1}`)].slice(0, 10);

  const baseScoreCandidate = entry.baseScore ?? entry.baseReadinessScore ?? entry.readinessScore;
  const baseScore = typeof baseScoreCandidate === 'number' ? baseScoreCandidate : 35;

  const skillConfidenceMap = normalizeConfidenceMap(entry.skillConfidenceMap, extractedSkills);
  const finalScoreCandidate = entry.finalScore ?? entry.readinessScore;
  const finalScore = typeof finalScoreCandidate === 'number'
    ? Math.max(0, Math.min(100, finalScoreCandidate))
    : calculateFinalScore(baseScore, skillConfidenceMap);

  const companyIntel = entry.companyIntel && typeof entry.companyIntel === 'object'
    ? (entry.companyIntel as AnalysisEntry['companyIntel'])
    : deriveCompanyIntel(company, role, jdText);

  const roundMapping = normalizeRoundMapping(entry.roundMapping);
  const ensuredRoundMapping = roundMapping.length ? roundMapping : deriveRoundMapping(extractedSkills, companyIntel);

  return {
    id,
    createdAt,
    updatedAt,
    company,
    role,
    jdText,
    extractedSkills,
    roundMapping: ensuredRoundMapping,
    checklist,
    plan7Days,
    questions,
    baseScore: Math.max(0, Math.min(100, baseScore)),
    skillConfidenceMap,
    finalScore: Math.max(0, Math.min(100, finalScore)),
    companyIntel,
  };
}

function parseHistory(value: string | null): AnalysisEntry[] {
  lastSkippedCount = 0;

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      lastSkippedCount = 1;
      return [];
    }

    const normalized: AnalysisEntry[] = [];
    parsed.forEach((item) => {
      const entry = normalizeEntry(item);
      if (entry) {
        normalized.push(entry);
      } else {
        lastSkippedCount += 1;
      }
    });

    if (lastSkippedCount > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    lastSkippedCount = 1;
    return [];
  }
}

export function getHistory(): AnalysisEntry[] {
  return parseHistory(localStorage.getItem(HISTORY_KEY));
}

export function getHistoryWarning() {
  return lastSkippedCount > 0
    ? "One saved entry couldn't be loaded. Create a new analysis."
    : '';
}

export function saveEntry(entry: AnalysisEntry) {
  const existing = getHistory();
  const normalized = normalizeEntry(entry);
  if (!normalized) {
    return;
  }

  const next = [normalized, ...existing.filter((item) => item.id !== normalized.id)];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  setActiveEntryId(normalized.id);
}

export function updateEntry(entry: AnalysisEntry) {
  const existing = getHistory();
  const normalized = normalizeEntry(entry);
  if (!normalized) {
    return;
  }

  const found = existing.some((item) => item.id === normalized.id);
  const next = found
    ? existing.map((item) => (item.id === normalized.id ? normalized : item))
    : [normalized, ...existing];

  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  setActiveEntryId(normalized.id);
}

export function setActiveEntryId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveEntryId() {
  return localStorage.getItem(ACTIVE_KEY);
}

export function getEntryById(id: string) {
  return getHistory().find((item) => item.id === id);
}

export function getLatestEntry() {
  return getHistory()[0];
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}
