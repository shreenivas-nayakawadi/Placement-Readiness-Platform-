import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { formatDate, getHistory } from '../lib/storage';
import type { AnalysisEntry } from '../types/analysis';

export function Resources() {
  const [history] = useState<AnalysisEntry[]>(() => getHistory());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">History</CardTitle>
        <CardDescription>Saved analyses from localStorage. Click any entry to open full results.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-slate-600">No history yet. Analyze a JD from the Assessments page.</p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <Link
                key={entry.id}
                to={`/results?id=${entry.id}`}
                className="block rounded-xl border border-slate-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{entry.company || 'Unknown company'} - {entry.role || 'Role not specified'}</p>
                    <p className="mt-1 text-xs text-slate-600">{formatDate(entry.createdAt)}</p>
                  </div>
                  <p className="font-['Sora'] text-lg font-semibold text-indigo-700">{entry.readinessScore}/100</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
