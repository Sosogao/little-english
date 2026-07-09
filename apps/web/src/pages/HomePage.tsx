import { Link, Navigate } from 'react-router-dom';

import { StatPill } from '@/components/ui/StatPill';
import { useLearnerStore } from '@/stores/learnerStore';
import { useLearningStore } from '@/stores/learningStore';
import { useThemeStore } from '@/stores/themeStore';
import { todayIsoDate } from '@/utils/date';

export function HomePage() {
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
  const reviewItems = useLearningStore((state) => state.reviewItems);
  const flowProgress = useLearningStore((state) => state.flowProgress);
  const getFlowProgress = useLearningStore((state) => state.getFlowProgress);

  if (!activeLearner) {
    return <Navigate to="/learners" replace />;
  }

  const companion = getCompanionForLearner(activeLearner.id);
  const profile = getProfileForLearner(activeLearner.id);
  const todayTheme = getTodayThemeForLearner(activeLearner.id);
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
  const isDayOneComplete = progress.completedStepIds.includes('congratulations');
  const primaryActionLabel = isDayOneComplete ? 'Continue Learning' : 'Start Today';
  const primaryActionTarget = isDayOneComplete ? '#journey-timeline' : '/learn';

  const journeySteps = [
    { title: 'Warm-up', detail: `${todayTheme.content.warmup.length} quick lines` },
    {
      title: 'Conversation',
      detail: `${todayTheme.content.conversation.length} gentle turns`,
    },
    {
      title: 'Useful Sentences',
      detail: `${todayTheme.content.usefulSentences.length} everyday lines`,
    },
    {
      title: 'Vocabulary',
      detail: `${todayTheme.content.vocabulary.length} farm words`,
    },
    { title: 'Story', detail: todayTheme.content.story.title },
    { title: 'Shadowing', detail: `${todayTheme.content.shadowing.length} repeats` },
    { title: 'Memory Garden', detail: `${reviewCount} due today` },
    { title: 'Mission', detail: todayTheme.content.mission.exampleSentence },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
              Day {todayTheme.dayIndex}
            </p>
            <span className="rounded-full bg-sunshine-100 px-3 py-1 text-xs font-bold text-amber-800">
              {todayTheme.status}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Welcome back, {activeLearner.displayName}
          </h1>
          <p className="mt-4 text-2xl font-bold text-meadow-700">
            {todayTheme.adventureTitle}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {companion?.name} is ready for {todayTheme.title}: familiar farm
            words, useful sentences, a short story, and one family mission.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <StatPill label="Theme" value={todayTheme.theme} />
            <StatPill label="Goal" value={`${todayTheme.estimatedMinutes} min`} />
            <StatPill label="Review" value={`${reviewCount} due`} />
            <StatPill label="Streak" value={`${activeLearner.streakDays} days`} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {isDayOneComplete ? (
              <a
                href={primaryActionTarget}
                className="rounded-full bg-meadow-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700"
              >
                {primaryActionLabel}
              </a>
            ) : (
              <Link
                to={primaryActionTarget}
                className="rounded-full bg-meadow-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700"
              >
                {primaryActionLabel}
              </Link>
            )}
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
            &quot;Let&apos;s say one brave English sentence today.&quot;
          </p>
          <div className="mt-6 rounded-3xl bg-white/10 p-4">
            <p className="text-sm font-bold text-white">Today&apos;s mission</p>
            <p className="mt-2 text-sm leading-6 text-meadow-50">
              {todayTheme.content.mission.instruction}
            </p>
          </div>
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

      <JourneyTimeline isDayOneComplete={isDayOneComplete} />

      <div id="today-plan" className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
              Today&apos;s journey
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              {todayTheme.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            A calm path for today: mostly familiar practice, a little new
            language, and one small challenge.
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {journeySteps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-center gap-4 rounded-3xl border border-amber-100 bg-[#fffdf7] p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sunshine-100 text-sm font-bold text-amber-800">
                {index + 1}
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-900">
                  {step.title}
                </span>
                <span className="block text-sm text-slate-500">{step.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyTimeline({ isDayOneComplete }: { isDayOneComplete: boolean }) {
  const timeline = [
    {
      day: 'Day1',
      title: 'Farm',
      marker: isDayOneComplete ? '✅' : '▶',
      state: isDayOneComplete ? 'Completed' : 'Today',
      tone: isDayOneComplete ? 'complete' : 'active',
    },
    {
      day: 'Day2',
      title: 'Zoo',
      marker: isDayOneComplete ? '▶' : '🔒',
      state: isDayOneComplete ? 'Next adventure' : 'Locked',
      tone: isDayOneComplete ? 'active' : 'locked',
    },
    {
      day: 'Day3',
      title: 'Birthday',
      marker: '🔒',
      state: 'Locked',
      tone: 'locked',
    },
    {
      day: 'Day4',
      title: 'School',
      marker: '🔒',
      state: 'Locked',
      tone: 'locked',
    },
  ];

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
            Your next adventure
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Complete one adventure at a time. The next stop unlocks after today&apos;s
          journey is done.
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {timeline.map((item) => (
          <div
            key={`${item.day}-${item.title}`}
            className={[
              'rounded-3xl border p-4',
              item.tone === 'active'
                ? 'border-meadow-500 bg-meadow-50'
                : item.tone === 'complete'
                  ? 'border-amber-100 bg-[#fffdf7]'
                  : 'border-slate-100 bg-slate-50',
            ].join(' ')}
          >
            <p className="text-2xl">{item.marker}</p>
            <p className="mt-3 text-sm font-bold text-slate-500">{item.day}</p>
            <p className="mt-1 text-xl font-bold text-slate-950">{item.title}</p>
            <p className="mt-2 text-sm font-semibold text-meadow-700">
              {item.state}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
