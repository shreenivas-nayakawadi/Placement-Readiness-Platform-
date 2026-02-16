import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnalysisReport } from '../components/analysis/AnalysisReport';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getActiveEntryId, getEntryById, getLatestEntry, updateEntry } from '../lib/storage';
import type { AnalysisEntry } from '../types/analysis';

interface LocationState {
  id?: string;
}

export function Results() {
  const location = useLocation();

  const resolvedEntry = useMemo(() => {
    const state = (location.state ?? {}) as LocationState;
    const stateId = state.id;
    const queryId = new URLSearchParams(location.search).get('id');
    const preferredId = stateId ?? queryId ?? getActiveEntryId() ?? undefined;

    if (preferredId) {
      const selected = getEntryById(preferredId);
      if (selected) {
        return selected;
      }
    }

    return getLatestEntry();
  }, [location.search, location.state]);

  const [entry, setEntry] = useState<AnalysisEntry | undefined>(resolvedEntry);

  useEffect(() => {
    setEntry(resolvedEntry);
  }, [resolvedEntry]);

  if (!entry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No analysis found</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Analyze a JD first from the Assessments page, then review results here.
          <div className="mt-4">
            <Link to="/dashboard/assessments" className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white">
              Go to Analyzer
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnalysisReport
      entry={entry}
      onEntryChange={(nextEntry) => {
        setEntry(nextEntry);
        updateEntry(nextEntry);
      }}
    />
  );
}
