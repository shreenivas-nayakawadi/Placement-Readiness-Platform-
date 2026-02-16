import { BookOpen, ClipboardCheck, Code2, LayoutDashboard, User } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/practice', icon: Code2, label: 'Practice' },
  { to: '/dashboard/assessments', icon: ClipboardCheck, label: 'Assessments' },
  { to: '/dashboard/resources', icon: BookOpen, label: 'Resources' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

const getNavClass = (isActive: boolean) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
    isActive
      ? 'bg-indigo-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export function DashboardLayout() {
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/85 backdrop-blur md:flex md:flex-col">
        <div className="border-b border-slate-200 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">Platform</p>
          <h1 className="mt-1 font-['Sora'] text-xl font-semibold text-slate-900">Placement Prep</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => getNavClass(isActive)}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="m-4 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4">
          <p className="text-xs font-semibold text-indigo-700">Tip of the day</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">Solve 2 medium problems before attempting a full assessment.</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <h2 className="font-['Sora'] text-base font-semibold text-slate-900">Placement Prep</h2>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50">
            <User className="h-4 w-4 text-indigo-700" />
          </div>
        </header>

        <nav className="border-b border-slate-200 bg-white/80 p-2 md:hidden">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
