const voiceStorageKeys = {
  voiceURI: 'journey_ai.voice.voiceURI',
  rate: 'journey_ai.voice.rate',
} as const;

export type VoiceRateOption = {
  label: 'Slow' | 'Normal' | 'Fast';
  value: number;
};

export type SpeakOptions = {
  rate?: number;
  voiceURI?: string;
};

export const voiceRateOptions: VoiceRateOption[] = [
  { label: 'Slow', value: 0.75 },
  { label: 'Normal', value: 0.95 },
  { label: 'Fast', value: 1.1 },
];

export function canUseSpeechSynthesis() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function readVoiceURI() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(voiceStorageKeys.voiceURI) ?? '';
}

function readRate() {
  if (typeof window === 'undefined') {
    return voiceRateOptions[1].value;
  }

  const savedRate = Number(window.localStorage.getItem(voiceStorageKeys.rate));
  const matchingRate = voiceRateOptions.find((option) => option.value === savedRate);

  return matchingRate?.value ?? voiceRateOptions[1].value;
}

export function getSelectedVoiceURI() {
  return readVoiceURI();
}

export function getSelectedRate() {
  return readRate();
}

export function getVoices() {
  if (!canUseSpeechSynthesis()) {
    return [];
  }

  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith('en'))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function findVoice(voiceURI: string) {
  return getVoices().find((voice) => voice.voiceURI === voiceURI);
}

export function setVoice(voiceURI: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(voiceStorageKeys.voiceURI, voiceURI);
}

export function setRate(rate: number) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(voiceStorageKeys.rate, String(rate));
}

export function stop() {
  if (!canUseSpeechSynthesis()) {
    return;
  }

  window.speechSynthesis.cancel();
}

export function speak(text: string, options: SpeakOptions = {}) {
  if (!canUseSpeechSynthesis()) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = findVoice(options.voiceURI ?? readVoiceURI());

  window.speechSynthesis.cancel();
  utterance.lang = voice?.lang ?? 'en-US';
  utterance.rate = options.rate ?? readRate();

  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}

export function speakText(text: string) {
  speak(text);
}
