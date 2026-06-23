import { describe, it, expect } from 'vitest';
import { applyFontSizeToRange } from './fontSize';

function makeEditor(html: string): HTMLDivElement {
  const editor = document.createElement('div');
  editor.innerHTML = html;
  document.body.appendChild(editor);
  return editor;
}

function rangeOverTextNode(node: Text, start: number, end: number): Range {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  return range;
}

describe('applyFontSizeToRange', () => {
  it('wraps the selected text in a span with the pixel size', () => {
    const editor = makeEditor('<p>hello world</p>');
    const text = editor.querySelector('p')!.firstChild as Text;
    const range = rangeOverTextNode(text, 0, 5); // "hello"

    const span = applyFontSizeToRange(range, 24);

    expect(span).not.toBeNull();
    expect(span!.style.fontSize).toBe('24px');
    expect(span!.textContent).toBe('hello');
    expect(editor.querySelector('span')!.style.fontSize).toBe('24px');
  });

  it('keeps the wrapped text within the editor (scoped, not global)', () => {
    const editor = makeEditor('<p>abc</p>');
    const text = editor.querySelector('p')!.firstChild as Text;
    applyFontSizeToRange(rangeOverTextNode(text, 0, 3), 18);

    expect(editor.textContent).toBe('abc');
    // The size lives on a span inside the editor's paragraph.
    expect(editor.querySelector('p > span')?.getAttribute('style')).toContain('font-size: 18px');
  });

  it('returns null and changes nothing for a collapsed range', () => {
    const editor = makeEditor('<p>abc</p>');
    const text = editor.querySelector('p')!.firstChild as Text;
    const collapsed = rangeOverTextNode(text, 1, 1);

    expect(applyFontSizeToRange(collapsed, 20)).toBeNull();
    expect(editor.innerHTML).toBe('<p>abc</p>');
  });

  it('overrides nested font sizing so the new size applies uniformly', () => {
    const editor = makeEditor('<p><span style="font-size: 40px">big</span> small</p>');
    const p = editor.querySelector('p')!;
    // Select across the existing 40px span and the trailing text.
    const range = document.createRange();
    range.setStartBefore(p.firstChild!); // before the inner span
    range.setEnd(p.lastChild as Text, (p.lastChild as Text).length);

    const span = applyFontSizeToRange(range, 12);

    expect(span!.style.fontSize).toBe('12px');
    // No descendant should still carry the old 40px size.
    const sized = span!.querySelectorAll('[style*="font-size"]');
    expect(sized.length).toBe(0);
  });

  it('does not leave stray <font> tags behind', () => {
    const editor = makeEditor('<p><font size="7">x</font>y</p>');
    const p = editor.querySelector('p')!;
    const range = document.createRange();
    range.selectNodeContents(p);

    applyFontSizeToRange(range, 16);

    expect(editor.querySelector('font')).toBeNull();
  });
});
