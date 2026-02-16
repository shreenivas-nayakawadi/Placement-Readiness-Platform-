import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { AnalysisEntry, SkillConfidence, SkillConfidenceMap } from '../../types/analysis';

const categoryOrder: (keyof AnalysisEntry['extractedSkills'])[] = [
  'Core CS',
  'Languages',
  'Web',
  'Data',
  'Cloud/DevOps',
  'Testing',
  'General',
];

interface AnalysisReportProps {
  entry: AnalysisEntry;
  onEntryChange: (nextEntry: AnalysisEntry) => void;
}

function flattenSkills(entry: AnalysisEntry) {
  const all = categoryOrder.flatMap((category) => entry.extractedSkills[category]);
  return Array.from(new Set(all));
}

function withDefaults(entry: AnalysisEntry) {
  const allSkills = flattenSkills(entry);
  const existing = entry.skillConfidenceMap ?? {};
  const skillConfidenceMap: SkillConfidenceMap = {};

  for (const skill of allSkills) {
    skillConfidenceMap[skill] = existing[skill] ?? 'practice';
  }

  return {
    allSkills,
    skillConfidenceMap,
    baseScore: entry.baseReadinessScore ?? entry.readinessScore,
  };
}

function buildLiveScore(baseScore: number, allSkills: string[], map: SkillConfidenceMap) {
  const adjustment = allSkills.reduce((sum, skill) => {
    const value = map[skill] ?? 'practice';
    return sum + (value === 'know' ? 2 : -2);
  }, 0);

  return Math.max(0, Math.min(100, baseScore + adjustment));
}

function planText(entry: AnalysisEntry) {
  return entry.plan
    .map((day) => `${day.day} (${day.focus})\n${day.items.map((item) => `- ${item}`).join('\n')}`)
    .join('\n\n');
}

function checklistText(entry: AnalysisEntry) {
  return entry.checklist
    .map((round) => `${round.round}\n${round.items.map((item) => `- ${item}`).join('\n')}`)
    .join('\n\n');
}

function questionsText(entry: AnalysisEntry) {
  return entry.questions.map((question, index) => `${index + 1}. ${question}`).join('\n');
}

function fullExportText(entry: AnalysisEntry) {
  const categorySkills = categoryOrder
    .map((category) => {
      const items = entry.extractedSkills[category];
      if (!items.length) {
        return '';
      }
      return `${category}: ${items.join(', ')}`;
    })
    .filter(Boolean)
    .join('\n');

  const weakSkills = Object.entries(entry.skillConfidenceMap ?? {})
    .filter(([, value]) => value === 'practice')
    .map(([skill]) => skill)
    .slice(0, 3)
    .join(', ');

  return [
    'Placement Readiness Analysis',
    `Company: ${entry.company || 'Unknown company'}`,
    `Role: ${entry.role || 'Role not specified'}`,
    `Score: ${entry.readinessScore}/100`,
    '',
    'Key Skills Extracted',
    categorySkills,
    '',
    'Round-wise Preparation Checklist',
    checklistText(entry),
    '',
    '7-day Plan',
    planText(entry),
    '',
    '10 Likely Interview Questions',
    questionsText(entry),
    '',
    'Action Next',
    `Top weak skills: ${weakSkills || 'None'}`,
    'Start Day 1 plan now.',
  ].join('\n');
}

export function AnalysisReport({ entry, onEntryChange }: AnalysisReportProps) {
  const [copyStatus, setCopyStatus] = useState('');

  const state = useMemo(() => {
    const defaults = withDefaults(entry);
    const score = buildLiveScore(defaults.baseScore, defaults.allSkills, defaults.skillConfidenceMap);
    return {
      ...defaults,
      score,
      weakSkills: defaults.allSkills.filter((skill) => defaults.skillConfidenceMap[skill] === 'practice').slice(0, 3),
    };
  }, [entry]);

  const persist = (skillConfidenceMap: SkillConfidenceMap) => {
    const nextScore = buildLiveScore(state.baseScore, state.allSkills, skillConfidenceMap);
    const nextEntry: AnalysisEntry = {
      ...entry,
      baseReadinessScore: state.baseScore,
      skillConfidenceMap,
      readinessScore: nextScore,
    };

    onEntryChange(nextEntry);
  };

  const setSkillConfidence = (skill: string, value: SkillConfidence) => {
    const nextMap = {
      ...state.skillConfidenceMap,
      [skill]: value,
    };

    persist(nextMap);
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${label} copied`);
    } catch {
      setCopyStatus(`Unable to copy ${label.toLowerCase()}`);
    }

    window.setTimeout(() => setCopyStatus(''), 1600);
  };

  const downloadTxt = () => {
    const blob = new Blob([fullExportText(entry)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `placement-analysis-${entry.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Readiness Score</CardTitle>
          <CardDescription>
            {entry.company || 'Unknown company'} {entry.role ? `- ${entry.role}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="inline-flex items-end gap-2">
            <span className="font-['Sora'] text-5xl font-semibold text-indigo-700">{state.score}</span>
            <span className="pb-1 text-sm text-slate-600">/100</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Live score updates with skill confidence and is always bounded 0-100.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
          <CardDescription>Set your confidence for each skill.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryOrder.map((category) => {
            const skills = entry.extractedSkills[category];

            if (!skills.length) {
              return null;
            }

            return (
              <div key={category}>
                <p className="mb-2 text-sm font-medium text-slate-700">{category}</p>
                <div className="space-y-2">
                  {skills.map((skill) => {
                    const confidence = state.skillConfidenceMap[skill] ?? 'practice';

                    return (
                      <div key={skill} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
                        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                          {skill}
                        </span>
                        <div className="flex gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setSkillConfidence(skill, 'know')}
                            className={`rounded-md px-3 py-1.5 font-medium ${confidence === 'know' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                          >
                            I know this
                          </button>
                          <button
                            type="button"
                            onClick={() => setSkillConfidence(skill, 'practice')}
                            className={`rounded-md px-3 py-1.5 font-medium ${confidence === 'practice' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`}
                          >
                            Need practice
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Tools</CardTitle>
          <CardDescription>Copy sections or download a complete TXT report.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => copyText(planText(entry), '7-day plan')} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white">Copy 7-day plan</button>
            <button type="button" onClick={() => copyText(checklistText(entry), 'round checklist')} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white">Copy round checklist</button>
            <button type="button" onClick={() => copyText(questionsText(entry), '10 questions')} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white">Copy 10 questions</button>
            <button type="button" onClick={downloadTxt} className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white">Download as TXT</button>
          </div>
          {copyStatus ? <p className="mt-2 text-xs text-slate-600">{copyStatus}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entry.checklist.map((round) => (
            <div key={round.round} className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{round.round}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {round.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7-day Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entry.plan.map((day) => (
            <div key={day.day} className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{day.day}: {day.focus}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {day.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10 Likely Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {entry.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Action Next</CardTitle>
          <CardDescription>Prioritize the most important weak areas first.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700">
            Top 3 weak skills: {state.weakSkills.length ? state.weakSkills.join(', ') : 'None'}
          </p>
          <p className="mt-2 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm font-medium text-indigo-700">
            Start Day 1 plan now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
