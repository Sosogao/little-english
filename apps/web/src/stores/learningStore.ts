import { create } from 'zustand';

import {
  loadJson,
  saveJson,
  storageKeys,
} from '@/services/storageService';
import type {
  GrowthSnapshot,
  LearningEvent,
  LearningMemory,
  ThemePlan,
  VocabularyItem,
} from '@/types/database';
import type { LearningFlowProgress, LearningStepId } from '@/types/learning';
import { todayIsoDate } from '@/utils/date';
import { clampMastery } from '@/utils/mastery';

const firstStepId: LearningStepId = 'warmup';

type LearningState = {
  reviewCount: number;
  flowProgress: LearningFlowProgress[];
  learningMemory: LearningMemory[];
  learningEvents: LearningEvent[];
  growthSnapshots: GrowthSnapshot[];
  getFlowProgress: (
    themePlanId: string,
    learnerId: string,
  ) => LearningFlowProgress;
  setCurrentStep: (
    themePlanId: string,
    learnerId: string,
    stepId: LearningStepId,
  ) => void;
  completeStep: (
    themePlanId: string,
    learnerId: string,
    stepId: LearningStepId,
  ) => void;
  completeLearningStep: (
    themePlan: ThemePlan,
    learnerId: string,
    stepId: LearningStepId,
    streakDays: number,
  ) => void;
};

function loadFlowProgress() {
  return loadJson<LearningFlowProgress[]>(storageKeys.learningFlowProgress, []);
}

function saveFlowProgress(flowProgress: LearningFlowProgress[]) {
  saveJson(storageKeys.learningFlowProgress, flowProgress);
}

function loadLearningMemory() {
  return loadJson<LearningMemory[]>(storageKeys.learningMemory, []);
}

function saveLearningMemory(learningMemory: LearningMemory[]) {
  saveJson(storageKeys.learningMemory, learningMemory);
}

function loadLearningEvents() {
  return loadJson<LearningEvent[]>(storageKeys.learningEvents, []);
}

function saveLearningEvents(learningEvents: LearningEvent[]) {
  saveJson(storageKeys.learningEvents, learningEvents);
}

function loadGrowthSnapshots() {
  return loadJson<GrowthSnapshot[]>(storageKeys.growthSnapshots, []);
}

function saveGrowthSnapshots(growthSnapshots: GrowthSnapshot[]) {
  saveJson(storageKeys.growthSnapshots, growthSnapshots);
}

function createProgress(themePlanId: string, learnerId: string): LearningFlowProgress {
  return {
    themePlanId,
    learnerId,
    currentStepId: firstStepId,
    completedStepIds: [],
    updatedAt: new Date().toISOString(),
  };
}

function upsertProgress(
  flowProgress: LearningFlowProgress[],
  nextProgress: LearningFlowProgress,
) {
  const index = flowProgress.findIndex(
    (progress) =>
      progress.themePlanId === nextProgress.themePlanId &&
      progress.learnerId === nextProgress.learnerId,
  );

  if (index === -1) {
    return [...flowProgress, nextProgress];
  }

  return flowProgress.map((progress, progressIndex) =>
    progressIndex === index ? nextProgress : progress,
  );
}

function normalizeContent(content: string) {
  return content.trim().toLowerCase();
}

function memoryId(learnerId: string, type: LearningMemory['type'], content: string) {
  return `memory_${learnerId}_${type}_${normalizeContent(content).replace(/[^a-z0-9]+/g, '_')}`;
}

function eventId(learnerId: string, type: LearningEvent['type']) {
  return `event_${learnerId}_${type}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function getMasteryStatus(
  mastery: number,
): LearningMemory['status'] {
  if (mastery >= 91) return 'mastered';
  if (mastery >= 71) return 'reviewing';
  if (mastery >= 31) return 'learning';
  return 'new';
}

function upsertMemory(
  learningMemory: LearningMemory[],
  input: {
    learnerId: string;
    type: LearningMemory['type'];
    content: string;
    meaningZh?: string;
    example?: string;
    masteryDelta: number;
    seenAt: string;
  },
) {
  const normalizedContent = normalizeContent(input.content);
  const existingMemory = learningMemory.find(
    (memory) =>
      memory.learnerId === input.learnerId &&
      memory.type === input.type &&
      memory.normalizedContent === normalizedContent,
  );

  if (!existingMemory) {
    const mastery = clampMastery(input.masteryDelta);
    const nextMemory: LearningMemory = {
      id: memoryId(input.learnerId, input.type, input.content),
      learnerId: input.learnerId,
      type: input.type,
      content: input.content,
      normalizedContent,
      meaningZh: input.meaningZh,
      examples: input.example ? [input.example] : [],
      mastery,
      exposureCount: 1,
      correctCount: 0,
      mistakeCount: 0,
      firstSeenAt: input.seenAt,
      lastSeenAt: input.seenAt,
      status: getMasteryStatus(mastery),
    };

    return [...learningMemory, nextMemory];
  }

  const mastery = clampMastery(existingMemory.mastery + input.masteryDelta);
  const examples =
    input.example && !existingMemory.examples.includes(input.example)
      ? [...existingMemory.examples, input.example]
      : existingMemory.examples;

  return learningMemory.map((memory) =>
    memory.id === existingMemory.id
      ? {
          ...memory,
          meaningZh: memory.meaningZh ?? input.meaningZh,
          examples,
          mastery,
          exposureCount: memory.exposureCount + 1,
          lastSeenAt: input.seenAt,
          status: getMasteryStatus(mastery),
        }
      : memory,
  );
}

function appendEvent(
  learningEvents: LearningEvent[],
  input: Omit<LearningEvent, 'id' | 'createdAt'>,
  createdAt: string,
) {
  return [
    ...learningEvents,
    {
      ...input,
      id: eventId(input.learnerId, input.type),
      createdAt,
    },
  ];
}

function updateGrowthSnapshot(
  growthSnapshots: GrowthSnapshot[],
  input: {
    learnerId: string;
    streakDays: number;
    learningMemory: LearningMemory[];
    learningEvents: LearningEvent[];
  },
) {
  const date = todayIsoDate();
  const learnerMemory = input.learningMemory.filter(
    (memory) => memory.learnerId === input.learnerId,
  );
  const learnerEvents = input.learningEvents.filter(
    (event) => event.learnerId === input.learnerId,
  );
  const completedThemeIds = new Set(
    learnerEvents
      .filter((event) => event.type === 'theme_completed' && event.themePlanId)
      .map((event) => event.themePlanId),
  );
  const nextSnapshot: GrowthSnapshot = {
    id: `growth_${input.learnerId}_${date}`,
    learnerId: input.learnerId,
    date,
    totalWords: learnerMemory.filter((memory) => memory.type === 'word').length,
    masteredWords: learnerMemory.filter(
      (memory) => memory.type === 'word' && memory.status === 'mastered',
    ).length,
    totalSentences: learnerMemory.filter((memory) => memory.type === 'sentence')
      .length,
    completedThemes: completedThemeIds.size,
    streakDays: input.streakDays,
  };

  const index = growthSnapshots.findIndex(
    (snapshot) =>
      snapshot.learnerId === input.learnerId && snapshot.date === date,
  );

  if (index === -1) {
    return [...growthSnapshots, nextSnapshot];
  }

  return growthSnapshots.map((snapshot, snapshotIndex) =>
    snapshotIndex === index ? nextSnapshot : snapshot,
  );
}

function recordWordSeen(
  learningMemory: LearningMemory[],
  learnerId: string,
  item: VocabularyItem,
  seenAt: string,
) {
  return upsertMemory(learningMemory, {
    learnerId,
    type: 'word',
    content: item.word,
    meaningZh: item.meaningZh,
    example: item.example,
    masteryDelta: 12,
    seenAt,
  });
}

function findMemory(
  learningMemory: LearningMemory[],
  learnerId: string,
  type: LearningMemory['type'],
  content: string,
) {
  const normalizedContent = normalizeContent(content);

  return learningMemory.find(
    (memory) =>
      memory.learnerId === learnerId &&
      memory.type === type &&
      memory.normalizedContent === normalizedContent,
  );
}

function recordSentencePracticed(
  learningMemory: LearningMemory[],
  learnerId: string,
  sentence: string,
  seenAt: string,
) {
  return upsertMemory(learningMemory, {
    learnerId,
    type: 'sentence',
    content: sentence,
    example: sentence,
    masteryDelta: 8,
    seenAt,
  });
}

function addStepLearningData(
  input: {
    themePlan: ThemePlan;
    learnerId: string;
    stepId: LearningStepId;
    learningMemory: LearningMemory[];
    learningEvents: LearningEvent[];
    seenAt: string;
  },
) {
  let learningMemory = input.learningMemory;
  let learningEvents = input.learningEvents;
  const eventBase = {
    learnerId: input.learnerId,
    themePlanId: input.themePlan.id,
  };

  if (input.stepId === 'warmup') {
    learningEvents = appendEvent(
      learningEvents,
      {
        ...eventBase,
        type: 'theme_started',
        payload: {
          title: input.themePlan.title,
          dayIndex: input.themePlan.dayIndex,
        },
      },
      input.seenAt,
    );
    input.themePlan.content.warmup.forEach((sentence) => {
      learningMemory = recordSentencePracticed(
        learningMemory,
        input.learnerId,
        sentence,
        input.seenAt,
      );
      learningEvents = appendEvent(
        learningEvents,
        {
          ...eventBase,
          type: 'sentence_practiced',
          payload: { stepId: input.stepId, sentence },
        },
        input.seenAt,
      );
    });
  }

  if (input.stepId === 'conversation') {
    input.themePlan.content.conversation.forEach((turn) => {
      learningMemory = recordSentencePracticed(
        learningMemory,
        input.learnerId,
        turn.text,
        input.seenAt,
      );
      learningEvents = appendEvent(
        learningEvents,
        {
          ...eventBase,
          type: 'sentence_practiced',
          payload: { stepId: input.stepId, speaker: turn.speaker, sentence: turn.text },
        },
        input.seenAt,
      );
    });
    learningEvents = appendEvent(
      learningEvents,
      {
        ...eventBase,
        type: 'conversation_completed',
        payload: { turnCount: input.themePlan.content.conversation.length },
      },
      input.seenAt,
    );
  }

  if (input.stepId === 'sentences') {
    input.themePlan.content.usefulSentences.forEach((sentence) => {
      learningMemory = recordSentencePracticed(
        learningMemory,
        input.learnerId,
        sentence,
        input.seenAt,
      );
      learningEvents = appendEvent(
        learningEvents,
        {
          ...eventBase,
          type: 'sentence_practiced',
          payload: { stepId: input.stepId, sentence },
        },
        input.seenAt,
      );
    });
  }

  if (input.stepId === 'vocabulary') {
    input.themePlan.content.vocabulary.forEach((item) => {
      const beforeMemory = findMemory(
        learningMemory,
        input.learnerId,
        'word',
        item.word,
      );
      learningMemory = recordWordSeen(
        learningMemory,
        input.learnerId,
        item,
        input.seenAt,
      );
      learningEvents = appendEvent(
        learningEvents,
        {
          ...eventBase,
          type: 'word_seen',
          payload: {
            word: item.word,
            meaningZh: item.meaningZh,
            difficulty: item.difficulty,
          },
        },
        input.seenAt,
      );
      const afterMemory = findMemory(
        learningMemory,
        input.learnerId,
        'word',
        item.word,
      );

      if (
        afterMemory?.status === 'mastered' &&
        beforeMemory?.status !== 'mastered'
      ) {
        learningEvents = appendEvent(
          learningEvents,
          {
            ...eventBase,
            type: 'word_mastered',
            payload: { word: item.word, mastery: afterMemory.mastery },
          },
          input.seenAt,
        );
      }
    });
  }

  if (input.stepId === 'story') {
    learningEvents = appendEvent(
      learningEvents,
      {
        ...eventBase,
        type: 'story_completed',
        payload: { storyTitle: input.themePlan.content.story.title },
      },
      input.seenAt,
    );
  }

  if (input.stepId === 'shadowing') {
    input.themePlan.content.shadowing.forEach((sentence) => {
      learningMemory = recordSentencePracticed(
        learningMemory,
        input.learnerId,
        sentence,
        input.seenAt,
      );
      learningEvents = appendEvent(
        learningEvents,
        {
          ...eventBase,
          type: 'sentence_practiced',
          payload: { stepId: input.stepId, sentence },
        },
        input.seenAt,
      );
    });
    learningEvents = appendEvent(
      learningEvents,
      {
        ...eventBase,
        type: 'shadowing_completed',
        payload: { sentenceCount: input.themePlan.content.shadowing.length },
      },
      input.seenAt,
    );
  }

  if (input.stepId === 'memory') {
    learningEvents = appendEvent(
      learningEvents,
      {
        ...eventBase,
        type: 'review_completed',
        payload: {
          reviewedWords: input.themePlan.content.vocabulary.map((item) => item.word),
          source: 'memory_garden_preview',
        },
      },
      input.seenAt,
    );
  }

  if (input.stepId === 'mission') {
    learningMemory = recordSentencePracticed(
      learningMemory,
      input.learnerId,
      input.themePlan.content.mission.exampleSentence,
      input.seenAt,
    );
    learningEvents = appendEvent(
      learningEvents,
      {
        ...eventBase,
        type: 'mission_completed',
        payload: {
          missionId: input.themePlan.content.mission.id,
          sentence: input.themePlan.content.mission.exampleSentence,
        },
      },
      input.seenAt,
    );
  }

  if (input.stepId === 'congratulations') {
    learningEvents = appendEvent(
      learningEvents,
      {
        ...eventBase,
        type: 'theme_completed',
        payload: {
          title: input.themePlan.title,
          dayIndex: input.themePlan.dayIndex,
        },
      },
      input.seenAt,
    );
  }

  return { learningMemory, learningEvents };
}

export const useLearningStore = create<LearningState>((set, get) => ({
  reviewCount: 0,
  flowProgress: loadFlowProgress(),
  learningMemory: loadLearningMemory(),
  learningEvents: loadLearningEvents(),
  growthSnapshots: loadGrowthSnapshots(),
  getFlowProgress: (themePlanId, learnerId) => {
    const existingProgress = get().flowProgress.find(
      (progress) =>
        progress.themePlanId === themePlanId && progress.learnerId === learnerId,
    );

    return existingProgress ?? createProgress(themePlanId, learnerId);
  },
  setCurrentStep: (themePlanId, learnerId, stepId) => {
    const progress = get().getFlowProgress(themePlanId, learnerId);
    const nextProgress = {
      ...progress,
      currentStepId: stepId,
      updatedAt: new Date().toISOString(),
    };
    const nextFlowProgress = upsertProgress(get().flowProgress, nextProgress);
    saveFlowProgress(nextFlowProgress);
    set({ flowProgress: nextFlowProgress });
  },
  completeStep: (themePlanId, learnerId, stepId) => {
    const progress = get().getFlowProgress(themePlanId, learnerId);
    const completedStepIds = progress.completedStepIds.includes(stepId)
      ? progress.completedStepIds
      : [...progress.completedStepIds, stepId];
    const nextProgress = {
      ...progress,
      completedStepIds,
      completedAt:
        stepId === 'congratulations'
          ? new Date().toISOString()
          : progress.completedAt,
      updatedAt: new Date().toISOString(),
    };
    const nextFlowProgress = upsertProgress(get().flowProgress, nextProgress);
    saveFlowProgress(nextFlowProgress);
    set({ flowProgress: nextFlowProgress });
  },
  completeLearningStep: (themePlan, learnerId, stepId, streakDays) => {
    const progress = get().getFlowProgress(themePlan.id, learnerId);
    const alreadyCompleted = progress.completedStepIds.includes(stepId);

    get().completeStep(themePlan.id, learnerId, stepId);

    if (alreadyCompleted) {
      return;
    }

    const seenAt = new Date().toISOString();
    const { learningMemory, learningEvents } = addStepLearningData({
      themePlan,
      learnerId,
      stepId,
      learningMemory: get().learningMemory,
      learningEvents: get().learningEvents,
      seenAt,
    });
    const growthSnapshots = updateGrowthSnapshot(get().growthSnapshots, {
      learnerId,
      streakDays,
      learningMemory,
      learningEvents,
    });

    saveLearningMemory(learningMemory);
    saveLearningEvents(learningEvents);
    saveGrowthSnapshots(growthSnapshots);
    set({ learningMemory, learningEvents, growthSnapshots });
  },
}));
