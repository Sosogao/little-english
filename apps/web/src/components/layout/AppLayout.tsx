import { Link, Outlet, useLocation } from 'react-router-dom';

import { useLearnerStore } from '@/stores/learnerStore';

export function AppLayout() {
  const location = useLocation();
  const activeLearner = useLearnerStore((state) => state.getActiveLearner());
  const isLearnerSelect = location.pathname === '/learners';

  return (
    <div className="min-h-screen bg-[#fff8ea] text-slate-900">
      <header className="border-b border-amber-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-meadow-100 text-xl">
              🌿
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-wide text-meadow-700">
                Journey English
              </span>
              <span className="block text-xs text-slate-500">
                Family learning companion
              </span>
            </span>
          </Link>
          {!isLearnerSelect && activeLearner ? (
            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-meadow-500 hover:text-meadow-700"
              >
                Voice
              </Link>
              <Link
                to="/learners"
                className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-meadow-500 hover:text-meadow-700"
              >
                {activeLearner.avatarEmoji} {activeLearner.displayName}
              </Link>
            </div>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
