import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import {
  findMatches,
  replaceMatch,
  replaceAll,
  type MatchOptions,
} from '@/services/find-replace/findReplace';

interface FindReplaceDialogProps {
  editorRef: RefObject<HTMLDivElement | null>;
}

/**
 * Non-modal Find & Replace panel. All document mutation goes through the tested
 * find-replace service, which only touches text nodes — markup is never harmed.
 */
export default function FindReplaceDialog({ editorRef }: FindReplaceDialogProps) {
  const { state, dispatch } = useEditor();
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [current, setCurrent] = useState(0);
  const [tick, setTick] = useState(0); // bump to recount after edits
  const findInputRef = useRef<HTMLInputElement>(null);

  const open = state.findReplace !== null;
  const showReplace = state.findReplace?.mode === 'replace';
  const options: MatchOptions = useMemo(
    () => ({ caseSensitive, wholeWord }),
    [caseSensitive, wholeWord]
  );

  // Live match count for the current query.
  const matchCount = useMemo(() => {
    if (!open || !find || !editorRef.current) return 0;
    return findMatches(editorRef.current, find, options).length;
    // tick forces recompute after replacements mutate the DOM.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, find, options, editorRef, tick]);

  useEffect(() => {
    if (open) {
      setCurrent(0);
      findInputRef.current?.focus();
      findInputRef.current?.select();
    }
  }, [open, state.findReplace?.mode]);

  // Reset position whenever the query changes.
  useEffect(() => {
    setCurrent(0);
  }, [find, caseSensitive, wholeWord]);

  const close = useCallback(() => dispatch({ type: 'CLOSE_FIND_REPLACE' }), [dispatch]);

  const selectMatchAt = useCallback(
    (index: number) => {
      const editor = editorRef.current;
      if (!editor) return;
      const matches = findMatches(editor, find, options);
      if (matches.length === 0) return;
      const safeIndex = ((index % matches.length) + matches.length) % matches.length;
      const match = matches[safeIndex];
      const range = document.createRange();
      range.setStart(match.node, match.start);
      range.setEnd(match.node, match.end);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      (match.node.parentElement ?? editor).scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
      setCurrent(safeIndex);
    },
    [editorRef, find, options]
  );

  const findNext = useCallback(() => {
    if (matchCount === 0) return;
    selectMatchAt(current + 1 >= matchCount ? 0 : current + 1);
  }, [matchCount, current, selectMatchAt]);

  const findPrev = useCallback(() => {
    if (matchCount === 0) return;
    selectMatchAt(current - 1 < 0 ? matchCount - 1 : current - 1);
  }, [matchCount, current, selectMatchAt]);

  const notifyEdited = useCallback(() => {
    editorRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
    setTick((t) => t + 1);
  }, [editorRef]);

  const handleReplaceOne = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || !find) return;
    const matches = findMatches(editor, find, options);
    if (matches.length === 0) return;
    const index = Math.min(current, matches.length - 1);
    replaceMatch(matches[index], replace);
    notifyEdited();
    // Move to the next match after the DOM settles.
    requestAnimationFrame(() => selectMatchAt(index));
  }, [editorRef, find, replace, options, current, notifyEdited, selectMatchAt]);

  const handleReplaceAll = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || !find) return;
    const count = replaceAll(editor, find, replace, options);
    if (count > 0) notifyEdited();
  }, [editorRef, find, replace, options, notifyEdited]);

  if (!open) return null;

  return (
    <div
      className="absolute right-6 top-[8px] z-40 w-[320px] bg-white border border-[#d5d5d5] rounded shadow-lg"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#eee]">
        <span className="text-[12px] font-medium text-[#323130]">
          {showReplace ? 'Find and Replace' : 'Find'}
        </span>
        <button onClick={close} className="p-0.5 rounded hover:bg-[#f0f0f0]" title="Close">
          <X className="w-3.5 h-3.5 text-[#605e5c]" />
        </button>
      </div>

      <div className="p-3 space-y-2">
        {/* Find row */}
        <div className="flex items-center gap-1">
          <input
            ref={findInputRef}
            value={find}
            onChange={(e) => setFind(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.shiftKey ? findPrev : findNext)();
              if (e.key === 'Escape') close();
            }}
            placeholder="Find"
            className="flex-1 h-[26px] px-2 border border-[#d5d5d5] rounded text-[12px] outline-none focus:border-[#2b579a]"
          />
          <span className="text-[11px] text-[#605e5c] w-[54px] text-right tabular-nums">
            {find ? `${matchCount ? current + 1 : 0}/${matchCount}` : ''}
          </span>
          <button
            onClick={findPrev}
            className="p-1 rounded hover:bg-[#f0f0f0] disabled:opacity-40"
            disabled={matchCount === 0}
            title="Previous (Shift+Enter)"
          >
            <ChevronUp className="w-3.5 h-3.5 text-[#605e5c]" />
          </button>
          <button
            onClick={findNext}
            className="p-1 rounded hover:bg-[#f0f0f0] disabled:opacity-40"
            disabled={matchCount === 0}
            title="Next (Enter)"
          >
            <ChevronDown className="w-3.5 h-3.5 text-[#605e5c]" />
          </button>
        </div>

        {/* Replace row */}
        {showReplace && (
          <div className="flex items-center gap-1">
            <input
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleReplaceOne();
                if (e.key === 'Escape') close();
              }}
              placeholder="Replace with"
              className="flex-1 h-[26px] px-2 border border-[#d5d5d5] rounded text-[12px] outline-none focus:border-[#2b579a]"
            />
          </div>
        )}

        {/* Options */}
        <div className="flex items-center gap-3 text-[11px] text-[#323130]">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            Match case
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
            />
            Whole words
          </label>
        </div>

        {/* Actions */}
        {showReplace && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleReplaceOne}
              disabled={matchCount === 0}
              className="px-3 py-1 text-[12px] border border-[#d5d5d5] rounded hover:bg-[#f0f0f0] disabled:opacity-40"
            >
              Replace
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={matchCount === 0}
              className="px-3 py-1 text-[12px] text-white rounded disabled:opacity-40"
              style={{ backgroundColor: '#2b579a' }}
            >
              Replace All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
