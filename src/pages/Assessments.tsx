import { ClipboardCheck } from 'lucide-react';

export function Assessments() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-2.5">
        <ClipboardCheck className="h-5 w-5 text-indigo-700" />
      </div>
      <h1 className="font-['Sora'] text-2xl font-semibold text-slate-900">Assessments</h1>
      <p className="mt-3 text-sm text-slate-600">Assessments coming soon. This section will include timed tests and score analysis.</p>
    </section>
  );
}
