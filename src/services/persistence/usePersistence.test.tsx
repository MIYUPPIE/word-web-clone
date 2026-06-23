import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocumentPersistence } from './usePersistence';
import { loadDocument, saveDocument } from './persistence';

function mountEditor(initialHtml = '<p><br></p>') {
  const editor = document.createElement('div');
  editor.setAttribute('contenteditable', 'true');
  editor.innerHTML = initialHtml;
  document.body.appendChild(editor);
  const ref = { current: editor };
  const view = renderHook(() => useDocumentPersistence(ref));
  return { editor, ref, ...view };
}

function edit(editor: HTMLElement, html: string) {
  editor.innerHTML = html;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('useDocumentPersistence', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('autosaves edits to storage after the debounce', () => {
    const { editor, result } = mountEditor();

    act(() => edit(editor, '<p>hello world</p>'));
    expect(result.current.status).toBe('saving');

    act(() => vi.advanceTimersByTime(900));

    expect(result.current.status).toBe('saved');
    expect(loadDocument()?.html).toBe('<p>hello world</p>');
  });

  it('debounces rapid edits into a single save of the final value', () => {
    const { editor } = mountEditor();

    act(() => edit(editor, '<p>a</p>'));
    act(() => vi.advanceTimersByTime(200));
    act(() => edit(editor, '<p>ab</p>'));
    act(() => vi.advanceTimersByTime(200));
    act(() => edit(editor, '<p>abc</p>'));
    act(() => vi.advanceTimersByTime(900));

    expect(loadDocument()?.html).toBe('<p>abc</p>');
  });

  it('saveNow flushes immediately without waiting for the debounce', () => {
    const { editor, result } = mountEditor();
    act(() => edit(editor, '<p>now</p>'));
    act(() => result.current.saveNow());
    expect(loadDocument()?.html).toBe('<p>now</p>');
  });

  it('restores a previously saved document on mount', () => {
    saveDocument('<p>restored content</p>', 4242);
    const { editor, result } = mountEditor();
    expect(editor.innerHTML).toBe('<p>restored content</p>');
    expect(result.current.lastSavedAt).toBe(4242);
  });

  it('does not overwrite the editor when storage is empty', () => {
    const { editor } = mountEditor('<p>fresh</p>');
    expect(editor.innerHTML).toBe('<p>fresh</p>');
  });

  it('resetDocument wipes storage and blanks the editor', () => {
    saveDocument('<p>old</p>', 1);
    const { editor, result } = mountEditor();
    act(() => result.current.resetDocument());
    expect(editor.innerHTML).toBe('<p><br></p>');
    expect(loadDocument()).toBeNull();
  });
});
