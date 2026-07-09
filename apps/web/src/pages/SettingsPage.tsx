import { useEffect, useState } from 'react';

import {
  getSelectedRate,
  getSelectedVoiceURI,
  getVoices,
  setRate,
  setVoice,
  speak,
  stop,
  voiceRateOptions,
} from '@/services/voiceService';

export function SettingsPage() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(getSelectedVoiceURI);
  const [selectedRate, setSelectedRate] = useState(getSelectedRate);

  useEffect(() => {
    const syncVoices = () => setVoices(getVoices());

    syncVoices();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', syncVoices);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', syncVoices);
      }
    };
  }, []);

  const handleVoiceChange = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    setVoice(voiceURI);
  };

  const handleRateChange = (rate: number) => {
    setSelectedRate(rate);
    setRate(rate);
  };

  const testVoice = () => {
    speak('Hello. I am ready for today\'s English adventure.', {
      rate: selectedRate,
      voiceURI: selectedVoiceURI,
    });
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
          Current playback uses your browser&apos;s system voices. A more natural
          AI voice can be added later without changing the learning flow.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        {voices.length === 0 ? (
          <div className="rounded-3xl bg-sunshine-100 p-5">
            <p className="text-lg font-bold text-slate-950">
              No English system voice found.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Try enabling an English voice in your browser or operating system
              voice settings.
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
                <option value="">Browser default English voice</option>
                {voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
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
                className="rounded-full bg-meadow-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-meadow-700"
              >
                Test Voice
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
