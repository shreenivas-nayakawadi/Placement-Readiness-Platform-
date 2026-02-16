import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  areAllProofLinksValid,
  formatFinalSubmissionText,
  isValidHttpUrl,
  loadFinalSubmissionLinks,
  saveFinalSubmissionLinks,
  type FinalSubmissionLinks,
} from '../lib/finalSubmission';
import { countPassed, loadChecklistState, TEST_CHECKLIST_ITEMS } from '../lib/testChecklist';

const stepOverview = [
  { step: 'Step 1: Setup Design System', completed: true },
  { step: 'Step 2: Setup Platform Shell', completed: true },
  { step: 'Step 3: Build Skill Assessment Dashboard', completed: true },
  { step: 'Step 4: Heuristic Analyzer + History', completed: true },
  { step: 'Step 5: Interactive Readiness + Exports', completed: true },
  { step: 'Step 6: Company Intel + Round Mapping', completed: true },
  { step: 'Step 7: Data Hardening + Edge Cases', completed: true },
  { step: 'Step 8: Test Checklist + Ship Lock', completed: true },
];

function fieldError(value: string) {
  if (!value.trim()) {
    return 'This link is required.';
  }

  if (!isValidHttpUrl(value)) {
    return 'Enter a valid URL (http:// or https://).';
  }

  return '';
}

export function ProofPage() {
  const [links, setLinks] = useState<FinalSubmissionLinks>(() => loadFinalSubmissionLinks());
  const [copyStatus, setCopyStatus] = useState('');

  const errors = {
    lovableProject: fieldError(links.lovableProject),
    githubRepository: fieldError(links.githubRepository),
    deployedUrl: fieldError(links.deployedUrl),
  };

  const checklistPassed = countPassed(loadChecklistState()) === TEST_CHECKLIST_ITEMS.length;
  const stepsCompleted = useMemo(() => stepOverview.every((item) => item.completed), []);
  const linksValid = useMemo(() => areAllProofLinksValid(links), [links]);

  const isShipped = stepsCompleted && checklistPassed && linksValid;

  const updateField = (key: keyof FinalSubmissionLinks, value: string) => {
    const next = {
      ...links,
      [key]: value,
    };

    setLinks(next);
    saveFinalSubmissionLinks(next);
  };

  const copyFinalSubmission = async () => {
    try {
      await navigator.clipboard.writeText(formatFinalSubmissionText(links));
      setCopyStatus('Final submission copied');
    } catch {
      setCopyStatus('Unable to copy final submission');
    }

    window.setTimeout(() => setCopyStatus(''), 1800);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Final Ship Status</CardTitle>
          <CardDescription>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isShipped ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {isShipped ? 'Shipped' : 'In Progress'}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p>8 steps completed: {stepsCompleted ? 'Yes' : 'No'}</p>
          <p>10 checklist tests passed: {checklistPassed ? 'Yes' : 'No'}</p>
          <p>3 proof links valid: {linksValid ? 'Yes' : 'No'}</p>
          {!isShipped ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
              Fix remaining submission requirements before shipping.
            </p>
          ) : (
            <p className="whitespace-pre-line rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
              {'You built a real product.\nNot a tutorial. Not a clone.\nA structured tool that solves a real problem.\n\nThis is your proof of work.'}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step Completion Overview</CardTitle>
          <CardDescription>Progress snapshot for steps 1 to 8.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stepOverview.map((item) => (
              <div key={item.step} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                <span className="text-slate-800">{item.step}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                  {item.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artifact Inputs</CardTitle>
          <CardDescription>All links are required for final shipped status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-slate-700">Lovable Project Link</span>
            <input
              value={links.lovableProject}
              onChange={(event) => updateField('lovableProject', event.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-300 focus:ring"
            />
            {errors.lovableProject ? <span className="text-xs text-rose-600">{errors.lovableProject}</span> : null}
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium text-slate-700">GitHub Repository Link</span>
            <input
              value={links.githubRepository}
              onChange={(event) => updateField('githubRepository', event.target.value)}
              placeholder="https://github.com/..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-300 focus:ring"
            />
            {errors.githubRepository ? <span className="text-xs text-rose-600">{errors.githubRepository}</span> : null}
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium text-slate-700">Deployed URL</span>
            <input
              value={links.deployedUrl}
              onChange={(event) => updateField('deployedUrl', event.target.value)}
              placeholder="https://your-app..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-300 focus:ring"
            />
            {errors.deployedUrl ? <span className="text-xs text-rose-600">{errors.deployedUrl}</span> : null}
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Final Submission Export</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            onClick={copyFinalSubmission}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Copy Final Submission
          </button>
          {copyStatus ? <p className="mt-2 text-xs text-slate-600">{copyStatus}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
