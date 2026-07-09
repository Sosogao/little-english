import { create } from 'zustand';

import { seedAppData } from '@/data/seed';
import { loadJson, saveJson, storageKeys } from '@/services/storageService';
import type { ThemePlan } from '@/types/database';

type ThemeState = {
  themePlans: ThemePlan[];
  getTodayThemeForLearner: (learnerId: string) => ThemePlan | undefined;
  getThemesForLearner: (learnerId: string) => ThemePlan[];
  getThemeForLearnerByDay: (
    learnerId: string,
    dayIndex: number,
  ) => ThemePlan | undefined;
  startThemeForLearner: (
    learnerId: string,
    dayIndex: number,
  ) => ThemePlan | undefined;
};

function loadThemePlans() {
  seedAppData();
  return loadJson<ThemePlan[]>(storageKeys.themePlans, []);
}

export const useThemeStore = create<ThemeState>((set) => ({
  themePlans: loadThemePlans(),
  getTodayThemeForLearner: (learnerId) =>
    loadThemePlans().find(
      (plan) => plan.learnerId === learnerId && plan.status === 'active',
    ),
  getThemesForLearner: (learnerId) =>
    loadThemePlans()
      .filter((plan) => plan.learnerId === learnerId)
      .sort((a, b) => a.dayIndex - b.dayIndex),
  getThemeForLearnerByDay: (learnerId, dayIndex) =>
    loadThemePlans().find(
      (plan) => plan.learnerId === learnerId && plan.dayIndex === dayIndex,
    ),
  startThemeForLearner: (learnerId, dayIndex) => {
    const themePlans = loadThemePlans();
    const targetTheme = themePlans.find(
      (plan) => plan.learnerId === learnerId && plan.dayIndex === dayIndex,
    );

    if (!targetTheme) {
      return undefined;
    }

    const updatedAt = new Date().toISOString();
    const nextThemePlans = themePlans.map((plan) => {
      if (plan.learnerId !== learnerId) {
        return plan;
      }

      if (plan.id === targetTheme.id) {
        return { ...plan, status: 'active' as const };
      }

      if (plan.status === 'active') {
        return {
          ...plan,
          status: 'completed' as const,
          completedAt: plan.completedAt ?? updatedAt,
        };
      }

      return plan;
    });

    saveJson(storageKeys.themePlans, nextThemePlans);
    set({ themePlans: nextThemePlans });

    return nextThemePlans.find((plan) => plan.id === targetTheme.id);
  },
}));
