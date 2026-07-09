import type {
  Companion,
  Family,
  Learner,
  LearnerProfile,
  ThemePlan,
} from '@/types/database';
import { loadJson, saveJson, storageKeys } from '@/services/storageService';

const createdAt = '2026-07-09T00:00:00.000Z';
const scheduledDate = '2026-07-09';

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
    age: 9,
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

function createFarmThemePlan(learner: Learner): ThemePlan {
  return {
    id: `theme_at_the_farm_day_1_${learner.id}`,
    learnerId: learner.id,
    dayIndex: 1,
    title: 'At the Farm',
    adventureTitle: "Let's Visit the Farm",
    theme: 'Farm',
    status: 'active',
    targetLevel: learner.currentLevel,
    estimatedMinutes: learner.dailyGoalMinutes,
    generatedBy: 'template',
    content: {
      warmup: ['Hello, farm!', 'I see an animal.', 'It is a sunny day.'],
      conversation: [
        {
          speaker: 'companion',
          text: 'What animal do you see?',
          chineseHint: '你看到了什么动物？',
        },
        {
          speaker: 'learner',
          text: 'I see a cow.',
          chineseHint: '我看到一头奶牛。',
        },
      ],
      usefulSentences: [
        'I see a cow.',
        'The duck is small.',
        'Can I feed the horse?',
      ],
      vocabulary: [
        {
          id: `vocab_cow_${learner.id}`,
          word: 'cow',
          meaningZh: '奶牛',
          example: 'I see a cow.',
          difficulty: 1,
        },
        {
          id: `vocab_horse_${learner.id}`,
          word: 'horse',
          meaningZh: '马',
          example: 'The horse is big.',
          difficulty: 2,
        },
        {
          id: `vocab_duck_${learner.id}`,
          word: 'duck',
          meaningZh: '鸭子',
          example: 'The duck is small.',
          difficulty: 1,
        },
        {
          id: `vocab_pig_${learner.id}`,
          word: 'pig',
          meaningZh: '猪',
          example: 'The pig is pink.',
          difficulty: 1,
        },
      ],
      story: {
        title: 'Tom Visits a Farm',
        paragraphs: [
          'Tom visits a farm with his family.',
          'He sees a cow, a horse, a duck, and a pig.',
        ],
        questions: [
          {
            id: `story_question_animals_${learner.id}`,
            question: 'What animals does Tom see?',
            options: ['Farm animals', 'Ocean animals', 'Zoo animals'],
            answer: 'Farm animals',
          },
        ],
      },
      shadowing: ['I see a cow.', 'The horse is big.', 'The duck is small.'],
      mission: {
        id: `mission_farm_sentence_${learner.id}`,
        instruction: 'Ask someone at home: What animal do you like?',
        exampleSentence: 'What animal do you like?',
        status: 'pending',
      },
    },
    createdAt,
    scheduledDate,
  };
}

function createZooThemePlan(learner: Learner): ThemePlan {
  return {
    id: `theme_at_the_zoo_day_2_${learner.id}`,
    learnerId: learner.id,
    dayIndex: 2,
    title: 'At the Zoo',
    adventureTitle: "Let's Visit the Zoo",
    theme: 'Zoo',
    status: 'planned',
    targetLevel: learner.currentLevel,
    estimatedMinutes: learner.dailyGoalMinutes,
    generatedBy: 'template',
    content: {
      warmup: ['Hello, zoo!', 'I see a big animal.', 'It is fun at the zoo.'],
      conversation: [
        {
          speaker: 'companion',
          text: 'What animal do you like?',
          chineseHint: '你喜欢什么动物？',
        },
        {
          speaker: 'learner',
          text: 'I like the lion.',
          chineseHint: '我喜欢狮子。',
        },
      ],
      usefulSentences: [
        'I like the lion.',
        'The monkey is funny.',
        'The elephant is big.',
      ],
      vocabulary: [
        {
          id: `vocab_lion_${learner.id}`,
          word: 'lion',
          meaningZh: '狮子',
          example: 'I like the lion.',
          difficulty: 2,
        },
        {
          id: `vocab_monkey_${learner.id}`,
          word: 'monkey',
          meaningZh: '猴子',
          example: 'The monkey is funny.',
          difficulty: 2,
        },
        {
          id: `vocab_elephant_${learner.id}`,
          word: 'elephant',
          meaningZh: '大象',
          example: 'The elephant is big.',
          difficulty: 2,
        },
        {
          id: `vocab_panda_${learner.id}`,
          word: 'panda',
          meaningZh: '熊猫',
          example: 'The panda is cute.',
          difficulty: 1,
        },
      ],
      story: {
        title: 'Mia Visits a Zoo',
        paragraphs: [
          'Mia visits a zoo with her family.',
          'She sees a lion, a monkey, an elephant, and a panda.',
        ],
        questions: [
          {
            id: `story_question_zoo_animals_${learner.id}`,
            question: 'What animals does Mia see?',
            options: ['Zoo animals', 'Farm animals', 'Ocean animals'],
            answer: 'Zoo animals',
          },
        ],
      },
      shadowing: ['I like the lion.', 'The monkey is funny.', 'The elephant is big.'],
      mission: {
        id: `mission_zoo_sentence_${learner.id}`,
        instruction: 'Ask someone at home: What zoo animal do you like?',
        exampleSentence: 'What zoo animal do you like?',
        status: 'pending',
      },
    },
    createdAt,
    scheduledDate: '2026-07-10',
  };
}

export const mockThemePlans: ThemePlan[] = mockLearners.flatMap((learner) => [
  createFarmThemePlan(learner),
  createZooThemePlan(learner),
]);
export const mockThemePlan = mockThemePlans[0];

function reconcileMockLearners(existingLearners: Learner[]) {
  const learnerById = new Map(mockLearners.map((learner) => [learner.id, learner]));

  return existingLearners.map((learner) => {
    const mockLearner = learnerById.get(learner.id);

    if (!mockLearner) {
      return learner;
    }

    return {
      ...learner,
      age: mockLearner.age,
      updatedAt: mockLearner.updatedAt,
    };
  });
}

function reconcileThemePlans(existingThemePlans: ThemePlan[]) {
  const validPlans = existingThemePlans.filter((plan) => plan.learnerId);
  const existingPlanIds = new Set(validPlans.map((plan) => plan.id));
  const missingMockPlans = mockThemePlans.filter(
    (plan) => !existingPlanIds.has(plan.id),
  );

  return [...validPlans, ...missingMockPlans];
}

export function seedAppData() {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.localStorage.getItem(storageKeys.family)) {
    saveJson(storageKeys.family, mockFamily);
  }

  const existingLearners = loadJson<Learner[]>(storageKeys.learners, []);
  if (existingLearners.length === 0) {
    saveJson(storageKeys.learners, mockLearners);
  } else {
    saveJson(storageKeys.learners, reconcileMockLearners(existingLearners));
  }

  if (loadJson<Companion[]>(storageKeys.companions, []).length === 0) {
    saveJson(storageKeys.companions, mockCompanions);
  }

  if (loadJson<LearnerProfile[]>(storageKeys.learnerProfiles, []).length === 0) {
    saveJson(storageKeys.learnerProfiles, mockProfiles);
  }

  const existingThemePlans = loadJson<ThemePlan[]>(storageKeys.themePlans, []);
  if (existingThemePlans.length === 0) {
    saveJson(storageKeys.themePlans, mockThemePlans);
  } else {
    saveJson(storageKeys.themePlans, reconcileThemePlans(existingThemePlans));
  }
}
