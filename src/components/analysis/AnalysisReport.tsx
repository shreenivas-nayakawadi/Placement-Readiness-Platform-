import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { AnalysisEntry } from '../../types/analysis';

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
}

export function AnalysisReport({ entry }: AnalysisReportProps) {
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
            <span className="font-['Sora'] text-5xl font-semibold text-indigo-700">{entry.readinessScore}</span>
            <span className="pb-1 text-sm text-slate-600">/100</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
          <CardDescription>Detected from the JD using category-wise heuristics.</CardDescription>
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
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
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
    </div>
  );
}
