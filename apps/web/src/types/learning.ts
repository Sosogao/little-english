export type HomeMetric = {
  label: string;
  value: string;
};

export type LearningStepId =
  | 'warmup'
  | 'listen'
  | 'conversation'
  | 'sentences'
  | 'vocabulary'
  | 'story'
  | 'shadowing'
  | 'memory'
  | 'mission'
  | 'congratulations';

export const adventureFlowSteps: Array<{
  id: LearningStepId;
  title: string;
}> = [
  { id: 'warmup', title: 'Summer Welcome' },
  { id: 'listen', title: 'Listen' },
  { id: 'shadowing', title: 'Speak' },
  { id: 'vocabulary', title: 'Vocabulary' },
  { id: 'sentences', title: 'Useful Sentences' },
  { id: 'story', title: 'Story' },
  { id: 'conversation', title: 'Conversation' },
  { id: 'mission', title: 'Mission' },
  { id: 'memory', title: 'Memory Garden' },
  { id: 'congratulations', title: 'Celebration' },
];

export type LearningFlowProgress = {
  themePlanId: string;
  learnerId: string;
  currentStepId: LearningStepId;
  completedStepIds: LearningStepId[];
  completedAt?: string;
  updatedAt: string;
};
