# 04_DATABASE.md

# Database Design

## Core Principle

The system is learning-memory first.

The most important asset is not lesson content, but each learner's long-term learning memory.

Use these naming principles:

- user → learner
- lesson → theme / journey
- history → learning_event
- review → memory_review
- progress → growth_snapshot

## Main Entities

```text
Family
  └── Learner
        ├── LearnerProfile
        ├── Companion
        ├── ThemePlan
        ├── LearningMemory
        ├── MemoryReviewItem
        ├── LearningEvent
        └── GrowthSnapshot
```

## Family

```ts
type Family = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
```

## Learner

```ts
type Learner = {
  id: string;
  familyId: string;
  displayName: string;
  role: "child" | "adult" | "parent";
  age?: number;
  avatarEmoji: string;
  companionId: string;
  currentLevel: "pre-a1" | "a1" | "a2" | "b1";
  dailyGoalMinutes: number;
  streakDays: number;
  totalLearningDays: number;
  createdAt: string;
  updatedAt: string;
};
```

## Companion

```ts
type Companion = {
  id: string;
  learnerId: string;
  name: string;
  avatarEmoji: string;
  personality: "gentle" | "energetic" | "funny" | "calm";
  voiceId?: string;
  createdAt: string;
  updatedAt: string;
};
```

## LearnerProfile

```ts
type LearnerProfile = {
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
```

Scores use 0–100.

## ThemePlan

```ts
type ThemePlan = {
  id: string;
  learnerId: string;
  dayIndex: number;
  title: string;
  adventureTitle: string;
  theme: string;
  status: "planned" | "active" | "completed" | "skipped";
  targetLevel: string;
  estimatedMinutes: number;
  generatedBy: "ai" | "template" | "manual";
  content: ThemeContent;
  createdAt: string;
  scheduledDate: string;
  completedAt?: string;
};
```

```ts
type ThemeContent = {
  warmup: string[];
  conversation: ConversationTurn[];
  usefulSentences: string[];
  vocabulary: VocabularyItem[];
  story: StoryContent;
  shadowing: string[];
  mission: Mission;
};
```

## ConversationTurn

```ts
type ConversationTurn = {
  speaker: "companion" | "learner";
  text: string;
  chineseHint?: string;
  audioUrl?: string;
};
```

## VocabularyItem

```ts
type VocabularyItem = {
  id: string;
  word: string;
  phonetic?: string;
  meaningZh?: string;
  example: string;
  imagePrompt?: string;
  audioUrl?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
};
```

## StoryContent

```ts
type StoryContent = {
  title: string;
  paragraphs: string[];
  questions: StoryQuestion[];
};
```

```ts
type StoryQuestion = {
  id: string;
  question: string;
  options?: string[];
  answer: string;
};
```

## Mission

```ts
type Mission = {
  id: string;
  instruction: string;
  exampleSentence: string;
  status: "pending" | "completed" | "skipped";
};
```

## LearningMemory

```ts
type LearningMemory = {
  id: string;
  learnerId: string;
  type: "word" | "sentence" | "grammar" | "topic" | "pronunciation";
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
  status: "new" | "learning" | "reviewing" | "mastered";
};
```

Mastery:

- 0–30: new
- 31–70: learning
- 71–90: reviewing
- 91–100: mastered

## MemoryReviewItem

```ts
type MemoryReviewItem = {
  id: string;
  learnerId: string;
  memoryId: string;
  dueDate: string;
  intervalDays: number;
  easeFactor: number;
  reviewCount: number;
  lastResult?: "again" | "hard" | "good" | "easy";
  status: "due" | "scheduled" | "completed";
  updatedAt: string;
};
```

## LearningEvent

```ts
type LearningEvent = {
  id: string;
  learnerId: string;
  themePlanId?: string;
  type:
    | "theme_started"
    | "theme_completed"
    | "conversation_completed"
    | "word_seen"
    | "word_mastered"
    | "sentence_practiced"
    | "story_completed"
    | "shadowing_completed"
    | "mission_completed"
    | "review_completed";
  payload: Record<string, unknown>;
  createdAt: string;
};
```

## GrowthSnapshot

```ts
type GrowthSnapshot = {
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
```

## Local Storage Strategy for V1

Use localStorage first.

Suggested keys:

```text
journey_ai.family
journey_ai.learners
journey_ai.companions
journey_ai.activeLearnerId
journey_ai.themePlans
journey_ai.learningMemory
journey_ai.reviewItems
journey_ai.learningEvents
journey_ai.growthSnapshots
```

## Data Protection Rule

Never delete learning memory silently.

Any destructive operation must require explicit confirmation.

Learning events should be append-only whenever possible.
