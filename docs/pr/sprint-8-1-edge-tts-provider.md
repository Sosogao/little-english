# Build sprint 8.1 Edge TTS provider

## Summary

- Added `EdgeVoiceProvider` without changing the `VoiceProvider` interface.
- Made `Edge` the default voice provider for new users.
- Kept `Browser` and optional `OpenAI` providers available in Settings.
- Updated `/api/tts` to support both `edge` and `openai` provider requests.

## Details

- Edge voice uses the `msedge-tts` package in the server runtime and returns MP3 audio through the existing `/api/tts` route.
- UI still talks only to `voiceService`; it does not know which provider generated the audio.
- Cached audio still uses the existing cache shape: provider + voice + speed + text.
- OpenAI remains optional and still depends on `OPENAI_API_KEY` on the server.
- Browser fallback behavior remains unchanged.

## Validation

- `npm run build --prefix apps/web`
- `npm run lint --prefix apps/web`
- `npm audit --audit-level=moderate --prefix apps/web`
- Direct handler smoke test for `apps/web/api/tts.js` with `provider: edge` returned `audio/mpeg`

## Risks

- Edge TTS is a third-party path over the Microsoft Edge Read Aloud service, so upstream availability can change without notice.
- The root `/api/tts` wrapper uses the same server logic, but local smoke tests showed intermittent upstream DNS failures while the `apps/web/api/tts.js` direct path succeeded.
