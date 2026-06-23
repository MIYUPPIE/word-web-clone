// Text statistics service: derive word / character counts from document text.
// Pure and deterministic so it can be unit tested and reused anywhere the
// status bar, a dialog, or an export routine needs counts.

export interface TextStats {
  words: number;
  characters: number; // includes spaces, matching Word's "Characters (with spaces)"
  charactersNoSpaces: number;
}

// Unicode-aware word splitting: any run of non-whitespace is one word. This
// matches Word closely for prose and handles punctuation-glued tokens the same
// way ("e.g." counts as one word).
const WHITESPACE = /\s+/;

/** Count words in a plain-text string. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(WHITESPACE).filter((w) => w.length > 0).length;
}

/** Count characters. Newlines are not characters in Word's counter. */
export function countCharacters(text: string): number {
  return text.replace(/\n/g, '').length;
}

/** Count characters excluding all whitespace. */
export function countCharactersNoSpaces(text: string): number {
  return text.replace(/\s/g, '').length;
}

/** Compute every stat from a plain-text string in one pass-friendly call. */
export function computeStats(text: string): TextStats {
  return {
    words: countWords(text),
    characters: countCharacters(text),
    charactersNoSpaces: countCharactersNoSpaces(text),
  };
}

/**
 * Extract the editor's visible text the same way a browser would expose it.
 * Falls back to textContent when innerText is unavailable (e.g. jsdom), and
 * normalizes non-breaking spaces so they count as regular spaces.
 */
export function getEditorText(el: Pick<HTMLElement, 'innerText' | 'textContent'>): string {
  const raw = el.innerText ?? el.textContent ?? '';
  return raw.replace(/\u00a0/g, ' ');
}

/** Convenience: compute stats straight from an editor element. */
export function statsFromElement(
  el: Pick<HTMLElement, 'innerText' | 'textContent'>
): TextStats {
  return computeStats(getEditorText(el));
}
