import { create } from 'zustand';

import { seedAppData } from '@/data/seed';
import {
  loadJson,
  loadText,
  saveText,
  storageKeys,
} from '@/services/storageService';
import type { Companion, Learner, LearnerProfile } from '@/types/database';

type LearnerState = {
  learners: Learner[];
  companions: Companion[];
  profiles: LearnerProfile[];
  activeLearnerId?: string;
  setActiveLearner: (learnerId: string) => void;
  getActiveLearner: () => Learner | undefined;
  getCompanionForLearner: (learnerId: string) => Companion | undefined;
  getProfileForLearner: (learnerId: string) => LearnerProfile | undefined;
};

function loadInitialState() {
  seedAppData();

  const learners = loadJson<Learner[]>(storageKeys.learners, []);
  const companions = loadJson<Companion[]>(storageKeys.companions, []);
  const profiles = loadJson<LearnerProfile[]>(storageKeys.learnerProfiles, []);
  const storedActiveLearnerId = loadText(storageKeys.activeLearnerId);
  const activeLearnerId = learners.some(
    (learner) => learner.id === storedActiveLearnerId,
  )
    ? storedActiveLearnerId ?? undefined
    : undefined;

  return { learners, companions, profiles, activeLearnerId };
}

export const useLearnerStore = create<LearnerState>((set, get) => ({
  ...loadInitialState(),
  setActiveLearner: (learnerId) => {
    saveText(storageKeys.activeLearnerId, learnerId);
    set({ activeLearnerId: learnerId });
  },
  getActiveLearner: () => {
    const { activeLearnerId, learners } = get();
    return learners.find((learner) => learner.id === activeLearnerId);
  },
  getCompanionForLearner: (learnerId) =>
    get().companions.find((companion) => companion.learnerId === learnerId),
  getProfileForLearner: (learnerId) =>
    get().profiles.find((profile) => profile.learnerId === learnerId),
}));
