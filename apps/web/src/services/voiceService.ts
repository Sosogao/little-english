const voiceStorageKeys = {
  apiKey: 'journey_ai.voice.openaiApiKey',
  cachePrefix: 'journey_ai.voice.cache.',
  provider: 'journey_ai.voice.provider',
  rate: 'journey_ai.voice.rate',
  voiceURI: 'journey_ai.voice.voiceURI',
} as const;

const openAiSpeechModel = 'gpt-4o-mini-tts';
const openAiTtsEndpoint = 'https://api.openai.com/v1/audio/speech';
const openAiInstructions =
  'Speak like a warm, friendly English teacher for a child. Use clear pronunciation, gentle energy, and a slightly slower pace.';

let activeAudio: HTMLAudioElement | null = null;
let activePlaybackDone: (() => void) | null = null;

export type VoiceProviderId = 'browser' | 'openai';

export type VoiceRateOption = {
  label: 'Slow' | 'Normal' | 'Fast';
  value: number;
};

export type VoiceOption = {
  id: string;
  label: string;
  provider: VoiceProviderId;
};

export type SpeakOptions = {
  bypassCache?: boolean;
  provider?: VoiceProviderId;
  rate?: number;
  voiceURI?: string;
};

type ResolvedSpeakOptions = {
  bypassCache: boolean;
  provider: VoiceProviderId;
  rate: number;
  voiceURI: string;
};

export type VoiceProvider = {
  id: VoiceProviderId;
  getVoices: () => VoiceOption[];
  speak: (text: string, options: ResolvedSpeakOptions) => Promise<void>;
  stop: () => void;
};

export const voiceRateOptions: VoiceRateOption[] = [
  { label: 'Slow', value: 0.75 },
  { label: 'Normal', value: 0.95 },
  { label: 'Fast', value: 1.1 },
];

export const voiceProviderOptions: Array<{
  id: VoiceProviderId;
  label: string;
}> = [
  { id: 'browser', label: 'Browser' },
  { id: 'openai', label: 'OpenAI' },
];

const openAiVoiceOptions: VoiceOption[] = [
  { id: 'coral', label: 'Coral - warm teacher', provider: 'openai' },
  { id: 'alloy', label: 'Alloy - clear and balanced', provider: 'openai' },
  { id: 'ash', label: 'Ash - gentle and calm', provider: 'openai' },
  { id: 'ballad', label: 'Ballad - soft storyteller', provider: 'openai' },
  { id: 'echo', label: 'Echo - bright and clear', provider: 'openai' },
  { id: 'fable', label: 'Fable - friendly narrator', provider: 'openai' },
  { id: 'nova', label: 'Nova - lively teacher', provider: 'openai' },
  { id: 'sage', label: 'Sage - patient guide', provider: 'openai' },
  { id: 'shimmer', label: 'Shimmer - cheerful voice', provider: 'openai' },
];

export function canUseSpeechSynthesis() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function hasWindow() {
  return typeof window !== 'undefined';
}

function readText(key: string, fallback = '') {
  if (!hasWindow()) {
    return fallback;
  }

  return window.localStorage.getItem(key) ?? fallback;
}

function writeText(key: string, value: string) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(key, value);
}

function readProvider() {
  const provider = readText(voiceStorageKeys.provider, 'openai');

  return provider === 'browser' || provider === 'openai' ? provider : 'openai';
}

function readVoiceURI() {
  return readText(voiceStorageKeys.voiceURI, 'coral');
}

function readRate() {
  const savedRate = Number(readText(voiceStorageKeys.rate));
  const matchingRate = voiceRateOptions.find((option) => option.value === savedRate);

  return matchingRate?.value ?? voiceRateOptions[0].value;
}

function readOpenAIApiKey() {
  return readText(voiceStorageKeys.apiKey);
}

function cacheKey(input: Required<SpeakOptions> & { text: string }) {
  return [
    input.provider,
    input.voiceURI,
    input.rate,
    input.text.trim().toLowerCase(),
  ].join('|');
}

function cacheStorageKey(key: string) {
  return `${voiceStorageKeys.cachePrefix}${encodeURIComponent(key)}`;
}

function readCachedAudio(key: string) {
  return readText(cacheStorageKey(key));
}

function writeCachedAudio(key: string, dataUrl: string) {
  try {
    writeText(cacheStorageKey(key), dataUrl);
  } catch {
    // localStorage can fill up; playback should still work without cache.
  }
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function playAudioSource(source: string) {
  return new Promise<void>((resolve, reject) => {
    activeAudio?.pause();
    activeAudio = new Audio(source);
    const finish = () => {
      activePlaybackDone = null;
      activeAudio = null;
      resolve();
    };
    const fail = () => {
      activePlaybackDone = null;
      activeAudio = null;
      reject(new Error('Audio playback failed.'));
    };

    activePlaybackDone = finish;
    activeAudio.onended = finish;
    activeAudio.onerror = fail;
    void activeAudio.play().catch(reject);
  });
}

function getBrowserVoices() {
  if (!canUseSpeechSynthesis()) {
    return [];
  }

  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith('en'))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getBrowserVoiceOptions(): VoiceOption[] {
  return getBrowserVoices().map((voice) => ({
    id: voice.voiceURI,
    label: `${voice.name} (${voice.lang})`,
    provider: 'browser',
  }));
}

function findBrowserVoice(voiceURI: string) {
  return getBrowserVoices().find((voice) => voice.voiceURI === voiceURI);
}

const browserVoiceProvider: VoiceProvider = {
  id: 'browser',
  getVoices: getBrowserVoiceOptions,
  speak: async (text, options) => {
    if (!canUseSpeechSynthesis()) {
      return;
    }

    activeAudio?.pause();
    await new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = findBrowserVoice(options.voiceURI);
      const finish = () => {
        activePlaybackDone = null;
        resolve();
      };
      const fail = () => {
        activePlaybackDone = null;
        reject(new Error('Browser speech playback failed.'));
      };

      window.speechSynthesis.cancel();
      activePlaybackDone = finish;
      utterance.lang = voice?.lang ?? 'en-US';
      utterance.rate = options.rate;
      utterance.onend = finish;
      utterance.onerror = fail;

      if (voice) {
        utterance.voice = voice;
      }

      window.speechSynthesis.speak(utterance);
    });
  },
  stop: () => {
    if (canUseSpeechSynthesis()) {
      window.speechSynthesis.cancel();
    }
  },
};

const openAITTSProvider: VoiceProvider = {
  id: 'openai',
  getVoices: () => openAiVoiceOptions,
  speak: async (text, options) => {
    const apiKey = readOpenAIApiKey();

    if (!apiKey) {
      throw new Error('Missing OpenAI API key.');
    }

    const key = cacheKey({ ...options, text, provider: 'openai' });
    const cachedAudio = options.bypassCache ? '' : readCachedAudio(key);

    if (cachedAudio) {
      await playAudioSource(cachedAudio);
      return;
    }

    const response = await fetch(openAiTtsEndpoint, {
      body: JSON.stringify({
        input: text,
        instructions: openAiInstructions,
        model: openAiSpeechModel,
        response_format: 'mp3',
        speed: options.rate,
        voice: options.voiceURI || 'coral',
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`OpenAI TTS failed: ${response.status}`);
    }

    const dataUrl = await blobToDataUrl(await response.blob());
    writeCachedAudio(key, dataUrl);
    await playAudioSource(dataUrl);
  },
  stop: () => {
    activeAudio?.pause();
    activeAudio = null;
  },
};

const providers: Record<VoiceProviderId, VoiceProvider> = {
  browser: browserVoiceProvider,
  openai: openAITTSProvider,
};

function getResolvedOptions(options: SpeakOptions): ResolvedSpeakOptions {
  const provider = options.provider ?? readProvider();

  return {
    bypassCache: options.bypassCache ?? false,
    provider,
    rate: options.rate ?? readRate(),
    voiceURI: options.voiceURI ?? readVoiceURI(),
  };
}

export function getSelectedProvider() {
  return readProvider();
}

export function getSelectedVoiceURI() {
  return readVoiceURI();
}

export function getSelectedRate() {
  return readRate();
}

export function getOpenAIApiKey() {
  return readOpenAIApiKey();
}

export function getVoices(provider: VoiceProviderId = readProvider()) {
  return providers[provider].getVoices();
}

export function subscribeToVoiceChanges(onChange: () => void) {
  if (!canUseSpeechSynthesis()) {
    return () => {};
  }

  window.speechSynthesis.addEventListener('voiceschanged', onChange);

  return () => {
    window.speechSynthesis.removeEventListener('voiceschanged', onChange);
  };
}

export function setProvider(provider: VoiceProviderId) {
  writeText(voiceStorageKeys.provider, provider);

  if (provider === 'openai' && !openAiVoiceOptions.some((voice) => voice.id === readVoiceURI())) {
    setVoice('coral');
  }
}

export function setVoice(voiceURI: string) {
  writeText(voiceStorageKeys.voiceURI, voiceURI);
}

export function setRate(rate: number) {
  writeText(voiceStorageKeys.rate, String(rate));
}

export function setOpenAIApiKey(apiKey: string) {
  writeText(voiceStorageKeys.apiKey, apiKey.trim());
}

export function stop() {
  activeAudio?.pause();
  activeAudio = null;
  activePlaybackDone?.();
  activePlaybackDone = null;

  Object.values(providers).forEach((provider) => provider.stop());
}

export async function speak(text: string, options: SpeakOptions = {}) {
  const resolvedOptions = getResolvedOptions(options);
  const selectedProvider = providers[resolvedOptions.provider];

  stop();

  try {
    await selectedProvider.speak(text, resolvedOptions);
  } catch {
    if (resolvedOptions.provider !== 'browser') {
      await browserVoiceProvider.speak(text, {
        ...resolvedOptions,
        provider: 'browser',
      });
    }
  }
}

export function speakText(text: string) {
  void speak(text);
}
