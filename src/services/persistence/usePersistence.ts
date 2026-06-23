import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { loadDocument, saveDocument, clearDocument } from './persistence';

export type SaveStatus = 'saved' | 'saving' | 'error';

const AUTOSAVE_DELAY_MS = 800;

interface PersistenceApi {
  status: SaveStatus;
  lastSavedAt: number | null;
  /** Persist immediately, bypassing the debounce (Ctrl+S, tab close). */
  saveNow: () => void;
  /** Wipe storage and reset the editor to a blank document (File > New). */
  resetDocument: () => void;
}

/**
 * Wires the editor to the persistence service:
 *  - restores the last saved document on mount,
 *  - autosaves (debounced) on every edit,
 *  - flushes on Ctrl+S and before the tab unloads.
 *
 * All storage logic lives in the tested persistence module; this hook only
 * owns timing and React lifecycle.
 */
export function useDocumentPersistence(
  editorRef: RefObject<HTMLDivElement | null>
): PersistenceApi {
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const result = saveDocument(editor.innerHTML);
    if (result.ok) {
      setStatus('saved');
      setLastSavedAt(result.record.updatedAt);
    } else {
      setStatus('error');
    }
  }, [editorRef]);

  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    flush();
  }, [flush]);

  const scheduleSave = useCallback(() => {
    setStatus('saving');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, AUTOSAVE_DELAY_MS);
  }, [flush]);

  const resetDocument = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    clearDocument();
    const editor = editorRef.current;
    if (editor) editor.innerHTML = '<p><br></p>';
    setStatus('saved');
    setLastSavedAt(null);
  }, [editorRef]);

  // Restore the saved document once, after the editor element exists.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const saved = loadDocument();
    if (saved && saved.html.trim()) {
      editor.innerHTML = saved.html;
      setLastSavedAt(saved.updatedAt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave on edits + flush before unload.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onInput = () => scheduleSave();
    const onBeforeUnload = () => flush();

    editor.addEventListener('input', onInput);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      editor.removeEventListener('input', onInput);
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [editorRef, scheduleSave, flush]);

  return { status, lastSavedAt, saveNow, resetDocument };
}
