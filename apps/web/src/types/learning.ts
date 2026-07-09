export type HomeMetric = {
  label: string;
  value: string;
};

export type LearningStepId =
  | 'warmup'
  | 'conversation'
  | 'sentences'
  | 'vocabulary'
  | 'story'
  | 'shadowing'
  | 'memory'
  | 'mission'
  | 'congratulations';

export type LearningFlowProgress = {
  themePlanId: string;
  learnerId: string;
  currentStepId: LearningStepId;
  completedStepIds: LearningStepId[];
  completedAt?: string;
  updatedAt: string;
};
