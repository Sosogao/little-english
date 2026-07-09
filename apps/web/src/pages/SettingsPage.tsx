import { useEffect, useState } from 'react';

import {
  getSelectedRate,
  getSelectedProvider,
  getSelectedVoiceURI,
  getVoices,
  setProvider,
  setRate,
  setVoice,
  speak,
  stop,
  subscribeToVoiceChanges,
  type VoiceProviderId,
  voiceRateOptions,
  voiceProviderOptions,
} from '@/services/voiceService';

export function SettingsPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<VoiceProviderId>(getSelectedProvider);
  const [voices, setVoices] = useState(() => getVoices(getSelectedProvider()));
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(getSelectedVoiceURI);
  const [selectedRate, setSelectedRate] = useState(getSelectedRate);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  useEffect(() => {
    const syncVoices = () => setVoices(getVoices(selectedProvider));

    syncVoices();

    return subscribeToVoiceChanges(syncVoices);
  }, [selectedProvider]);

  const handleProviderChange = (provider: VoiceProviderId) => {
    setVoiceError('');
    setSelectedProvider(provider);
    setProvider(provider);
    const providerVoices = getVoices(provider);
    const nextVoice = providerVoices[0]?.id ?? '';

    setVoices(providerVoices);
    setSelectedVoiceURI(nextVoice);
    setVoice(nextVoice);
  };

  const handleVoiceChange = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    setVoice(voiceURI);
  };

  const handleRateChange = (rate: number) => {
    setSelectedRate(rate);
    setRate(rate);
  };

  const testVoice = async () => {
    setVoiceError('');
    setIsTestingVoice(true);

    try {
      await speak('Hello. I am ready for today\'s English adventure.', {
        bypassCache: selectedProvider === 'openai',
        fallbackOnError: selectedProvider !== 'openai',
        provider: selectedProvider,
        rate: selectedRate,
        voiceURI: selectedVoiceURI,
      });
    } catch {
      setVoiceError(
        'OpenAI voice failed. Check OPENAI_API_KEY in local env or Vercel.',
      );
    } finally {
      setIsTestingVoice(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Voice Settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Choose browser speech or OpenAI TTS. OpenAI keys are read from the
          server environment and are never exposed in the browser.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <fieldset className="mb-6">
          <legend className="text-sm font-bold text-slate-700">
            Voice Provider
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {voiceProviderOptions.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleProviderChange(provider.id)}
                className={[
                  'rounded-2xl border px-4 py-3 text-sm font-bold transition',
                  selectedProvider === provider.id
                    ? 'border-meadow-500 bg-meadow-50 text-meadow-700'
                    : 'border-amber-100 bg-white text-slate-700 hover:border-meadow-500',
                ].join(' ')}
              >
                {provider.label}
              </button>
            ))}
          </div>
        </fieldset>

        {selectedProvider === 'openai' ? (
          <div className="mb-6 rounded-3xl bg-[#fffdf7] p-5">
            <p className="text-sm font-bold text-slate-700">
              OpenAI API Key
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Configure `OPENAI_API_KEY` in `apps/web/.env.local` for local
              testing and in Vercel Environment Variables for deployment.
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              If OpenAI is unavailable, playback falls back to Browser
              automatically.
            </p>
            {voiceError ? (
              <span className="mt-2 block text-sm font-bold text-red-600">
                {voiceError}
              </span>
            ) : null}
          </div>
        ) : null}

        {voices.length === 0 ? (
          <div className="rounded-3xl bg-sunshine-100 p-5">
            <p className="text-lg font-bold text-slate-950">
              No voice found for this provider.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Browser mode needs an English system voice. OpenAI mode needs a
              local API key.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Voice</span>
              <select
                value={selectedVoiceURI}
                onChange={(event) => handleVoiceChange(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-amber-100 bg-[#fffdf7] px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-meadow-500 focus:ring-4 focus:ring-meadow-100"
              >
                {selectedProvider === 'browser' ? (
                  <option value="">Browser default English voice</option>
                ) : null}
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.label}
                  </option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend className="text-sm font-bold text-slate-700">Speed</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {voiceRateOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleRateChange(option.value)}
                    className={[
                      'rounded-2xl border px-4 py-3 text-sm font-bold transition',
                      selectedRate === option.value
                        ? 'border-meadow-500 bg-meadow-50 text-meadow-700'
                        : 'border-amber-100 bg-white text-slate-700 hover:border-meadow-500',
                    ].join(' ')}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={testVoice}
                disabled={isTestingVoice}
                className="rounded-full bg-meadow-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700 disabled:cursor-wait disabled:opacity-60"
              >
                {isTestingVoice ? 'Testing...' : 'Test Voice'}
              </button>
              <button
                type="button"
                onClick={stop}
                className="rounded-full border border-amber-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-meadow-500 hover:text-meadow-700"
              >
                Stop
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
