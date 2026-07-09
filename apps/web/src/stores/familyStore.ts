import { create } from 'zustand';

import { seedAppData } from '@/data/seed';
import { loadJson, storageKeys } from '@/services/storageService';
import type { Family } from '@/types/database';

type FamilyState = {
  family?: Family;
};

export const useFamilyStore = create<FamilyState>(() => ({
  family: (() => {
    seedAppData();
    return loadJson<Family | undefined>(storageKeys.family, undefined);
  })(),
}));
