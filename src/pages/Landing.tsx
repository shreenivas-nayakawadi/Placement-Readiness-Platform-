import { BarChart3, Code, Video } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PRIMARY = 'hsl(245 58% 51%)';

const features = [
  {
    icon: Code,
    title: 'Practice Problems',
    description: 'Solve coding challenges and improve your problem-solving speed.',
  },
  {
    icon: Video,
    title: 'Mock Interviews',
    description: 'Practice interview rounds with realistic technical and HR prompts.',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Monitor consistency, strengths, and readiness over time.',
  },
];

export function Landing() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGetStarted = () => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen text-slate-900">
      <header className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur md:px-6">
          <p className="font-['Sora'] text-sm font-semibold tracking-wide text-indigo-700">PLACEMENT PREP</p>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">v1 Platform Shell</span>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-6 -z-10 mx-auto h-64 max-w-4xl rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-['Sora'] text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Ace Your Placement</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
            Practice, assess, and prepare for your dream job
          </p>
          <button
            type="button"
            onClick={handleGetStarted}
            disabled={isNavigating}
            style={{ backgroundColor: PRIMARY }}
            className="mt-8 inline-flex items-center rounded-lg px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-400/30 transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
            >
              <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3">
                <feature.icon className="h-6 w-6 text-indigo-700" />
              </div>
              <h2 className="font-['Sora'] text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/80 py-6 text-center text-sm text-slate-600 backdrop-blur">
        &copy; {new Date().getFullYear()} Placement Prep. All rights reserved.
      </footer>
    </div>
  );
}
