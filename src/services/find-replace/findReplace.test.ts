import { describe, it, expect } from 'vitest';
import {
  buildPattern,
  countInString,
  replaceInString,
  countMatches,
  replaceAll,
  findMatches,
  replaceMatch,
} from './findReplace';

function editor(html: string): HTMLElement {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el;
}

describe('buildPattern', () => {
  it('returns null for an empty needle', () => {
    expect(buildPattern('')).toBeNull();
  });

  it('escapes regex metacharacters so they match literally', () => {
    expect(countInString('a.b a.b axb', 'a.b')).toBe(2);
    expect(countInString('cost is $5', '$5')).toBe(1);
  });

  it('is case-insensitive by default and case-sensitive on request', () => {
    expect(countInString('The the THE', 'the')).toBe(3);
    expect(countInString('The the THE', 'the', { caseSensitive: true })).toBe(1);
  });

  it('honors whole-word matching', () => {
    expect(countInString('cat category cats', 'cat')).toBe(3);
    expect(countInString('cat category cats', 'cat', { wholeWord: true })).toBe(1);
  });
});

describe('replaceInString', () => {
  it('replaces all occurrences and reports the count', () => {
    expect(replaceInString('a a a', 'a', 'b')).toEqual({ result: 'b b b', count: 3 });
  });

  it('treats the replacement as literal text, not a regex template', () => {
    expect(replaceInString('hello', 'hello', '$1 & $&')).toEqual({
      result: '$1 & $&',
      count: 1,
    });
  });

  it('returns the original string when nothing matches', () => {
    expect(replaceInString('abc', 'z', 'q')).toEqual({ result: 'abc', count: 0 });
  });
});

describe('countMatches across the DOM', () => {
  it('counts text inside nested elements', () => {
    const root = editor('<p>foo <b>foo</b> bar</p><p>foo</p>');
    expect(countMatches(root, 'foo')).toBe(3);
  });

  it('never matches against tag names or attributes', () => {
    // The word "span" appears only in markup, never in text.
    const root = editor('<p><span class="span">hi</span></p>');
    expect(countMatches(root, 'span')).toBe(0);
  });
});

describe('replaceAll preserves structure', () => {
  it('replaces visible text without touching tags', () => {
    const root = editor('<p>foo</p><p><b>foo</b></p>');
    const count = replaceAll(root, 'foo', 'bar');
    expect(count).toBe(2);
    expect(root.innerHTML).toBe('<p>bar</p><p><b>bar</b></p>');
  });

  it('does NOT corrupt markup when the needle collides with a tag name', () => {
    // The dangerous case: a naive innerHTML.replaceAll('p', 'X') would rewrite
    // every <p> into <X>. Text-node replacement leaves tags intact.
    const root = editor('<p>apple</p>');
    replaceAll(root, 'p', 'P');
    expect(root.innerHTML).toBe('<p>aPPle</p>');
  });

  it('inserts replacement text literally, not as HTML', () => {
    const root = editor('<p>x</p>');
    replaceAll(root, 'x', '<b>y</b>');
    // The angle brackets become text content, not a real <b> element.
    expect(root.querySelector('b')).toBeNull();
    expect(root.textContent).toBe('<b>y</b>');
  });

  it('returns 0 and changes nothing for an empty needle', () => {
    const root = editor('<p>abc</p>');
    expect(replaceAll(root, '', 'z')).toBe(0);
    expect(root.innerHTML).toBe('<p>abc</p>');
  });
});

describe('findMatches', () => {
  it('locates each match as a text-node range', () => {
    const root = editor('<p>foo foo</p>');
    const matches = findMatches(root, 'foo');
    expect(matches).toHaveLength(2);
    expect(matches[0]).toMatchObject({ start: 0, end: 3 });
    expect(matches[1]).toMatchObject({ start: 4, end: 7 });
    expect(matches[0].node.nodeValue).toBe('foo foo');
  });

  it('spans matches across separate text nodes', () => {
    const root = editor('<p>foo</p><p>foo</p>');
    expect(findMatches(root, 'foo')).toHaveLength(2);
  });

  it('returns an empty list for no matches', () => {
    const root = editor('<p>hello</p>');
    expect(findMatches(root, 'zzz')).toEqual([]);
  });
});

describe('replaceMatch', () => {
  it('replaces only the targeted occurrence', () => {
    const root = editor('<p>foo foo foo</p>');
    const matches = findMatches(root, 'foo');
    replaceMatch(matches[1], 'bar');
    expect(root.textContent).toBe('foo bar foo');
  });
});
