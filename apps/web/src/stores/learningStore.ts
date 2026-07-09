import { create } from 'zustand';

import {
  loadJson,
  saveJson,
  storageKeys,
} from '@/services/storageService';
import type { LearningFlowProgress, LearningStepId } from '@/types/learning';

const firstStepId: LearningStepId = 'warmup';

type LearningState = {
  reviewCount: number;
  flowProgress: LearningFlowProgress[];
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
};

function loadFlowProgress() {
  return loadJson<LearningFlowProgress[]>(storageKeys.learningFlowProgress, []);
}

function saveFlowProgress(flowProgress: LearningFlowProgress[]) {
  saveJson(storageKeys.learningFlowProgress, flowProgress);
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

export const useLearningStore = create<LearningState>((set, get) => ({
  reviewCount: 0,
  flowProgress: loadFlowProgress(),
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
}));
