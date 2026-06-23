import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import {
  createHistory,
  record,
  undo as undoStack,
  redo as redoStack,
  canUndo as stackCanUndo,
  canRedo as stackCanRedo,
  type HistoryState,
} from './historyStack';
import { getCaretOffset, setCaretOffset } from './caret';

interface Snapshot {
  html: string;
  caret: number | null;
}

interface HistoryApi {
  undo: () => void;
  redo: () => void;
  /** Force a snapshot now (toolbar actions call this before mutating). */
  capture: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const DEBOUNCE_MS = 350;
const MAX_DEPTH = 100;

/**
 * Self-contained undo/redo over the editor's HTML + caret position.
 *
 * Why not the browser's native execCommand('undo')? Because the editor mutates
 * the DOM directly (font sizing, find/replace) — those changes are invisible to
 * native undo, so it would silently skip them. Snapshotting innerHTML on every
 * 'input' captures every kind of change uniformly. Caret is restored by
 * absolute character offset (see caret.ts).
 */
export function useDocumentHistory(
  editorRef: RefObject<HTMLDivElement | null>
): HistoryApi {
  const historyRef = useRef<HistoryState<Snapshot>>(createHistory<Snapshot>());
  const restoringRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, bump] = useState(0);

  const snapshotNow = useCallback((): Snapshot | null => {
    const editor = editorRef.current;
    if (!editor) return null;
    return { html: editor.innerHTML, caret: getCaretOffset(editor) };
  }, [editorRef]);

  const capture = useCallback(() => {
    const snap = snapshotNow();
    if (!snap) return;
    historyRef.current = record(historyRef.current, snap, {
      limit: MAX_DEPTH,
      equals: (a, b) => a.html === b.html,
    });
    bump((n) => n + 1);
  }, [snapshotNow]);

  const restore = useCallback(
    (snap: Snapshot | null) => {
      const editor = editorRef.current;
      if (!editor || !snap) return;
      restoringRef.current = true;
      editor.innerHTML = snap.html;
      if (snap.caret != null) setCaretOffset(editor, snap.caret);
      // Let persistence/word-count react, but our own input handler ignores it.
      // dispatchEvent is synchronous, so the guard has done its job by the time
      // this returns — reset it immediately rather than waiting a frame.
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      restoringRef.current = false;
      bump((n) => n + 1);
    },
    [editorRef]
  );

  const flushPending = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      capture();
    }
  }, [capture]);

  const undo = useCallback(() => {
    flushPending();
    if (!stackCanUndo(historyRef.current)) return;
    historyRef.current = undoStack(historyRef.current);
    restore(historyRef.current.present);
  }, [flushPending, restore]);

  const redo = useCallback(() => {
    if (!stackCanRedo(historyRef.current)) return;
    historyRef.current = redoStack(historyRef.current);
    restore(historyRef.current.present);
  }, [restore]);

  // Seed the initial snapshot after the editor (and any restored document)
  // exists. Registered after the persistence hook so it sees restored HTML.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    historyRef.current = createHistory<Snapshot>({
      html: editor.innerHTML,
      caret: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced capture on every edit.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const onInput = () => {
      if (restoringRef.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        capture();
      }, DEBOUNCE_MS);
    };
    editor.addEventListener('input', onInput);
    return () => {
      editor.removeEventListener('input', onInput);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [editorRef, capture]);

  return {
    undo,
    redo,
    capture,
    canUndo: stackCanUndo(historyRef.current),
    canRedo: stackCanRedo(historyRef.current),
  };
}
