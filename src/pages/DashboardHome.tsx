import { Activity, ClipboardCheck, Code2, Flame } from 'lucide-react';

const stats = [
  { label: 'Problems Solved', value: '0', icon: Code2 },
  { label: 'Assessments Taken', value: '0', icon: ClipboardCheck },
  { label: 'Current Streak', value: '0 days', icon: Flame },
];

export function DashboardHome() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">Dashboard</p>
        <h1 className="mt-2 font-['Sora'] text-2xl font-semibold text-slate-900">Welcome to Your Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Track your placement preparation with daily practice, assessments, and interview progress.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-2.5">
              <stat.icon className="h-5 w-5 text-indigo-700" />
            </div>
            <h3 className="text-sm font-medium text-slate-600">{stat.label}</h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-700" />
          <p className="text-sm font-semibold text-slate-900">Readiness meter</p>
        </div>
        <div className="mt-4 h-3 rounded-full bg-slate-100">
          <div className="h-full w-[18%] rounded-full bg-indigo-600" />
        </div>
        <p className="mt-3 text-sm text-slate-600">You are at 18% readiness. Keep consistency to improve this score.</p>
      </section>
    </div>
  );
}
