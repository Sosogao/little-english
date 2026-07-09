import { create } from 'zustand';

import { seedAppData } from '@/data/seed';
import { loadJson, storageKeys } from '@/services/storageService';
import type { ThemePlan } from '@/types/database';

type ThemeState = {
  themePlans: ThemePlan[];
  getTodayThemeForLearner: (learnerId: string) => ThemePlan | undefined;
};

function loadThemePlans() {
  seedAppData();
  return loadJson<ThemePlan[]>(storageKeys.themePlans, []);
}

export const useThemeStore = create<ThemeState>(() => ({
  themePlans: loadThemePlans(),
  getTodayThemeForLearner: (learnerId) =>
    loadThemePlans().find(
      (plan) => plan.learnerId === learnerId && plan.status === 'active',
    ),
}));
