export const storageKeys = {
  appVersion: 'journey_ai.appVersion',
  versionBaseline: 'journey_ai.versionBaseline',
  family: 'journey_ai.family',
  learners: 'journey_ai.learners',
  companions: 'journey_ai.companions',
  activeLearnerId: 'journey_ai.activeLearnerId',
  themePlans: 'journey_ai.themePlans',
  learningMemory: 'journey_ai.learningMemory',
  reviewItems: 'journey_ai.reviewItems',
  learningEvents: 'journey_ai.learningEvents',
  growthSnapshots: 'journey_ai.growthSnapshots',
  learnerProfiles: 'journey_ai.learnerProfiles',
  learningFlowProgress: 'journey_ai.learningFlowProgress',
} as const;

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadText(key: string) {
  return window.localStorage.getItem(key);
}

export function saveText(key: string, value: string) {
  window.localStorage.setItem(key, value);
}
