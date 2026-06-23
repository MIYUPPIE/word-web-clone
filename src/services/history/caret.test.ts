import { describe, it, expect } from 'vitest';
import { getAbsoluteOffset, locateOffset } from './caret';

function editor(html: string): HTMLDivElement {
  const el = document.createElement('div');
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
}

describe('getAbsoluteOffset', () => {
  it('counts characters before a position in a single text node', () => {
    const el = editor('<p>hello</p>');
    const text = el.querySelector('p')!.firstChild as Text;
    expect(getAbsoluteOffset(el, text, 0)).toBe(0);
    expect(getAbsoluteOffset(el, text, 3)).toBe(3);
    expect(getAbsoluteOffset(el, text, 5)).toBe(5);
  });

  it('accumulates across multiple paragraphs / nodes', () => {
    const el = editor('<p>ab</p><p>cd</p>');
    const second = el.querySelectorAll('p')[1].firstChild as Text;
    // "ab" (2) precedes the start of the second paragraph's text.
    expect(getAbsoluteOffset(el, second, 1)).toBe(3);
  });
});

describe('locateOffset', () => {
  it('round-trips with getAbsoluteOffset', () => {
    const el = editor('<p>ab</p><p>cd</p>');
    for (let i = 0; i <= 4; i++) {
      const { node, offset } = locateOffset(el, i);
      expect(getAbsoluteOffset(el, node, offset)).toBe(i);
    }
  });

  it('lands in the correct text node', () => {
    const el = editor('<p>ab</p><p>cd</p>');
    const loc = locateOffset(el, 3); // first char of "cd"
    expect(loc.node.nodeValue).toBe('cd');
    expect(loc.offset).toBe(1);
  });

  it('clamps past-the-end offsets to the end of the last text node', () => {
    const el = editor('<p>abc</p>');
    const loc = locateOffset(el, 999);
    expect(loc.node.nodeValue).toBe('abc');
    expect(loc.offset).toBe(3);
  });

  it('handles an empty editor without throwing', () => {
    const el = editor('');
    const loc = locateOffset(el, 0);
    expect(loc.node).toBe(el);
    expect(loc.offset).toBe(0);
  });
});
