import { useMemo, useState } from 'react';
import { calculateFinalScore } from '../../lib/analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { AnalysisEntry, SkillConfidence, SkillConfidenceMap } from '../../types/analysis';

const categoryOrder: (keyof AnalysisEntry['extractedSkills'])[] = [
  'coreCS',
  'languages',
  'web',
  'data',
  'cloud',
  'testing',
  'other',
];

const categoryLabels: Record<keyof AnalysisEntry['extractedSkills'], string> = {
  coreCS: 'Core CS',
  languages: 'Languages',
  web: 'Web',
  data: 'Data',
  cloud: 'Cloud/DevOps',
  testing: 'Testing',
  other: 'Other',
};

interface AnalysisReportProps {
  entry: AnalysisEntry;
  onEntryChange: (nextEntry: AnalysisEntry) => void;
}

function flattenSkills(entry: AnalysisEntry) {
  const all = categoryOrder.flatMap((category) => entry.extractedSkills[category]);
  return Array.from(new Set(all));
}

function planText(entry: AnalysisEntry) {
  return entry.plan7Days
    .map((day) => `${day.day} (${day.focus})\n${day.tasks.map((task) => `- ${task}`).join('\n')}`)
    .join('\n\n');
}

function checklistText(entry: AnalysisEntry) {
  return entry.checklist
    .map((round) => `${round.roundTitle}\n${round.items.map((item) => `- ${item}`).join('\n')}`)
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
      return `${categoryLabels[category]}: ${items.join(', ')}`;
    })
    .filter(Boolean)
    .join('\n');

  const weakSkills = Object.entries(entry.skillConfidenceMap)
    .filter(([, value]) => value === 'practice')
    .map(([skill]) => skill)
    .slice(0, 3)
    .join(', ');

  const roundFlow = entry.roundMapping
    .map((item) => `${item.roundTitle} - ${item.focusAreas.join(', ')}\nWhy this round matters: ${item.whyItMatters}`)
    .join('\n\n');

  return [
    'Placement Readiness Analysis',
    `Company: ${entry.company || 'Unknown company'}`,
    `Role: ${entry.role || 'Role not specified'}`,
    `Base Score: ${entry.baseScore}/100`,
    `Final Score: ${entry.finalScore}/100`,
    '',
    'Company Intel',
    `Company: ${entry.companyIntel?.companyName || 'Not provided'}`,
    `Industry: ${entry.companyIntel?.industry || 'Technology Services'}`,
    `Size Category: ${entry.companyIntel?.sizeCategory || 'Startup'}`,
    `Typical Hiring Focus: ${entry.companyIntel?.typicalHiringFocus || 'Practical problem solving + stack depth'}`,
    `${entry.companyIntel?.note || 'Demo Mode: Company intel generated heuristically.'}`,
    '',
    'Round Mapping Timeline',
    roundFlow || 'No round mapping available',
    '',
    'Key Skills Extracted',
    categorySkills || 'No skills detected',
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
    const allSkills = flattenSkills(entry);
    const weakSkills = allSkills.filter((skill) => entry.skillConfidenceMap[skill] === 'practice').slice(0, 3);
    return { allSkills, weakSkills };
  }, [entry]);

  const persist = (skillConfidenceMap: SkillConfidenceMap) => {
    const nextEntry: AnalysisEntry = {
      ...entry,
      skillConfidenceMap,
      finalScore: calculateFinalScore(entry.baseScore, skillConfidenceMap),
      updatedAt: new Date().toISOString(),
    };

    onEntryChange(nextEntry);
  };

  const setSkillConfidence = (skill: string, value: SkillConfidence) => {
    const nextMap = {
      ...entry.skillConfidenceMap,
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
            <span className="font-['Sora'] text-5xl font-semibold text-indigo-700">{entry.finalScore}</span>
            <span className="pb-1 text-sm text-slate-600">/100</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Base score is fixed at analyze time. Final score updates from confidence toggles only.</p>
        </CardContent>
      </Card>

      {entry.companyIntel ? (
        <Card>
          <CardHeader>
            <CardTitle>Company Intel</CardTitle>
            <CardDescription>{entry.companyIntel.companyName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p><span className="font-medium text-slate-900">Industry:</span> {entry.companyIntel.industry}</p>
            <p><span className="font-medium text-slate-900">Size Category:</span> {entry.companyIntel.sizeCategory}</p>
            <p><span className="font-medium text-slate-900">Typical Hiring Focus:</span> {entry.companyIntel.typicalHiringFocus}</p>
            <p className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
              {entry.companyIntel.note}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Round Mapping Timeline</CardTitle>
          <CardDescription>Expected interview flow mapped from company profile and detected skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entry.roundMapping.map((round, index) => (
              <div key={round.roundTitle} className="relative pl-8">
                <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-indigo-600" />
                {index !== entry.roundMapping.length - 1 ? (
                  <span className="absolute left-[5px] top-5 h-[calc(100%-0.25rem)] w-px bg-indigo-200" />
                ) : null}
                <p className="font-medium text-slate-900">{round.roundTitle}</p>
                <p className="text-sm text-slate-700">{round.focusAreas.join(', ')}</p>
                <p className="mt-1 text-xs text-slate-600">
                  <span className="font-medium text-slate-700">Why this round matters:</span> {round.whyItMatters}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Demo Mode: Company intel generated heuristically.</p>
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
                <p className="mb-2 text-sm font-medium text-slate-700">{categoryLabels[category]}</p>
                <div className="space-y-2">
                  {skills.map((skill) => {
                    const confidence = entry.skillConfidenceMap[skill] ?? 'practice';

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
            <div key={round.roundTitle} className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{round.roundTitle}</p>
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
          {entry.plan7Days.map((day) => (
            <div key={day.day} className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{day.day}: {day.focus}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {day.tasks.map((task) => (
                  <li key={task}>{task}</li>
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
