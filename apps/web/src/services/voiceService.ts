export function canUseSpeechSynthesis() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(text: string) {
  if (!canUseSpeechSynthesis()) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}
