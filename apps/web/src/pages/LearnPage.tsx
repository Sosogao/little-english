import { useEffect, useState, type ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useLearnerStore } from '@/stores/learnerStore';
import { useLearningStore } from '@/stores/learningStore';
import { useThemeStore } from '@/stores/themeStore';
import {
  getVoices,
  speak,
  stop,
  subscribeToVoiceChanges,
} from '@/services/voiceService';
import type { LearningMemory, MemoryReviewItem, ThemePlan } from '@/types/database';
import type { LearningStepId } from '@/types/learning';
import type { ReviewResult } from '@/services/reviewService';
import { todayIsoDate } from '@/utils/date';

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
  const navigate = useNavigate();
  const activeLearner = useLearnerStore((state) => state.getActiveLearner());
  const getCompanionForLearner = useLearnerStore(
    (state) => state.getCompanionForLearner,
  );
  const getTodayThemeForLearner = useThemeStore(
    (state) => state.getTodayThemeForLearner,
  );
  const getThemesForLearner = useThemeStore((state) => state.getThemesForLearner);
  const startThemeForLearner = useThemeStore(
    (state) => state.startThemeForLearner,
  );
  const getFlowProgress = useLearningStore((state) => state.getFlowProgress);
  const setCurrentStep = useLearningStore((state) => state.setCurrentStep);
  const completeLearningStep = useLearningStore(
    (state) => state.completeLearningStep,
  );
  const reviewMemoryItem = useLearningStore((state) => state.reviewMemoryItem);
  const flowProgress = useLearningStore((state) => state.flowProgress);
  const reviewItems = useLearningStore((state) => state.reviewItems);
  const learningMemory = useLearningStore((state) => state.learningMemory);
  const [englishVoiceCount, setEnglishVoiceCount] = useState(getVoices().length);

  useEffect(() => {
    const syncVoices = () => setEnglishVoiceCount(getVoices().length);

    syncVoices();

    return subscribeToVoiceChanges(syncVoices);
  }, []);

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
  const dueReviewItems = reviewItems
    .filter(
      (item) =>
        item.learnerId === activeLearner.id && item.dueDate <= todayIsoDate(),
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const completedCount = progress.completedStepIds.length;
  const progressPercent = Math.round((completedCount / learningSteps.length) * 100);
  const celebrationStats = getCelebrationStats(todayTheme);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === learningSteps.length - 1;
  const isMissionStep = currentStep.id === 'mission';
  const nextTheme = getThemesForLearner(activeLearner.id).find(
    (theme) => theme.dayIndex === todayTheme.dayIndex + 1,
  );

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
      const nextStepId = learningSteps[currentStepIndex + 1].id;
      goToStep(nextStepId);

      if (nextStepId === 'congratulations') {
        completeLearningStep(
          todayTheme,
          activeLearner.id,
          nextStepId,
          activeLearner.streakDays,
        );
      }
    }
  };

  const goPrevious = () => {
    if (!isFirstStep) {
      goToStep(learningSteps[currentStepIndex - 1].id);
    }
  };

  const continueNextAdventure = () => {
    if (!nextTheme) {
      return;
    }

    startThemeForLearner(activeLearner.id, nextTheme.dayIndex);
    navigate('/learn');
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
              {currentStep.id === 'congratulations'
                ? 'Celebration'
                : currentStep.title}
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-meadow-500 hover:text-meadow-700"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={stop}
            className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-meadow-500 hover:text-meadow-700"
          >
            Stop Voice
          </button>
        </div>

        {englishVoiceCount === 0 ? (
          <div className="mt-5 rounded-3xl bg-sunshine-100 p-4">
            <p className="text-sm font-semibold text-slate-700">
              No English system voice found. You can still read the lesson, or
              enable an English voice in browser settings.
            </p>
          </div>
        ) : null}

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
            <span>Adventure Progress</span>
            <span>Adventure {progressPercent}%</span>
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
            celebrationStats={celebrationStats}
            companionName={companion?.name ?? 'Summer'}
            dueReviewItems={dueReviewItems}
            getMemoryForReviewItem={(reviewItem) =>
              learningMemory.find((memory) => memory.id === reviewItem.memoryId)
            }
            onReview={(reviewItemId, result) =>
              reviewMemoryItem(activeLearner.id, reviewItemId, result)
            }
            stepId={currentStep.id}
            theme={todayTheme}
            hasNextTheme={Boolean(nextTheme)}
            onContinueNextAdventure={continueNextAdventure}
          />

          {currentStep.id === 'congratulations' ? null : (
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
                {isLastStep || isMissionStep
                  ? 'Finish Adventure'
                  : 'Complete and Continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type StepContentProps = {
  activeLearnerName: string;
  celebrationStats: CelebrationStats;
  companionName: string;
  dueReviewItems: MemoryReviewItem[];
  getMemoryForReviewItem: (
    reviewItem: MemoryReviewItem,
  ) => LearningMemory | undefined;
  onReview: (reviewItemId: string, result: ReviewResult) => void;
  stepId: LearningStepId;
  theme: ThemePlan;
  hasNextTheme: boolean;
  onContinueNextAdventure: () => void;
};

function StepContent({
  activeLearnerName,
  celebrationStats,
  companionName,
  dueReviewItems,
  getMemoryForReviewItem,
  onReview,
  stepId,
  theme,
  hasNextTheme,
  onContinueNextAdventure,
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
        title={`A short ${theme.theme.toLowerCase()} conversation`}
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
              <div className="mt-2 flex items-center gap-3">
                <p className="text-xl font-bold text-slate-950">{turn.text}</p>
                <SpeechButton text={turn.text} />
              </div>
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
        title={`Meet the ${theme.theme.toLowerCase()} words`}
        description="Look at the word, meaning, and example. No scoring yet."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {theme.content.vocabulary.map((item) => (
            <div key={item.id} className="rounded-3xl bg-[#fffdf7] p-4">
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-slate-950">{item.word}</p>
                <SpeechButton text={item.word} />
              </div>
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
            <div key={paragraph} className="flex items-start gap-3">
              <p className="text-lg leading-8 text-slate-700">{paragraph}</p>
              <SpeechButton text={paragraph} />
            </div>
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
        title="Review what is due"
        description="Choose how the learner remembered each item. The next review date is saved locally."
      >
        <MemoryGardenReview
          dueReviewItems={dueReviewItems}
          getMemoryForReviewItem={getMemoryForReviewItem}
          onReview={onReview}
          theme={theme}
        />
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
    <CelebrationPage
      activeLearnerName={activeLearnerName}
      hasNextTheme={hasNextTheme}
      onContinueNextAdventure={onContinueNextAdventure}
      stats={celebrationStats}
      theme={theme}
    />
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
          <SpeechButton text={item} />
        </div>
      ))}
    </div>
  );
}

function SpeechButton({ text }: { text: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const playText = async () => {
    setIsLoading(true);

    try {
      await speak(text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={`Play ${text}`}
      aria-busy={isLoading}
      disabled={isLoading}
      onClick={playText}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-amber-100 bg-white text-sm shadow-sm transition hover:border-meadow-500 disabled:cursor-wait disabled:opacity-60"
    >
      {isLoading ? '...' : '🔊'}
    </button>
  );
}

type CelebrationStats = {
  wordsLearned: number;
  sentencesPracticed: number;
  reviewItemsCreated: number;
};

function getCelebrationStats(theme: ThemePlan): CelebrationStats {
  return {
    wordsLearned: theme.content.vocabulary.length,
    reviewItemsCreated: theme.content.vocabulary.length,
    sentencesPracticed:
      theme.content.warmup.length +
      theme.content.conversation.length +
      theme.content.usefulSentences.length +
      theme.content.shadowing.length +
      theme.content.story.paragraphs.length +
      1,
  };
}

type CelebrationPageProps = {
  activeLearnerName: string;
  hasNextTheme: boolean;
  onContinueNextAdventure: () => void;
  stats: CelebrationStats;
  theme: ThemePlan;
};

function CelebrationPage({
  activeLearnerName,
  hasNextTheme,
  onContinueNextAdventure,
  stats,
  theme,
}: CelebrationPageProps) {
  const isFinalDay = theme.dayIndex >= 30 || !hasNextTheme;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-meadow-700 p-7 text-white sm:p-10">
        <p className="text-5xl">🎉</p>
        <h2 className="mt-5 text-4xl font-bold">Congratulations</h2>
        <p className="mt-3 text-xl font-semibold text-meadow-50">
          Today&apos;s adventure completed.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-6 text-meadow-50">
          {activeLearnerName} finished {theme.title} and can keep going when
          there is time.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-[#fffdf7] p-5">
          <p className="text-sm font-semibold text-slate-500">Words learned</p>
          <p className="mt-2 text-4xl font-bold text-slate-950">
            {stats.wordsLearned}
          </p>
        </div>
        <div className="rounded-3xl bg-[#fffdf7] p-5">
          <p className="text-sm font-semibold text-slate-500">
            Sentences practiced
          </p>
          <p className="mt-2 text-4xl font-bold text-slate-950">
            {stats.sentencesPracticed}
          </p>
        </div>
        <div className="rounded-3xl bg-[#fffdf7] p-5">
          <p className="text-sm font-semibold text-slate-500">
            Review items created
          </p>
          <p className="mt-2 text-4xl font-bold text-slate-950">
            {stats.reviewItemsCreated}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {isFinalDay ? (
          <Link
            to="/"
            className="rounded-full bg-meadow-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700"
          >
            Restart / Review Journey
          </Link>
        ) : (
          <button
            type="button"
            onClick={onContinueNextAdventure}
            className="rounded-full bg-meadow-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700"
          >
            Continue Next Adventure
          </button>
        )}
        <Link
          to="/"
          className="rounded-full border border-amber-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-meadow-500 hover:text-meadow-700"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}

type MemoryGardenReviewProps = {
  dueReviewItems: MemoryReviewItem[];
  getMemoryForReviewItem: StepContentProps['getMemoryForReviewItem'];
  onReview: (reviewItemId: string, result: ReviewResult) => void;
  theme: ThemePlan;
};

function MemoryGardenReview({
  dueReviewItems,
  getMemoryForReviewItem,
  onReview,
  theme,
}: MemoryGardenReviewProps) {
  if (dueReviewItems.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl bg-meadow-50 p-5">
          <p className="text-lg font-bold text-slate-950">Nothing is due now.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Vocabulary review cards appear here after the learner completes
            Vocabulary once.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {theme.content.vocabulary.map((item) => (
            <div key={item.id} className="rounded-3xl border border-amber-100 p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Today&apos;s word
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{item.word}</p>
              <p className="mt-1 text-sm text-slate-500">{item.meaningZh}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dueReviewItems.map((reviewItem) => {
        const memory = getMemoryForReviewItem(reviewItem);

        if (!memory) {
          return null;
        }

        return (
          <div key={reviewItem.id} className="rounded-3xl bg-[#fffdf7] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Due {reviewItem.dueDate}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {memory.content}
                </p>
                {memory.meaningZh ? (
                  <p className="mt-1 text-sm font-semibold text-meadow-700">
                    {memory.meaningZh}
                  </p>
                ) : null}
                {memory.examples[0] ? (
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {memory.examples[0]}
                  </p>
                ) : null}
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-right">
                <p className="text-xs font-semibold text-slate-500">Mastery</p>
                <p className="text-2xl font-bold text-slate-950">
                  {memory.mastery}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-4">
              {reviewButtons.map((button) => (
                <button
                  key={button.result}
                  type="button"
                  onClick={() => onReview(reviewItem.id, button.result)}
                  className="rounded-2xl border border-amber-100 bg-white px-3 py-3 text-sm font-bold text-slate-700 transition hover:border-meadow-500 hover:text-meadow-700"
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const reviewButtons: Array<{ result: ReviewResult; label: string }> = [
  { result: 'again', label: 'Again' },
  { result: 'hard', label: 'Hard' },
  { result: 'good', label: 'Good' },
  { result: 'easy', label: 'Easy' },
];
