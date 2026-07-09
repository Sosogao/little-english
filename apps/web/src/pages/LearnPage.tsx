import { Link, Navigate } from 'react-router-dom';

import { useLearnerStore } from '@/stores/learnerStore';
import { useLearningStore } from '@/stores/learningStore';
import { useThemeStore } from '@/stores/themeStore';
import type { ThemePlan } from '@/types/database';
import type { LearningStepId } from '@/types/learning';
import type { ReactNode } from 'react';

const learningSteps: Array<{ id: LearningStepId; title: string }> = [
  { id: 'warmup', title: 'Warm-up' },
  { id: 'conversation', title: 'Conversation' },
  { id: 'sentences', title: 'Useful Sentences' },
  { id: 'vocabulary', title: 'Vocabulary' },
  { id: 'story', title: 'Story' },
  { id: 'shadowing', title: 'Shadowing' },
  { id: 'memory', title: 'Memory Garden' },
  { id: 'mission', title: 'Mission' },
  { id: 'congratulations', title: 'Congratulations' },
];

function getStepIndex(stepId: LearningStepId) {
  return learningSteps.findIndex((step) => step.id === stepId);
}

export function LearnPage() {
  const activeLearner = useLearnerStore((state) => state.getActiveLearner());
  const getCompanionForLearner = useLearnerStore(
    (state) => state.getCompanionForLearner,
  );
  const getTodayThemeForLearner = useThemeStore(
    (state) => state.getTodayThemeForLearner,
  );
  const getFlowProgress = useLearningStore((state) => state.getFlowProgress);
  const setCurrentStep = useLearningStore((state) => state.setCurrentStep);
  const completeLearningStep = useLearningStore(
    (state) => state.completeLearningStep,
  );
  const flowProgress = useLearningStore((state) => state.flowProgress);

  if (!activeLearner) {
    return <Navigate to="/learners" replace />;
  }

  const todayTheme = getTodayThemeForLearner(activeLearner.id);

  if (!todayTheme) {
    return <Navigate to="/" replace />;
  }

  const companion = getCompanionForLearner(activeLearner.id);
  const progress =
    flowProgress.find(
      (savedProgress) =>
        savedProgress.themePlanId === todayTheme.id &&
        savedProgress.learnerId === activeLearner.id,
    ) ?? getFlowProgress(todayTheme.id, activeLearner.id);
  const savedStepIndex = getStepIndex(progress.currentStepId);
  const currentStepIndex = savedStepIndex === -1 ? 0 : savedStepIndex;
  const currentStep = learningSteps[currentStepIndex] ?? learningSteps[0];
  const completedCount = progress.completedStepIds.length;
  const progressPercent = Math.round((completedCount / learningSteps.length) * 100);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === learningSteps.length - 1;

  const goToStep = (stepId: LearningStepId) => {
    setCurrentStep(todayTheme.id, activeLearner.id, stepId);
  };

  const goNext = () => {
    completeLearningStep(
      todayTheme,
      activeLearner.id,
      currentStep.id,
      activeLearner.streakDays,
    );

    if (!isLastStep) {
      goToStep(learningSteps[currentStepIndex + 1].id);
    }
  };

  const goPrevious = () => {
    if (!isFirstStep) {
      goToStep(learningSteps[currentStepIndex - 1].id);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
              {todayTheme.title} · Day {todayTheme.dayIndex}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              {currentStep.title}
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-meadow-500 hover:text-meadow-700"
          >
            Home
          </Link>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
            <span>{completedCount} of {learningSteps.length} complete</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-amber-100">
            <div
              className="h-full rounded-full bg-meadow-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] bg-white p-4 shadow-sm">
          <nav className="space-y-2">
            {learningSteps.map((step, index) => {
              const isCurrent = step.id === currentStep.id;
              const isComplete = progress.completedStepIds.includes(step.id);

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(step.id)}
                  className={[
                    'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition',
                    isCurrent
                      ? 'bg-meadow-100 text-meadow-700'
                      : 'text-slate-600 hover:bg-amber-50',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold',
                      isComplete
                        ? 'bg-meadow-500 text-white'
                        : 'bg-sunshine-100 text-amber-800',
                    ].join(' ')}
                  >
                    {isComplete ? '✓' : index + 1}
                  </span>
                  <span className="text-sm font-bold">{step.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <StepContent
            activeLearnerName={activeLearner.displayName}
            companionName={companion?.name ?? 'Your companion'}
            stepId={currentStep.id}
            theme={todayTheme}
          />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-5">
            <button
              type="button"
              onClick={goPrevious}
              disabled={isFirstStep}
              className="rounded-full border border-amber-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-meadow-500 hover:text-meadow-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-full bg-meadow-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700"
            >
              {isLastStep ? 'Finish Adventure' : 'Complete and Continue'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

type StepContentProps = {
  activeLearnerName: string;
  companionName: string;
  stepId: LearningStepId;
  theme: ThemePlan;
};

function StepContent({
  activeLearnerName,
  companionName,
  stepId,
  theme,
}: StepContentProps) {
  if (stepId === 'warmup') {
    return (
      <LearningPanel
        eyebrow="Get ready"
        title="Say these lines slowly"
        description={`${companionName} starts with familiar words before anything new.`}
      >
        <LineList items={theme.content.warmup} />
      </LearningPanel>
    );
  }

  if (stepId === 'conversation') {
    return (
      <LearningPanel
        eyebrow="Practice together"
        title="A short farm conversation"
        description="Read the companion lines first, then answer with the learner lines."
      >
        <div className="space-y-3">
          {theme.content.conversation.map((turn, index) => (
            <div
              key={`${turn.speaker}-${index}`}
              className={[
                'rounded-3xl p-4',
                turn.speaker === 'companion'
                  ? 'bg-meadow-50'
                  : 'bg-sunshine-100',
              ].join(' ')}
            >
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {turn.speaker === 'companion' ? companionName : activeLearnerName}
              </p>
              <p className="mt-2 text-xl font-bold text-slate-950">{turn.text}</p>
              {turn.chineseHint ? (
                <p className="mt-1 text-sm text-slate-500">{turn.chineseHint}</p>
              ) : null}
            </div>
          ))}
        </div>
      </LearningPanel>
    );
  }

  if (stepId === 'sentences') {
    return (
      <LearningPanel
        eyebrow="Useful sentences"
        title="Keep these sentences for real life"
        description="These are the phrases to recognize and say today."
      >
        <LineList items={theme.content.usefulSentences} />
      </LearningPanel>
    );
  }

  if (stepId === 'vocabulary') {
    return (
      <LearningPanel
        eyebrow="Vocabulary"
        title="Meet the farm words"
        description="Look at the word, meaning, and example. No scoring yet."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {theme.content.vocabulary.map((item) => (
            <div key={item.id} className="rounded-3xl bg-[#fffdf7] p-4">
              <p className="text-2xl font-bold text-slate-950">{item.word}</p>
              <p className="mt-1 text-sm font-semibold text-meadow-700">
                {item.meaningZh}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.example}
              </p>
            </div>
          ))}
        </div>
      </LearningPanel>
    );
  }

  if (stepId === 'story') {
    return (
      <LearningPanel
        eyebrow="Story listening"
        title={theme.content.story.title}
        description="Read the story like a calm listening activity."
      >
        <div className="space-y-4">
          {theme.content.story.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-8 text-slate-700">
              {paragraph}
            </p>
          ))}
          {theme.content.story.questions.map((question) => (
            <div key={question.id} className="rounded-3xl bg-meadow-50 p-4">
              <p className="text-sm font-bold text-slate-900">{question.question}</p>
              {question.options ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <span
                      key={option}
                      className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="mt-3 text-sm text-meadow-700">
                Answer: {question.answer}
              </p>
            </div>
          ))}
        </div>
      </LearningPanel>
    );
  }

  if (stepId === 'shadowing') {
    return (
      <LearningPanel
        eyebrow="Shadowing"
        title="Repeat with rhythm"
        description="Say each sentence once normally and once more slowly."
      >
        <LineList items={theme.content.shadowing} />
      </LearningPanel>
    );
  }

  if (stepId === 'memory') {
    return (
      <LearningPanel
        eyebrow="Memory Garden"
        title="Review what appeared today"
        description="This is a simple local review preview. The full review engine comes later."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {theme.content.vocabulary.map((item) => (
            <div key={item.id} className="rounded-3xl border border-amber-100 p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Remember
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{item.word}</p>
              <p className="mt-1 text-sm text-slate-500">{item.meaningZh}</p>
            </div>
          ))}
        </div>
      </LearningPanel>
    );
  }

  if (stepId === 'mission') {
    return (
      <LearningPanel
        eyebrow="Real-world mission"
        title="Use one sentence at home"
        description="Mark this step complete after the learner tries the sentence."
      >
        <div className="rounded-3xl bg-sunshine-100 p-5">
          <p className="text-lg font-bold text-slate-950">
            {theme.content.mission.instruction}
          </p>
          <p className="mt-3 text-2xl font-bold text-amber-900">
            {theme.content.mission.exampleSentence}
          </p>
        </div>
      </LearningPanel>
    );
  }

  return (
    <LearningPanel
      eyebrow="Adventure complete"
      title={`Great work, ${activeLearnerName}`}
      description="Today&apos;s farm journey is complete. The saved progress will stay after refresh."
    >
      <div className="rounded-[2rem] bg-meadow-700 p-6 text-white">
        <p className="text-4xl">🌟</p>
        <p className="mt-4 text-2xl font-bold">You finished {theme.title}.</p>
        <p className="mt-2 text-sm leading-6 text-meadow-50">
          Come back tomorrow for the next part of the journey.
        </p>
      </div>
    </LearningPanel>
  );
}

type LearningPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

function LearningPanel({
  eyebrow,
  title,
  description,
  children,
}: LearningPanelProps) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
        {description}
      </p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function LineList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex items-center gap-4 rounded-3xl bg-[#fffdf7] p-4"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sunshine-100 text-sm font-bold text-amber-800">
            {index + 1}
          </span>
          <p className="text-xl font-bold text-slate-950">{item}</p>
        </div>
      ))}
    </div>
  );
}
