import { Code2 } from 'lucide-react';

export function Practice() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-2.5">
        <Code2 className="h-5 w-5 text-indigo-700" />
      </div>
      <h1 className="font-['Sora'] text-2xl font-semibold text-slate-900">Practice Problems</h1>
      <p className="mt-3 text-sm text-slate-600">Practice problems coming soon. You will get topic-wise and company-wise sets here.</p>
    </section>
  );
}
