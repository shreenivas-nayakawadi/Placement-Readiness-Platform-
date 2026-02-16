import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { analyzeJobDescription } from '../lib/analysis';
import { saveEntry } from '../lib/storage';
import type { AnalysisEntry } from '../types/analysis';

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `analysis-${Date.now()}`;
}

export function Assessments() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = (event: FormEvent) => {
    event.preventDefault();

    if (!jdText.trim()) {
      setError('Please paste a job description to analyze.');
      return;
    }

    setError('');

    const output = analyzeJobDescription(jdText, company, role);
    const entry: AnalysisEntry = {
      id: createId(),
      createdAt: new Date().toISOString(),
      company: company.trim(),
      role: role.trim(),
      jdText: jdText.trim(),
      ...output,
    };

    saveEntry(entry);
    navigate('/results', { state: { id: entry.id } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">JD Heuristic Analyzer</CardTitle>
        <CardDescription>
          Paste a JD, extract role-specific skills, generate checklist/plan/questions, and save history offline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Company (optional)</span>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="e.g. Infosys"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-300 focus:ring"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Role (optional)</span>
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="e.g. SDE Intern"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-300 focus:ring"
              />
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Job Description</span>
            <textarea
              value={jdText}
              onChange={(event) => setJdText(event.target.value)}
              rows={12}
              placeholder="Paste full job description here..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-300 focus:ring"
            />
          </label>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Analyze and Save
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
