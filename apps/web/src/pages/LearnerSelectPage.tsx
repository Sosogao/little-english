import { useNavigate } from 'react-router-dom';

import { useLearnerStore } from '@/stores/learnerStore';

export function LearnerSelectPage() {
  const navigate = useNavigate();
  const learners = useLearnerStore((state) => state.learners);
  const activeLearnerId = useLearnerStore((state) => state.activeLearnerId);
  const setActiveLearner = useLearnerStore((state) => state.setActiveLearner);
  const getCompanionForLearner = useLearnerStore(
    (state) => state.getCompanionForLearner,
  );

  return (
    <section className="space-y-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
          Today&apos;s learner
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          Who is learning English today?
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Each learner keeps a separate journey, companion, streak, and profile.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {learners.map((learner) => {
          const companion = getCompanionForLearner(learner.id);
          const isActive = learner.id === activeLearnerId;

          return (
            <button
              key={learner.id}
              type="button"
              onClick={() => {
                setActiveLearner(learner.id);
                navigate('/');
              }}
              className="min-h-64 rounded-[2rem] border border-amber-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-meadow-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-meadow-100"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sunshine-100 text-4xl">
                  {learner.avatarEmoji}
                </span>
                {isActive ? (
                  <span className="rounded-full bg-meadow-100 px-3 py-1 text-xs font-bold text-meadow-700">
                    Active
                  </span>
                ) : null}
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-950">
                {learner.displayName}
              </h2>
              <p className="mt-1 text-sm capitalize text-slate-500">
                {learner.role} learner
              </p>
              <div className="mt-5 rounded-3xl bg-[#fff8ea] p-4">
                <p className="text-sm font-semibold text-slate-700">
                  {companion?.avatarEmoji} {companion?.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {companion?.personality} companion
                </p>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                {learner.streakDays} day streak · {learner.currentLevel.toUpperCase()}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
