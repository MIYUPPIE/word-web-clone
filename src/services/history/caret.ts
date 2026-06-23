// Caret position as an absolute character offset within the editor, so undo/
// redo can restore the cursor after replacing innerHTML. Offsets count the
// characters of all text nodes in document order. Pure DOM functions, testable
// in jsdom without a live selection.

/** Characters of text content between the start of `root` and (node, nodeOffset). */
export function getAbsoluteOffset(
  root: Node,
  node: Node,
  nodeOffset: number
): number {
  const range = document.createRange();
  range.selectNodeContents(root);
  try {
    range.setEnd(node, nodeOffset);
  } catch {
    // node is not inside root; treat as end of document.
    return range.toString().length;
  }
  return range.toString().length;
}

/**
 * Inverse of getAbsoluteOffset: find the (text node, local offset) that sits
 * `offset` characters into `root`. Clamps to the end of the document when the
 * offset is beyond the available text.
 */
export function locateOffset(
  root: Node,
  offset: number
): { node: Node; offset: number } {
  const target = Math.max(0, offset);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let consumed = 0;
  let lastText: Text | null = null;

  let current = walker.nextNode() as Text | null;
  while (current) {
    const len = current.nodeValue?.length ?? 0;
    if (target <= consumed + len) {
      return { node: current, offset: target - consumed };
    }
    consumed += len;
    lastText = current;
    current = walker.nextNode() as Text | null;
  }

  // Past the end: caret at the end of the last text node, or at root start.
  if (lastText) {
    return { node: lastText, offset: lastText.nodeValue?.length ?? 0 };
  }
  return { node: root, offset: 0 };
}

/** Read the current caret offset within `editor`, or null if not inside it. */
export function getCaretOffset(editor: HTMLElement): number | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.endContainer)) return null;
  return getAbsoluteOffset(editor, range.endContainer, range.endOffset);
}

/** Place the caret `offset` characters into `editor`. */
export function setCaretOffset(editor: HTMLElement, offset: number): void {
  const selection = window.getSelection();
  if (!selection) return;
  const { node, offset: local } = locateOffset(editor, offset);
  const range = document.createRange();
  try {
    range.setStart(node, local);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } catch {
    // Ignore if the located position is momentarily invalid.
  }
}
