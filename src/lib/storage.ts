import type { AnalysisEntry } from '../types/analysis';

const HISTORY_KEY = 'placement.analysis.history.v1';
const ACTIVE_KEY = 'placement.analysis.activeId.v1';

function safeParse(value: string | null): AnalysisEntry[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as AnalysisEntry[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function getHistory(): AnalysisEntry[] {
  return safeParse(localStorage.getItem(HISTORY_KEY));
}

export function saveEntry(entry: AnalysisEntry) {
  const existing = getHistory();
  const next = [entry, ...existing.filter((item) => item.id !== entry.id)];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  setActiveEntryId(entry.id);
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
