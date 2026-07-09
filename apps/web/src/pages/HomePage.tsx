import { Link, Navigate } from 'react-router-dom';

import { StatPill } from '@/components/ui/StatPill';
import { useLearnerStore } from '@/stores/learnerStore';
import { useLearningStore } from '@/stores/learningStore';
import { useThemeStore } from '@/stores/themeStore';

export function HomePage() {
  const activeLearner = useLearnerStore((state) => state.getActiveLearner());
  const getCompanionForLearner = useLearnerStore(
    (state) => state.getCompanionForLearner,
  );
  const getProfileForLearner = useLearnerStore(
    (state) => state.getProfileForLearner,
  );
  const todayTheme = useThemeStore((state) => state.todayTheme);
  const reviewCount = useLearningStore((state) => state.reviewCount);

  if (!activeLearner) {
    return <Navigate to="/learners" replace />;
  }

  const companion = getCompanionForLearner(activeLearner.id);
  const profile = getProfileForLearner(activeLearner.id);

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
            Welcome back, {activeLearner.displayName}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {todayTheme.adventureTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {companion?.name} is ready for a warm farm adventure with familiar
            words, useful sentences, and a small real-world mission.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <StatPill label="Theme" value={todayTheme.title} />
            <StatPill label="Goal" value={`${activeLearner.dailyGoalMinutes} min`} />
            <StatPill label="Review" value={`${reviewCount} due`} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-meadow-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700"
            >
              Start Today
            </button>
            <Link
              to="/learners"
              className="rounded-full border border-amber-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-meadow-500 hover:text-meadow-700"
            >
              Switch Learner
            </Link>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-meadow-700 p-6 text-white shadow-sm sm:p-8">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/15 text-5xl">
            {companion?.avatarEmoji}
          </div>
          <h2 className="mt-5 text-2xl font-bold">{companion?.name}</h2>
          <p className="mt-2 text-sm capitalize text-meadow-50">
            {companion?.personality} companion
          </p>
          <p className="mt-6 text-base leading-7 text-meadow-50">
            “Let&apos;s say one brave English sentence today.”
          </p>
        </aside>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Streak</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {activeLearner.streakDays} days
          </p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Learning days</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {activeLearner.totalLearningDays}
          </p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Profile focus</p>
          <p className="mt-2 text-lg font-bold text-slate-950">
            {profile?.learningGoal}
          </p>
        </div>
      </div>
    </section>
  );
}
