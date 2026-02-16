import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3 } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const READINESS_SCORE = 72;
const READINESS_TOTAL = 100;

const skillData = [
  { skill: 'DSA', score: 75 },
  { skill: 'System Design', score: 60 },
  { skill: 'Communication', score: 80 },
  { skill: 'Resume', score: 85 },
  { skill: 'Aptitude', score: 70 },
];

const weekDays = [
  { day: 'Mon', active: true },
  { day: 'Tue', active: true },
  { day: 'Wed', active: false },
  { day: 'Thu', active: true },
  { day: 'Fri', active: true },
  { day: 'Sat', active: false },
  { day: 'Sun', active: true },
];

const upcomingAssessments = [
  { title: 'DSA Mock Test', schedule: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', schedule: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', schedule: 'Friday, 11:00 AM' },
];

const lastTopic = {
  name: 'Dynamic Programming',
  completed: 3,
  total: 10,
};

export function DashboardHome() {
  const [animateGauge, setAnimateGauge] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  const clampedScore = Math.max(0, Math.min(READINESS_SCORE, READINESS_TOTAL));
  const progress = clampedScore / READINESS_TOTAL;
  const isPracticeComplete = lastTopic.completed >= lastTopic.total;
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = useMemo(() => {
    if (!animateGauge) {
      return circumference;
    }

    return circumference * (1 - progress);
  }, [animateGauge, circumference, progress]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimateGauge(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const setLayout = () => setIsNarrow(window.innerWidth < 420);
    setLayout();
    window.addEventListener('resize', setLayout);
    return () => window.removeEventListener('resize', setLayout);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Overall Readiness</CardTitle>
          <CardDescription>Track your readiness score based on recent activity.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center pb-8">
          <div className="relative h-52 w-52">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              <circle cx="100" cy="100" r={radius} stroke="#e2e8f0" strokeWidth="14" fill="none" />
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="hsl(245 58% 51%)"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-['Sora'] text-4xl font-semibold text-slate-900">{clampedScore}/100</p>
              <p className="mt-1 text-sm text-slate-600">Readiness Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill Breakdown</CardTitle>
          <CardDescription>Current strengths across core placement domains.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={skillData}
                outerRadius={isNarrow ? '52%' : '68%'}
                margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
              >
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: '#475569', fontSize: isNarrow ? 10 : 12 }}
                />
                <Radar dataKey="score" fill="hsl(245 58% 51%)" fillOpacity={0.25} stroke="hsl(245 58% 51%)" strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Continue Practice</CardTitle>
          <CardDescription>Pick up where you left off.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Last Topic</p>
          <p className="mt-1 font-['Sora'] text-xl font-semibold text-slate-900">
            {isPracticeComplete ? 'All topics complete!' : lastTopic.name}
          </p>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Progress</span>
              <span>{lastTopic.completed}/{lastTopic.total} completed</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${Math.min(100, (lastTopic.completed / lastTopic.total) * 100)}%` }}
              />
            </div>
          </div>
          {isPracticeComplete ? (
            <p className="mt-6 text-sm text-slate-600">Great work. Review previously solved topics to retain speed and accuracy.</p>
          ) : null}
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            {isPracticeComplete ? 'Review Topics' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
            <CardDescription>Problems Solved: 12/20 this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-full w-[60%] rounded-full bg-indigo-600" />
            </div>
            <div className="mt-5 flex items-center justify-between gap-2">
              {weekDays.map((entry) => (
                <div key={entry.day} className="flex flex-col items-center gap-2">
                  <div className={`h-8 w-8 rounded-full border ${entry.active ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'}`} />
                  <span className="text-xs text-slate-600">{entry.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Stay prepared for your next scheduled rounds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssessments.map((assessment) => (
              <div key={assessment.title} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{assessment.title}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <Clock3 className="h-4 w-4" />
                  {assessment.schedule}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardHome;
