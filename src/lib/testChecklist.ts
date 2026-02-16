export interface TestChecklistItem {
  id: string;
  label: string;
  hint: string;
}

export const TEST_CHECKLIST_ITEMS: TestChecklistItem[] = [
  { id: 'jd_required', label: 'JD required validation works', hint: 'Try submit with empty JD in Assessments.' },
  { id: 'short_jd_warning', label: 'Short JD warning shows for <200 chars', hint: 'Paste a very short JD and check warning banner.' },
  { id: 'skill_grouping', label: 'Skills extraction groups correctly', hint: 'Use JD with React, Node.js, SQL and verify grouped tags.' },
  { id: 'round_mapping_dynamic', label: 'Round mapping changes based on company + skills', hint: 'Compare Amazon + DSA vs unknown startup + React JD.' },
  { id: 'score_deterministic', label: 'Score calculation is deterministic', hint: 'Analyze same input twice and compare base score.' },
  { id: 'toggle_live_score', label: 'Skill toggles update score live', hint: 'Toggle know/practice and observe final score updates instantly.' },
  { id: 'persist_refresh', label: 'Changes persist after refresh', hint: 'Refresh after toggles and verify values remain.' },
  { id: 'history_load_save', label: 'History saves and loads correctly', hint: 'Analyze, open History, reopen entry and verify full data.' },
  { id: 'export_content', label: 'Export buttons copy the correct content', hint: 'Use copy buttons and paste into notes to verify sections.' },
  { id: 'no_console_errors', label: 'No console errors on core pages', hint: 'Open DevTools console and check Landing, Assessments, Results, History.' },
];

const STORAGE_KEY = 'placement.testChecklist.v1';

function defaultState() {
  return TEST_CHECKLIST_ITEMS.reduce<Record<string, boolean>>((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});
}

export function loadChecklistState() {
  const fallback = defaultState();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const merged = { ...fallback };

    TEST_CHECKLIST_ITEMS.forEach((item) => {
      merged[item.id] = parsed[item.id] === true;
    });

    return merged;
  } catch {
    return fallback;
  }
}

export function saveChecklistState(state: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetChecklistState() {
  const next = defaultState();
  saveChecklistState(next);
  return next;
}

export function countPassed(state: Record<string, boolean>) {
  return TEST_CHECKLIST_ITEMS.reduce((count, item) => count + (state[item.id] ? 1 : 0), 0);
}

export function isShipUnlocked(state: Record<string, boolean>) {
  return countPassed(state) === TEST_CHECKLIST_ITEMS.length;
}
