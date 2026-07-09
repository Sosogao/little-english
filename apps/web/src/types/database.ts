export type Family = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Learner = {
  id: string;
  familyId: string;
  displayName: string;
  role: 'child' | 'adult' | 'parent';
  age?: number;
  avatarEmoji: string;
  companionId: string;
  currentLevel: 'pre-a1' | 'a1' | 'a2' | 'b1';
  dailyGoalMinutes: number;
  streakDays: number;
  totalLearningDays: number;
  createdAt: string;
  updatedAt: string;
};

export type Companion = {
  id: string;
  learnerId: string;
  name: string;
  avatarEmoji: string;
  personality: 'gentle' | 'energetic' | 'funny' | 'calm';
  voiceId?: string;
  createdAt: string;
  updatedAt: string;
};

export type LearnerProfile = {
  id: string;
  learnerId: string;
  learningGoal: string;
  interests: string[];
  dislikes: string[];
  strengths: string[];
  weakPoints: string[];
  confidenceLevel: number;
  listeningLevel: number;
  speakingLevel: number;
  readingLevel: number;
  vocabularyLevel: number;
  grammarLevel: number;
  updatedAt: string;
};
