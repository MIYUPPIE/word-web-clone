import { describe, it, expect } from 'vitest';
import {
  countWords,
  countCharacters,
  countCharactersNoSpaces,
  computeStats,
  statsFromElement,
} from './textStats';

describe('countWords', () => {
  it('counts a simple sentence', () => {
    expect(countWords('the quick brown fox')).toBe(4);
  });

  it('returns 0 for empty and whitespace-only strings', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   \n\t  ')).toBe(0);
  });

  it('collapses repeated whitespace between words', () => {
    expect(countWords('hello     world')).toBe(2);
    expect(countWords('a\nb\tc')).toBe(3);
  });

  it('treats punctuation-glued tokens as single words', () => {
    expect(countWords('e.g. test')).toBe(2);
    expect(countWords("don't stop")).toBe(2);
  });

  it('ignores leading and trailing whitespace', () => {
    expect(countWords('  padded words  ')).toBe(2);
  });
});

describe('character counts', () => {
  it('counts characters including spaces but excluding newlines', () => {
    expect(countCharacters('ab cd')).toBe(5);
    expect(countCharacters('ab\ncd')).toBe(4);
  });

  it('counts characters excluding all whitespace', () => {
    expect(countCharactersNoSpaces('ab cd')).toBe(4);
    expect(countCharactersNoSpaces('a b\tc\nd')).toBe(4);
  });
});

describe('computeStats', () => {
  it('reports all three metrics together', () => {
    expect(computeStats('one two')).toEqual({
      words: 2,
      characters: 7,
      charactersNoSpaces: 6,
    });
  });

  it('is all-zero for empty input', () => {
    expect(computeStats('')).toEqual({
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
    });
  });
});

describe('statsFromElement', () => {
  it('reads text from a DOM element', () => {
    const el = document.createElement('div');
    el.innerHTML = '<p>Hello <b>world</b></p>';
    const stats = statsFromElement(el);
    expect(stats.words).toBe(2);
  });

  it('normalizes non-breaking spaces to regular spaces', () => {
    const el = document.createElement('div');
    // \u00a0 is a non-breaking space; it must split words like a normal space.
    el.textContent = 'two\u00a0words';
    expect(statsFromElement(el).words).toBe(2);
  });
});
