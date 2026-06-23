// Font-size application.
//
// The old approach ran `execCommand('fontSize', '7')` then, on a setTimeout,
// queried `document.querySelectorAll('font[size="7"]')` — a GLOBAL query that
// rewrote every matching <font> anywhere on the page, not just the editor, and
// raced the timer. This version wraps exactly the selected range in a
// `<span style="font-size: Npx">`, scoped to the editor, with no timers and no
// global DOM scans.

/** Remove any nested font sizing inside a fragment so the new size wins. */
function stripNestedFontSize(fragment: DocumentFragment | HTMLElement): void {
  const elements = fragment.querySelectorAll<HTMLElement>('[style*="font-size"], font[size]');
  elements.forEach((el) => {
    el.style.removeProperty('font-size');
    if (el.tagName === 'FONT') {
      el.removeAttribute('size');
      // A <font> that only carried a size is now noise — unwrap it but keep
      // any color/face it still has.
      if (el.attributes.length === 0) {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
        }
      }
    }
  });
}

/**
 * Wrap the contents of `range` in a span carrying the given pixel font size.
 * Returns the inserted span, or null if the range is empty (nothing selected).
 * Pure with respect to globals — operates only on the passed range's document.
 */
export function applyFontSizeToRange(range: Range, sizePx: number): HTMLSpanElement | null {
  if (range.collapsed) return null;

  const span = document.createElement('span');
  span.style.fontSize = `${sizePx}px`;

  // extractContents + insertNode handles partial selections that
  // surroundContents would reject (e.g. a range crossing element boundaries).
  const contents = range.extractContents();
  stripNestedFontSize(contents);
  span.appendChild(contents);
  range.insertNode(span);

  // Normalize so adjacent text nodes merge.
  span.parentNode?.normalize?.();
  return span;
}

/**
 * Apply a font size to the current selection inside `editor`. Returns true if a
 * change was made. A collapsed caret (no selection) makes no change, matching
 * Word's "select text first" behavior for an explicit size.
 */
export function applyFontSize(editor: HTMLElement, sizePx: number): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return false;
  if (!editor.contains(range.commonAncestorContainer)) return false;

  const span = applyFontSizeToRange(range, sizePx);
  if (!span) return false;

  // Keep the resized text selected so further edits target it.
  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  selection.removeAllRanges();
  selection.addRange(newRange);

  editor.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}
