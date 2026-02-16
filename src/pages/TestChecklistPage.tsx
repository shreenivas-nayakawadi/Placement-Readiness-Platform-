import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  TEST_CHECKLIST_ITEMS,
  countPassed,
  isShipUnlocked,
  loadChecklistState,
  resetChecklistState,
  saveChecklistState,
} from '../lib/testChecklist';

export function TestChecklistPage() {
  const [state, setState] = useState<Record<string, boolean>>(() => loadChecklistState());

  const passed = useMemo(() => countPassed(state), [state]);
  const unlocked = passed === TEST_CHECKLIST_ITEMS.length;

  const toggle = (id: string) => {
    const next = {
      ...state,
      [id]: !state[id],
    };
    setState(next);
    saveChecklistState(next);
  };

  const reset = () => {
    const next = resetChecklistState();
    setState(next);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Built-in Test Checklist</CardTitle>
          <CardDescription>Tests Passed: {passed} / {TEST_CHECKLIST_ITEMS.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!unlocked ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Fix issues before shipping.
            </p>
          ) : (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              All tests passed. Ship route unlocked.
            </p>
          )}

          <div className="space-y-3">
            {TEST_CHECKLIST_ITEMS.map((item) => (
              <label key={item.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <input
                  type="checkbox"
                  checked={Boolean(state[item.id])}
                  onChange={() => toggle(item.id)}
                  className="mt-1 h-4 w-4 accent-indigo-600"
                />
                <span className="space-y-1">
                  <span className="block text-sm font-medium text-slate-900">{item.label}</span>
                  <span className="block text-xs text-slate-600">How to test: {item.hint}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300"
            >
              Reset checklist
            </button>
            <Link
              to="/prp/08-ship"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Check Ship Lock
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Persistence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Checklist state is stored in localStorage and persists across refresh.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Ship unlocked: {isShipUnlocked(state) ? 'Yes' : 'No'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
