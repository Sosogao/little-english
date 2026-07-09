# 06_TECH_ARCHITECTURE.md

# Technical Architecture

## Goal

Build a local-first AI English learning web app for families.

V1 should be:

- Easy to run locally.
- Easy to extend.
- Safe for learner data.
- AI-ready but not AI-dependent.
- Usable before OpenAI integration.

## Recommended Tech Stack

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS

State management:

- Zustand

Routing:

- React Router

Storage:

- Phase 1: localStorage
- Phase 2: IndexedDB via Dexie

Audio:

- Phase 1: Browser SpeechSynthesis
- Phase 2: OpenAI TTS
- Phase 3: Speech-to-text and pronunciation feedback

AI:

- Phase 1: mock data
- Phase 2: OpenAI API

## Repository Structure

```text
journey-ai/
│
├── README.md
├── MANIFESTO.md
├── CODEX.md
├── TODO.md
│
├── docs/
│   ├── 01_PRD.md
│   ├── 04_DATABASE.md
│   ├── 06_TECH_ARCHITECTURE.md
│   └── 09_MILESTONES.md
│
├── prompts/
│
├── tasks/
│
└── apps/
    └── web/
```

## Frontend Structure

Inside `apps/web/src`:

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── pages/
│   ├── LearnerSelectPage.tsx
│   ├── HomePage.tsx
│   ├── LearnPage.tsx
│   ├── ProgressPage.tsx
│   ├── ParentDashboardPage.tsx
│   └── SettingsPage.tsx
│
├── features/
│   ├── family/
│   ├── learner/
│   ├── companion/
│   ├── theme/
│   ├── conversation/
│   ├── vocabulary/
│   ├── story/
│   ├── shadowing/
│   ├── memory/
│   ├── review/
│   └── progress/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── learning/
│
├── data/
│   ├── seed.ts
│   └── mockThemePlans.ts
│
├── services/
│   ├── storageService.ts
│   ├── aiService.ts
│   ├── voiceService.ts
│   └── reviewService.ts
│
├── stores/
│   ├── familyStore.ts
│   ├── learnerStore.ts
│   ├── themeStore.ts
│   └── learningStore.ts
│
├── types/
│   ├── database.ts
│   ├── learning.ts
│   └── ai.ts
│
├── utils/
│   ├── date.ts
│   ├── id.ts
│   └── mastery.ts
│
└── styles/
    └── globals.css
```

## Main Pages

### Learner Select Page

Select who is learning today.

Cards:

- 小七
- 小六
- 爸爸
- 妈妈
- Add Learner

### Home Page

Show today’s journey.

Content:

- Welcome back
- Day index
- Today’s adventure
- Companion greeting
- Start button
- Streak
- Review count

### Learn Page

Guided learning flow:

- Warm-up
- Conversation
- Useful Sentences
- Vocabulary
- Story
- Shadowing
- Memory Garden
- Mission
- Completion

### Progress Page

Show growth:

- Words learned
- Words mastered
- Sentences spoken
- Stories completed
- Streak days

### Parent Dashboard

Show:

- Weekly summary
- Weak words
- Review status
- Suggested parent action

### Settings Page

Manage:

- Learners
- Companion
- Voice
- Storage
- AI key later

## State Design

Use Zustand stores:

- familyStore
- learnerStore
- themeStore
- learningStore

## Services

### storageService

Responsible for loading and saving app data.

V1 uses localStorage.

### reviewService

Responsible for review scheduling and mastery updates.

V1 simple algorithm:

- again: review today, mastery -10
- hard: review tomorrow, mastery +2
- good: review in 3 days, mastery +8
- easy: review in 7 days, mastery +15

### aiService

Define interface first. Use mock implementation in V1.

### voiceService

Use SpeechSynthesis in V1.

## AI Boundary

The app must work without AI.

If AI is unavailable:

- Use mock theme plans.
- Use browser speech.
- Review still works.
- Learning memory still works.

## Engineering Priority

Build in this order:

1. Project setup.
2. Data models.
3. Mock data.
4. Learner selection.
5. Home page.
6. Guided learning flow.
7. Learning memory.
8. Review.
9. Progress.
10. Parent dashboard.
11. Voice.
12. AI integration.
