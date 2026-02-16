import { BookOpen } from 'lucide-react';

export function Resources() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-2.5">
        <BookOpen className="h-5 w-5 text-indigo-700" />
      </div>
      <h1 className="font-['Sora'] text-2xl font-semibold text-slate-900">Resources</h1>
      <p className="mt-3 text-sm text-slate-600">Learning resources coming soon. You will find curated notes, sheets, and revision guides.</p>
    </section>
  );
}
