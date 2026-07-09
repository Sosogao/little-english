# Build sprint 7 curriculum and voice experience

## Summary

- Added a local-first 30-day curriculum template for every learner, from Day1 Farm through Day30 Adventure Review.
- Added a 30-day Journey Queue on Home with completed, current, available, and locked day states.
- Added browser SpeechSynthesis voice settings with voice selection, rate selection, test playback, and stop playback.
- Updated the learning flow celebration screen with review item stats and a Continue Next Adventure action.

## Details

- Existing localStorage data is reconciled by adding missing ThemePlans without clearing learning memory, review items, events, or growth snapshots.
- Day1 and Day2 keep their stable ThemePlan ids so existing progress is preserved.
- Completed days can be re-entered for review. Existing completed-step guards continue to prevent duplicate mastery and event writes.
- Voice playback remains browser-only and uses a replaceable service interface: `speak`, `stop`, `getVoices`, `setVoice`, and `setRate`.
- Settings now exposes Voice Settings and explains that current playback uses system browser voices.

## Not Included

- No OpenAI integration.
- No OpenAI TTS.
- No pronunciation scoring.
- No recording.
- No changes to Learning Memory or Review core algorithms.

## Validation

- `npm run build --prefix apps/web`
- `npm run lint --prefix apps/web`
- `npm audit --audit-level=moderate --prefix apps/web`

## Risks

- Browser voice availability varies by OS and browser; the app shows a friendly message when no English voice is available.
- The 30-day curriculum is a local template skeleton, not AI-generated personalized content.
- Re-entering completed days activates that day for review, while completed-step guards prevent duplicate learning events.
