import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocumentHistory } from './useHistory';

function mountEditor(initialHtml = '<p><br></p>') {
  const editor = document.createElement('div');
  editor.setAttribute('contenteditable', 'true');
  editor.innerHTML = initialHtml;
  document.body.appendChild(editor);
  const ref = { current: editor };
  const view = renderHook(() => useDocumentHistory(ref));
  return { editor, ref, ...view };
}

function type(editor: HTMLElement, html: string) {
  editor.innerHTML = html;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('useDocumentHistory', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('undoes through edits back to the initial document', () => {
    const { editor, result } = mountEditor('<p><br></p>');

    act(() => type(editor, '<p>a</p>'));
    act(() => vi.advanceTimersByTime(400));
    act(() => type(editor, '<p>ab</p>'));
    act(() => vi.advanceTimersByTime(400));

    act(() => result.current.undo());
    expect(editor.innerHTML).toBe('<p>a</p>');

    act(() => result.current.undo());
    expect(editor.innerHTML).toBe('<p><br></p>');
  });

  it('redoes after undo', () => {
    const { editor, result } = mountEditor('<p><br></p>');

    act(() => type(editor, '<p>x</p>'));
    act(() => vi.advanceTimersByTime(400));

    act(() => result.current.undo());
    expect(editor.innerHTML).toBe('<p><br></p>');

    act(() => result.current.redo());
    expect(editor.innerHTML).toBe('<p>x</p>');
  });

  it('captures a pending edit on undo even before the debounce fires', () => {
    const { editor, result } = mountEditor('<p><br></p>');

    // Type but do NOT advance past the debounce window.
    act(() => type(editor, '<p>pending</p>'));
    // Undo should flush the pending snapshot, then step back to the start.
    act(() => result.current.undo());
    expect(editor.innerHTML).toBe('<p><br></p>');

    act(() => result.current.redo());
    expect(editor.innerHTML).toBe('<p>pending</p>');
  });

  it('a new edit after undo clears the redo branch', () => {
    const { editor, result } = mountEditor('<p><br></p>');

    act(() => type(editor, '<p>one</p>'));
    act(() => vi.advanceTimersByTime(400));
    act(() => result.current.undo());
    expect(editor.innerHTML).toBe('<p><br></p>');

    act(() => type(editor, '<p>two</p>'));
    act(() => vi.advanceTimersByTime(400));

    // Redo must do nothing now that history diverged.
    act(() => result.current.redo());
    expect(editor.innerHTML).toBe('<p>two</p>');
  });

  it('undo at the start is a no-op', () => {
    const { editor, result } = mountEditor('<p>start</p>');
    act(() => result.current.undo());
    expect(editor.innerHTML).toBe('<p>start</p>');
  });

  it('explicit capture() snapshots without an input event', () => {
    const { editor, result } = mountEditor('<p><br></p>');

    // Simulate a toolbar action: snapshot, then mutate the DOM directly.
    act(() => result.current.capture());
    editor.innerHTML = '<p>bold</p>';
    act(() => result.current.capture());

    act(() => result.current.undo());
    expect(editor.innerHTML).toBe('<p><br></p>');
  });
});
