import { create } from 'zustand';

import { mockThemePlan } from '@/data/seed';
import type { ThemePreview } from '@/types/learning';

type ThemeState = {
  todayTheme: ThemePreview;
};

export const useThemeStore = create<ThemeState>(() => ({
  todayTheme: mockThemePlan,
}));
