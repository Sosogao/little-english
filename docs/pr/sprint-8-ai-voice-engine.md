# Build sprint 8 AI voice engine

## Summary

- Added a provider-based voice engine with `VoiceProvider`, `BrowserVoiceProvider`, and `OpenAITTSProvider`.
- Added OpenAI TTS playback using `gpt-4o-mini-tts` with a warm child-friendly English teacher instruction.
- Added local audio caching keyed by provider, voice, speed, and text.
- Expanded Settings with provider selection, OpenAI API key configuration, voice selection, speed selection, test playback, and stop playback.
- Kept learning UI provider-agnostic: play buttons still call the shared `speak()` abstraction.

## Details

- OpenAI API keys are stored only in browser localStorage under the voice settings key.
- Generated OpenAI audio is cached in localStorage as a data URL and reused for repeated playback.
- If OpenAI playback is unavailable because the key is missing, the request fails, or playback errors, the voice engine automatically falls back to browser SpeechSynthesis.
- Browser speech remains available as a selectable provider and as the fallback path.
- Vocabulary words, useful sentences, conversation turns, story sentences, and shadowing sentences all continue to use sentence-level or word-level play buttons through the provider facade.

## Not Included

- No pronunciation scoring.
- No recording.
- No server-side key storage.
- No committed API keys.

## Validation

- `npm run build --prefix apps/web`
- `npm run lint --prefix apps/web`
- `npm audit --audit-level=moderate --prefix apps/web`
- `git grep -n "OPENAI_API_KEY\\|apiKey\\|Bearer\\|api.openai.com\\|fetch(" -- apps/web/src README.md docs/pr`
- `git log --all -G "OPENAI_API_KEY\\|Bearer sk-\\|sk-[A-Za-z0-9]" --oneline`

## Self-review checklist

- ✅ Passed Architecture 1: UI depends on `voiceService` only for playback/settings. OpenAI endpoint, `fetch`, and `Bearer` usage are isolated to `apps/web/src/services/voiceService.ts`.
- ✅ Passed Architecture 2: `VoiceProvider` supports pluggable providers through `id`, `getVoices`, `speak`, and `stop`; current providers are Browser and OpenAI.
- ✅ Passed Security 3: No API key is committed. Secret-pattern history search returned no matches.
- ✅ Passed Security 4: OpenAI playback errors fall back to Browser provider automatically.
- ✅ Passed Performance 5: OpenAI audio cache key uses provider + voice + speed + text, and cached audio is reused before network generation.
- ✅ Passed Performance 6: Audio generation is lazy and only runs inside `speak()` after a play/test click.
- ✅ Passed UX 7: Play and Test Voice buttons show loading state and disable repeated clicks while playback/generation is active.
- ✅ Passed UX 8: Playback promises resolve on completion or stop, restoring buttons correctly.
- ✅ Passed Code Quality 9: Speech implementation lives in providers; UI does not duplicate browser or OpenAI speech logic.
- ✅ Passed Code Quality 10: README documents OpenAI API key setup, provider switching, cache behavior, lazy generation, and fallback.

## Risks

- OpenAI TTS is called directly from the browser using a locally stored key, so this is suitable for local-first testing but not a production key-management model.
- localStorage audio caching is simple and can fill up on heavy usage; playback still works without cache if storage writes fail.
- Browser fallback quality still depends on the user&apos;s installed system voices.
