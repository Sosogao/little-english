import type { Companion, Family, Learner, LearnerProfile } from '@/types/database';
import { loadJson, saveJson, storageKeys } from '@/services/storageService';

const createdAt = '2026-07-09T00:00:00.000Z';

export const mockFamily: Family = {
  id: 'family_journey_home',
  name: 'Journey Family',
  createdAt,
  updatedAt: createdAt,
};

export const mockLearners: Learner[] = [
  {
    id: 'learner_xiaoqi',
    familyId: mockFamily.id,
    displayName: '小七',
    role: 'child',
    age: 7,
    avatarEmoji: '🌱',
    companionId: 'companion_momo',
    currentLevel: 'pre-a1',
    dailyGoalMinutes: 20,
    streakDays: 3,
    totalLearningDays: 8,
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'learner_xiaoliu',
    familyId: mockFamily.id,
    displayName: '小六',
    role: 'child',
    age: 6,
    avatarEmoji: '⭐',
    companionId: 'companion_bibi',
    currentLevel: 'pre-a1',
    dailyGoalMinutes: 15,
    streakDays: 2,
    totalLearningDays: 5,
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'learner_dad',
    familyId: mockFamily.id,
    displayName: '爸爸',
    role: 'adult',
    avatarEmoji: '🚲',
    companionId: 'companion_lumi',
    currentLevel: 'a1',
    dailyGoalMinutes: 25,
    streakDays: 1,
    totalLearningDays: 4,
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'learner_mom',
    familyId: mockFamily.id,
    displayName: '妈妈',
    role: 'adult',
    avatarEmoji: '🌸',
    companionId: 'companion_nana',
    currentLevel: 'a1',
    dailyGoalMinutes: 25,
    streakDays: 4,
    totalLearningDays: 10,
    createdAt,
    updatedAt: createdAt,
  },
];

export const mockCompanions: Companion[] = [
  {
    id: 'companion_momo',
    learnerId: 'learner_xiaoqi',
    name: 'Momo',
    avatarEmoji: '🐣',
    personality: 'gentle',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'companion_bibi',
    learnerId: 'learner_xiaoliu',
    name: 'Bibi',
    avatarEmoji: '🦊',
    personality: 'funny',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'companion_lumi',
    learnerId: 'learner_dad',
    name: 'Lumi',
    avatarEmoji: '🧭',
    personality: 'calm',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'companion_nana',
    learnerId: 'learner_mom',
    name: 'Nana',
    avatarEmoji: '🌼',
    personality: 'energetic',
    createdAt,
    updatedAt: createdAt,
  },
];

export const mockProfiles: LearnerProfile[] = [
  {
    id: 'profile_xiaoqi',
    learnerId: 'learner_xiaoqi',
    learningGoal: 'Say simple animal words with confidence.',
    interests: ['animals', 'songs', 'drawing'],
    dislikes: ['long tests'],
    strengths: ['listening', 'copying sounds'],
    weakPoints: ['full sentences'],
    confidenceLevel: 58,
    listeningLevel: 52,
    speakingLevel: 38,
    readingLevel: 24,
    vocabularyLevel: 35,
    grammarLevel: 20,
    updatedAt: createdAt,
  },
  {
    id: 'profile_xiaoliu',
    learnerId: 'learner_xiaoliu',
    learningGoal: 'Enjoy short English greetings and farm words.',
    interests: ['games', 'colors', 'animals'],
    dislikes: ['repeating too many times'],
    strengths: ['memory', 'movement games'],
    weakPoints: ['pronunciation confidence'],
    confidenceLevel: 50,
    listeningLevel: 45,
    speakingLevel: 32,
    readingLevel: 18,
    vocabularyLevel: 30,
    grammarLevel: 16,
    updatedAt: createdAt,
  },
  {
    id: 'profile_dad',
    learnerId: 'learner_dad',
    learningGoal: 'Practice everyday family English.',
    interests: ['travel', 'family talk', 'work phrases'],
    dislikes: ['grammar drills'],
    strengths: ['reading', 'persistence'],
    weakPoints: ['speaking fluency'],
    confidenceLevel: 46,
    listeningLevel: 50,
    speakingLevel: 36,
    readingLevel: 60,
    vocabularyLevel: 48,
    grammarLevel: 42,
    updatedAt: createdAt,
  },
  {
    id: 'profile_mom',
    learnerId: 'learner_mom',
    learningGoal: 'Speak warm daily English with the children.',
    interests: ['stories', 'parent-child talk', 'songs'],
    dislikes: ['cold classroom style'],
    strengths: ['listening', 'daily practice'],
    weakPoints: ['sentence patterns'],
    confidenceLevel: 54,
    listeningLevel: 56,
    speakingLevel: 40,
    readingLevel: 52,
    vocabularyLevel: 45,
    grammarLevel: 38,
    updatedAt: createdAt,
  },
];

export const mockThemePlan = {
  id: 'theme_at_the_farm_day_1',
  title: 'At the Farm',
  adventureTitle: "Let's Visit the Farm",
  theme: 'Farm',
  estimatedMinutes: 20,
};

export function seedAppData() {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.localStorage.getItem(storageKeys.family)) {
    saveJson(storageKeys.family, mockFamily);
  }

  if (loadJson<Learner[]>(storageKeys.learners, []).length === 0) {
    saveJson(storageKeys.learners, mockLearners);
  }

  if (loadJson<Companion[]>(storageKeys.companions, []).length === 0) {
    saveJson(storageKeys.companions, mockCompanions);
  }

  if (loadJson<LearnerProfile[]>(storageKeys.learnerProfiles, []).length === 0) {
    saveJson(storageKeys.learnerProfiles, mockProfiles);
  }

  if (!window.localStorage.getItem(storageKeys.themePlans)) {
    saveJson(storageKeys.themePlans, [mockThemePlan]);
  }
}
