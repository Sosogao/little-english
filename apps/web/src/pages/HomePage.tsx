import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useLearnerStore } from '@/stores/learnerStore';
import { useLearningStore } from '@/stores/learningStore';
import { useThemeStore } from '@/stores/themeStore';
import { todayIsoDate } from '@/utils/date';

const growthMetrics = [
  { label: 'Listening', field: 'listeningLevel' },
  { label: 'Speaking', field: 'speakingLevel' },
  { label: 'Reading', field: 'readingLevel' },
  { label: 'Vocabulary', field: 'vocabularyLevel' },
] as const;

function getSummerGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function starRating(score = 0) {
  const filled = Math.max(1, Math.min(5, Math.round(score / 20)));

  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

export function HomePage() {
  const navigate = useNavigate();
  const activeLearner = useLearnerStore((state) => state.getActiveLearner());
  const getCompanionForLearner = useLearnerStore(
    (state) => state.getCompanionForLearner,
  );
  const getProfileForLearner = useLearnerStore(
    (state) => state.getProfileForLearner,
  );
  const getTodayThemeForLearner = useThemeStore(
    (state) => state.getTodayThemeForLearner,
  );
  const getThemesForLearner = useThemeStore((state) => state.getThemesForLearner);
  const getThemeForLearnerByDay = useThemeStore(
    (state) => state.getThemeForLearnerByDay,
  );
  const startThemeForLearner = useThemeStore(
    (state) => state.startThemeForLearner,
  );
  const reviewItems = useLearningStore((state) => state.reviewItems);
  const flowProgress = useLearningStore((state) => state.flowProgress);
  const getFlowProgress = useLearningStore((state) => state.getFlowProgress);

  if (!activeLearner) {
    return <Navigate to="/learners" replace />;
  }

  const companion = getCompanionForLearner(activeLearner.id);
  const companionName = companion?.name === 'Summer' ? companion.name : 'Summer';
  const profile = getProfileForLearner(activeLearner.id);
  const todayTheme = getTodayThemeForLearner(activeLearner.id);
  const journeyThemes = getThemesForLearner(activeLearner.id);
  const dayOneTheme = getThemeForLearnerByDay(activeLearner.id, 1);
  const reviewCount = reviewItems.filter(
    (item) => item.learnerId === activeLearner.id && item.dueDate <= todayIsoDate(),
  ).length;

  if (!todayTheme) {
    return (
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-950">
          Welcome back, {activeLearner.displayName}
        </h1>
        <p className="mt-3 text-slate-600">
          Today&apos;s journey is being prepared.
        </p>
      </section>
    );
  }

  const progress =
    flowProgress.find(
      (savedProgress) =>
        savedProgress.themePlanId === todayTheme.id &&
        savedProgress.learnerId === activeLearner.id,
    ) ?? getFlowProgress(todayTheme.id, activeLearner.id);
  const dayOneProgress = dayOneTheme
    ? (flowProgress.find(
        (savedProgress) =>
          savedProgress.themePlanId === dayOneTheme.id &&
          savedProgress.learnerId === activeLearner.id,
      ) ?? getFlowProgress(dayOneTheme.id, activeLearner.id))
    : progress;
  const isDayOneComplete =
    dayOneProgress.completedStepIds.includes('congratulations') ||
    dayOneTheme?.status === 'completed' ||
    todayTheme.dayIndex > 1;
  const isTodayComplete = progress.completedStepIds.includes('congratulations');
  const primaryActionLabel = isTodayComplete
    ? 'Review Adventure'
    : isDayOneComplete
      ? 'Continue Adventure'
      : 'Start Adventure';

  const isThemeComplete = (themeId: string) => {
    const themeProgress =
      flowProgress.find(
        (savedProgress) =>
          savedProgress.themePlanId === themeId &&
          savedProgress.learnerId === activeLearner.id,
      ) ?? getFlowProgress(themeId, activeLearner.id);

    return themeProgress.completedStepIds.includes('congratulations');
  };
  const completedDayIndexes = journeyThemes
    .filter((theme) => theme.status === 'completed' || isThemeComplete(theme.id))
    .map((theme) => theme.dayIndex);
  const maxCompletedDayIndex = completedDayIndexes.length
    ? Math.max(...completedDayIndexes)
    : 0;

  const startJourneyDay = (dayIndex: number) => {
    const theme = journeyThemes.find((item) => item.dayIndex === dayIndex);

    if (!theme) {
      return;
    }

    const canOpen =
      theme.dayIndex <= maxCompletedDayIndex + 1 || theme.dayIndex === todayTheme.dayIndex;

    if (!canOpen) {
      return;
    }

    startThemeForLearner(activeLearner.id, dayIndex);
    navigate('/learn');
  };

  const nextChallengeDay = Math.min(maxCompletedDayIndex + 2, journeyThemes.length);
  const explorerLevel = Math.max(1, Math.ceil(activeLearner.totalLearningDays / 2));

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
              Summer&apos;s home
            </p>
            <span className="rounded-full bg-sunshine-100 px-3 py-1 text-xs font-bold text-amber-800">
              Day {todayTheme.dayIndex}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {getSummerGreeting()}, {activeLearner.displayName}!
          </h1>
          <p className="mt-4 text-2xl font-bold text-meadow-700">
            {companionName}: I missed you. Ready for today&apos;s adventure?
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Come back to Summer&apos;s world, continue the next adventure, water a
            few memory flowers, and see how your explorer skills are growing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/learn"
              className="rounded-full bg-meadow-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700"
            >
              {primaryActionLabel}
            </Link>
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
            {companion?.avatarEmoji ?? '🌼'}
          </div>
          <h2 className="mt-5 text-2xl font-bold">{companionName}</h2>
          <p className="mt-2 text-sm capitalize text-meadow-50">
            Warm English adventure buddy
          </p>
          <p className="mt-6 text-base leading-7 text-meadow-50">
            &quot;Listen first. Speak bravely. I&apos;ll stay with you.&quot;
          </p>
          <div className="mt-6 rounded-3xl bg-white/10 p-4">
            <p className="text-sm font-bold text-white">Family mission</p>
            <p className="mt-2 text-sm leading-6 text-meadow-50">
              {todayTheme.content.mission.instruction}
            </p>
          </div>
        </aside>
      </div>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
              Today Adventure
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Day {todayTheme.dayIndex} {todayTheme.theme}
            </h2>
          </div>
          <Link
            to="/learn"
            className="rounded-full bg-meadow-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700"
          >
            {primaryActionLabel}
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-[#fffdf7] p-5">
            <p className="text-2xl font-bold text-meadow-700">
              {todayTheme.adventureTitle}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Listen, speak, meet today&apos;s words, read a short story, and
              bring one sentence into family life.
            </p>
          </div>
          <div className="rounded-3xl bg-sunshine-100 p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-amber-800">
              Today&apos;s sentence
            </p>
            <p className="mt-3 text-2xl font-bold text-amber-950">
              {todayTheme.content.mission.exampleSentence}
            </p>
          </div>
        </div>
      </section>

      <JourneyTimeline
        activeDayIndex={todayTheme.dayIndex}
        maxCompletedDayIndex={maxCompletedDayIndex}
        onStartDay={startJourneyDay}
        themes={journeyThemes}
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
            Memory Garden
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            {reviewCount} flowers need water
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Review words when they are ready. Summer keeps the garden calm and
            local to this learner.
          </p>
          <Link
            to="/learn"
            className="mt-6 inline-flex rounded-full border border-amber-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-meadow-500 hover:text-meadow-700"
          >
            Visit Memory Garden
          </Link>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
            Adventure Challenge
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Explorer Challenge in 2 days
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            After more adventures, Summer will invite {activeLearner.displayName}
            to try a gentle challenge with listening, speaking, reading, and
            vocabulary stars.
          </p>
          <p className="mt-5 rounded-3xl bg-[#fffdf7] px-4 py-3 text-sm font-bold text-slate-700">
            Next preview: Day {nextChallengeDay || todayTheme.dayIndex} Explorer
            Challenge
          </p>
        </section>
      </div>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
              Explorer Growth
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Explorer Level {explorerLevel}
            </h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            {activeLearner.streakDays} day streak
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {growthMetrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl bg-[#fffdf7] p-5">
              <p className="text-sm font-bold text-slate-600">{metric.label}</p>
              <p className="mt-3 text-2xl font-bold text-amber-500">
                {starRating(profile?.[metric.field])}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-500">
          Focus: {profile?.learningGoal ?? 'Build a daily English adventure habit.'}
        </p>
      </section>
    </section>
  );
}

function JourneyTimeline({
  activeDayIndex,
  maxCompletedDayIndex,
  onStartDay,
  themes,
}: {
  activeDayIndex: number;
  maxCompletedDayIndex: number;
  onStartDay: (dayIndex: number) => void;
  themes: Array<{
    dayIndex: number;
    status: string;
    theme: string;
    title: string;
  }>;
}) {
  return (
    <section
      id="journey-timeline"
      className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
            Journey timeline
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Summer&apos;s 30-Day Journey
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Completed adventures stay open for review. The next available day is
          ready when the learner wants to keep going.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {themes.map((item) => {
          const isComplete =
            item.status === 'completed' || item.dayIndex <= maxCompletedDayIndex;
          const isCurrent = item.dayIndex === activeDayIndex;
          const isAvailable = item.dayIndex <= maxCompletedDayIndex + 1 || isCurrent;
          const marker = isComplete ? '✅' : isCurrent || isAvailable ? '▶' : '🔒';
          const state = isComplete
            ? 'Review'
            : isCurrent
              ? 'Continue'
              : isAvailable
                ? 'Start now'
                : 'Coming Soon';
          const cardClassName = [
              'rounded-3xl border p-4 text-left',
              isCurrent || (!isComplete && isAvailable)
                ? 'border-meadow-500 bg-meadow-50'
                : isComplete
                  ? 'border-amber-100 bg-[#fffdf7]'
                  : 'border-slate-100 bg-slate-50',
              isAvailable
                ? 'text-left transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-meadow-100'
                : 'cursor-not-allowed opacity-70',
            ].join(' ');
          const cardContent = (
            <>
              <p className="text-2xl">{marker}</p>
              <p className="mt-3 text-sm font-bold text-slate-500">
                Day {item.dayIndex}
              </p>
              <p className="mt-1 text-lg font-bold text-slate-950">{item.theme}</p>
              <p className="mt-2 text-sm font-semibold text-meadow-700">
                {state}
              </p>
            </>
          );

          return isAvailable ? (
            <button
              key={item.dayIndex}
              type="button"
              className={cardClassName}
              onClick={() => onStartDay(item.dayIndex)}
            >
              {cardContent}
            </button>
          ) : (
            <div key={item.dayIndex} className={cardClassName}>
              {cardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
