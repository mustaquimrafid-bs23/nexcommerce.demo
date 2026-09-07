/**
 * nexCommerce — Voice AI Engine & NLP Preprocessor
 * 100% Parity with feature/storefront-elevation:js/concierge-engine.js & js/concierge.js
 */

/**
 * Cleans conversational filler words, prefixes, and polite suffixes from spoken queries
 * Example: "Hey stylist, show me black overcoats under $300" -> "black overcoats under $300"
 */
export function cleanVoiceQuery(text: string): string {
  if (!text) return '';
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^(hey|hi|hello|bonjour|good (morning|afternoon|evening))\s*(stylist|assistant|nexcommerce|ai|bot)?[\s,]+/i, '');

  let prev = '';
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(/^(can you|could you|please|i want to|i'd like to|help me|tell me|show me|find me|look for|give me|what is|what's|how does|how do)\s+/i, '');
  }

  cleaned = cleaned.replace(/\s*(please|thank you|thanks|right now)\.?$/i, '');
  return cleaned.trim();
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export function getConciergeVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
  return (
    cachedVoices.find(
      (v) =>
        (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('George') || v.name.includes('Alex')) &&
        v.lang.startsWith('en')
    ) ||
    cachedVoices.find((v) => v.lang && v.lang.startsWith('en') && !v.name.includes('Zira')) ||
    cachedVoices[0] ||
    null
  );
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  };
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopVoice(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function speakVoice(
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
  stopVoice();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.90; // Natural conversational rate per feature/storefront-elevation
  utterance.pitch = 1.0;

  const preferredVoice = getConciergeVoice();
  if (preferredVoice) utterance.voice = preferredVoice;

  utterance.onstart = () => {
    callbacks?.onStart?.();
  };

  utterance.onend = () => {
    callbacks?.onEnd?.();
    currentUtterance = null;
  };

  utterance.onerror = (e) => {
    callbacks?.onError?.(e);
    currentUtterance = null;
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export interface VoiceRecognitionController {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function createVoiceRecognition(callbacks: {
  onResult: (transcript: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}): VoiceRecognitionController | null {
  if (typeof window === 'undefined') return null;

  const SpeechRecognitionConstructor =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionConstructor) return null;

  try {
    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      callbacks.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        callbacks.onResult(finalTranscript, true);
      } else if (interim) {
        callbacks.onResult(interim, false);
      }
    };

    recognition.onerror = (event: any) => {
      callbacks.onError?.(event);
    };

    recognition.onend = () => {
      callbacks.onEnd?.();
    };

    return {
      start: () => {
        try {
          recognition.start();
        } catch (e) {
          // Ignore duplicate start errors
        }
      },
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {}
      },
      abort: () => {
        try {
          recognition.abort();
        } catch (e) {}
      },
    };
  } catch (err) {
    console.warn('[Voice Engine] SpeechRecognition initialization failed:', err);
    return null;
  }
}
