# Milestone 5: Memory Garden

## Summary

Implement the local Memory Garden review loop for Journey English.

## Changes

- Added `MemoryReviewItem` to the local data model.
- Create review items when vocabulary words enter learning memory.
- Show due review cards in the Memory Garden step.
- Support `Again`, `Hard`, `Good`, and `Easy` review outcomes.
- Update mastery, correct/mistake counts, next due dates, review counts, and review events locally.
- Show the active learner's due review count on the Home Page.

## Testing

- `npm run build`
- `npm run lint`
- `npm audit --audit-level=moderate`
- Local dev server smoke test:
  - `/` returns `HTTP/1.1 200 OK`
  - `/learn` returns `HTTP/1.1 200 OK`

## Risks

- Existing browsers with old localStorage will only get review items after completing Vocabulary again.
- The review algorithm is intentionally simple and local-only; no AI, speech, or advanced scheduling is included.
- Review UI currently focuses on vocabulary items. Sentence review can be added in a later milestone if needed.
