# 09_MILESTONES.md

# Development Roadmap

## Overall Goal

Deliver one usable version at the end of every milestone.

Never leave the project broken.

Each milestone must:

- Build successfully.
- Run successfully.
- Be reviewable independently.
- Be committable independently.

## Milestone 0: Project Bootstrap

Goal:

Create a runnable project.

Tasks:

- Initialize Vite + React + TypeScript.
- Configure Tailwind CSS.
- Configure ESLint.
- Configure Prettier.
- Configure absolute imports.
- Configure React Router.
- Configure Zustand.
- Create project folder structure.
- Create README.

Acceptance:

- `npm install` works.
- `npm run dev` works.
- Homepage loads.

## Milestone 1: Family System

Goal:

Support multiple learners.

Features:

- Family model.
- Learner model.
- Companion model.
- Learner selection page.
- Active learner switching.

Mock data:

- 小七
- 小六
- 爸爸
- 妈妈

Acceptance:

- Can switch learners.
- Active learner is remembered.
- Different learner data is isolated.

## Milestone 2: Home Page

Goal:

Build today’s journey.

Features:

- Welcome message.
- Today’s adventure.
- Current streak.
- Today’s mission.
- Review count.
- Start button.

Acceptance:

- Looks like a complete product.
- No placeholder UI.

## Milestone 3: Theme Learning Flow

Goal:

Complete one learning adventure.

Flow:

1. Warm-up
2. Conversation
3. Useful Sentences
4. Vocabulary
5. Story
6. Shadowing
7. Memory Garden
8. Mission
9. Congratulations

Acceptance:

- Entire flow works.
- Navigation is smooth.
- Progress is remembered.

## Milestone 4: Learning Memory

Goal:

Every learning action creates memory.

Implement:

- LearningMemory
- LearningEvent
- GrowthSnapshot
- Mastery update
- Review item creation

Acceptance:

- Words become mastered gradually.
- Events are recorded.
- Nothing is lost.

## Milestone 5: Review Engine

Goal:

Memory Garden works.

Implement:

- Due review list.
- Again / Hard / Good / Easy.
- Mastery update.
- Future review dates.

Acceptance:

- Review affects mastery.
- Future review dates are generated.

## Milestone 6: Progress Center

Goal:

Visualize growth.

Features:

- Words learned.
- Words mastered.
- Sentences spoken.
- Stories completed.
- Themes completed.
- Streak days.

Acceptance:

- Everything updates automatically.

## Milestone 7: Parent Dashboard

Goal:

Parents understand learning.

Features:

- Weekly summary.
- Weak words.
- Growth chart.
- Mock AI suggestions.

Acceptance:

- Useful for parents.
- No engineering information shown.

## Milestone 8: Voice System

Goal:

Voice becomes usable.

Phase 1:

- SpeechSynthesis.
- Play.
- Stop.
- Repeat.
- Slow mode.
- Sentence mode.

Acceptance:

- Every sentence can be played.

## Milestone 9: AI Integration

Goal:

Replace mock content.

Implement:

- Generate weekly plan.
- Generate theme.
- Generate conversation.
- Generate vocabulary.
- Generate story.

Acceptance:

- Mock mode still available.
- AI mode optional.

## Milestone 10: Polish

Goal:

Production quality.

Tasks:

- Animation.
- Loading states.
- Empty states.
- Error states.
- Responsive design.

Acceptance:

- Feels polished.

## Development Rules

Never start next milestone before previous one is accepted.

Every milestone requires:

- Git commit.
- Manual test.
- Update changelog.
- Summary.

## Review Checklist

Every review should answer:

1. Can a child use it?
2. Can a parent understand it?
3. Does the AI feel like a companion?
4. Is learning memory updated correctly?
5. Would we let our own children use it today?

If the answer to any question is no, fix first.
