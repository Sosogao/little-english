import { create } from 'zustand';

type LearningState = {
  reviewCount: number;
};

export const useLearningStore = create<LearningState>(() => ({
  reviewCount: 0,
}));
