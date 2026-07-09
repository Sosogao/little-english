export type ReviewResult = 'again' | 'hard' | 'good' | 'easy';

export function getReviewIntervalDays(result: ReviewResult) {
  if (result === 'again') return 0;
  if (result === 'hard') return 1;
  if (result === 'good') return 3;
  return 7;
}
