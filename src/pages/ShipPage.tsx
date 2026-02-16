import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { countPassed, isShipUnlocked, loadChecklistState, TEST_CHECKLIST_ITEMS } from '../lib/testChecklist';

export function ShipPage() {
  const state = loadChecklistState();
  const unlocked = isShipUnlocked(state);
  const passed = countPassed(state);

  if (!unlocked) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ship Locked</CardTitle>
          <CardDescription>Tests Passed: {passed} / {TEST_CHECKLIST_ITEMS.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Fix issues before shipping.
          </p>
          <Link
            to="/prp/07-test"
            className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Go to Test Checklist
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ship Unlocked</CardTitle>
        <CardDescription>All checklist tests are complete.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Ready to ship.
        </p>
      </CardContent>
    </Card>
  );
}
