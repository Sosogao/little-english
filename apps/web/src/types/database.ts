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

export type ThemePlan = {
  id: string;
  learnerId: string;
  dayIndex: number;
  title: string;
  adventureTitle: string;
  theme: string;
  status: 'planned' | 'active' | 'completed' | 'skipped';
  targetLevel: string;
  estimatedMinutes: number;
  generatedBy: 'ai' | 'template' | 'manual';
  content: ThemeContent;
  createdAt: string;
  scheduledDate: string;
  completedAt?: string;
};

export type ThemeContent = {
  warmup: string[];
  conversation: ConversationTurn[];
  usefulSentences: string[];
  vocabulary: VocabularyItem[];
  story: StoryContent;
  shadowing: string[];
  mission: Mission;
};

export type ConversationTurn = {
  speaker: 'companion' | 'learner';
  text: string;
  chineseHint?: string;
  audioUrl?: string;
};

export type VocabularyItem = {
  id: string;
  word: string;
  phonetic?: string;
  meaningZh?: string;
  example: string;
  imagePrompt?: string;
  audioUrl?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
};

export type StoryContent = {
  title: string;
  paragraphs: string[];
  questions: StoryQuestion[];
};

export type StoryQuestion = {
  id: string;
  question: string;
  options?: string[];
  answer: string;
};

export type Mission = {
  id: string;
  instruction: string;
  exampleSentence: string;
  status: 'pending' | 'completed' | 'skipped';
};

export type LearningMemory = {
  id: string;
  learnerId: string;
  type: 'word' | 'sentence' | 'grammar' | 'topic' | 'pronunciation';
  content: string;
  normalizedContent: string;
  meaningZh?: string;
  examples: string[];
  mastery: number;
  exposureCount: number;
  correctCount: number;
  mistakeCount: number;
  lastSeenAt?: string;
  firstSeenAt: string;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
};

export type LearningEvent = {
  id: string;
  learnerId: string;
  themePlanId?: string;
  type:
    | 'theme_started'
    | 'theme_completed'
    | 'conversation_completed'
    | 'word_seen'
    | 'word_mastered'
    | 'sentence_practiced'
    | 'story_completed'
    | 'shadowing_completed'
    | 'mission_completed'
    | 'review_completed';
  payload: Record<string, unknown>;
  createdAt: string;
};

export type GrowthSnapshot = {
  id: string;
  learnerId: string;
  date: string;
  totalWords: number;
  masteredWords: number;
  totalSentences: number;
  completedThemes: number;
  streakDays: number;
  speakingScore?: number;
  listeningScore?: number;
  confidenceScore?: number;
};
