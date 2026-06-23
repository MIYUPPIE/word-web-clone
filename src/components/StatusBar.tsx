import { useState, useCallback, useEffect } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Minus, Plus, BookOpen, Monitor, Layout, Check, Cloud, CircleAlert } from 'lucide-react';
import type { RefObject } from 'react';
import { statsFromElement, type TextStats } from '@/services/text-stats/textStats';
import type { SaveStatus } from '@/services/persistence/usePersistence';

interface StatusBarProps {
  editorRef: RefObject<HTMLDivElement | null>;
  saveStatus: SaveStatus;
  lastSavedAt: number | null;
}

const EMPTY_STATS: TextStats = { words: 0, characters: 0, charactersNoSpaces: 0 };

function formatSavedTime(ts: number | null): string {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function StatusBar({ editorRef, saveStatus, lastSavedAt }: StatusBarProps) {
  const { state, dispatch } = useEditor();
  const [stats, setStats] = useState<TextStats>(EMPTY_STATS);
  const [showChars, setShowChars] = useState(false);

  // Recompute counts whenever the document content changes.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const recompute = () => setStats(statsFromElement(editor));
    recompute();

    const observer = new MutationObserver(recompute);
    observer.observe(editor, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [editorRef]);

  const handleZoomChange = useCallback(
    (newZoom: number) => {
      dispatch({ type: 'SET_ZOOM', zoom: newZoom });
    },
    [dispatch]
  );

  const viewModes = [
    { id: 'read' as const, label: 'Read Mode', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'print' as const, label: 'Print Layout', icon: <Layout className="w-3.5 h-3.5" /> },
    { id: 'web' as const, label: 'Web Layout', icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  const saveIndicator =
    saveStatus === 'saving'
      ? { icon: <Cloud className="w-3 h-3" />, text: 'Saving…' }
      : saveStatus === 'error'
        ? { icon: <CircleAlert className="w-3 h-3 text-red-600" />, text: 'Save failed' }
        : {
            icon: <Check className="w-3 h-3" />,
            text: lastSavedAt ? `Saved ${formatSavedTime(lastSavedAt)}` : 'Saved',
          };

  return (
    <div
      className="h-[24px] flex items-center justify-between px-2 border-t border-[#d5d5d5] select-none"
      style={{ backgroundColor: 'var(--statusbar-bg)' }}
    >
      {/* Left: Page info, counts, save status */}
      <div className="flex items-center gap-3">
        <span className="text-[11px]" style={{ color: 'var(--statusbar-text)' }}>
          Page {state.currentPage} of {state.totalPages}
        </span>
        <button
          onClick={() => setShowChars((s) => !s)}
          className="text-[11px] hover:underline"
          style={{ color: 'var(--statusbar-text)' }}
          title="Click to toggle word / character count"
        >
          {showChars
            ? `${stats.characters} characters`
            : `${stats.words} ${stats.words === 1 ? 'word' : 'words'}`}
        </button>
        <span
          className="flex items-center gap-1 text-[11px]"
          style={{ color: 'var(--statusbar-text)' }}
          title={lastSavedAt ? `Last saved at ${formatSavedTime(lastSavedAt)}` : 'Autosaves to this browser'}
        >
          {saveIndicator.icon}
          {saveIndicator.text}
        </span>
      </div>

      {/* Center: View mode tabs */}
      <div className="flex items-center gap-0.5">
        {viewModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              if (mode.id === 'print' || mode.id === 'web') {
                dispatch({ type: 'SET_VIEW_MODE', mode: mode.id });
              }
            }}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] rounded transition-colors"
            style={{
              color: 'var(--statusbar-text)',
              backgroundColor:
                (mode.id === 'print' && state.viewMode === 'print') ||
                (mode.id === 'web' && state.viewMode === 'web')
                  ? '#d5d5d5'
                  : 'transparent',
            }}
            title={mode.label}
          >
            {mode.icon}
          </button>
        ))}
      </div>

      {/* Right: Zoom controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => handleZoomChange(state.zoom - 10)}
          className="p-0.5 rounded hover:bg-[#d5d5d5] transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-3 h-3" style={{ color: 'var(--statusbar-text)' }} />
        </button>

        <input
          type="range"
          min={10}
          max={500}
          value={state.zoom}
          onChange={(e) => handleZoomChange(Number(e.target.value))}
          className="zoom-slider"
        />

        <button
          onClick={() => handleZoomChange(state.zoom + 10)}
          className="p-0.5 rounded hover:bg-[#d5d5d5] transition-colors"
          title="Zoom In"
        >
          <Plus className="w-3 h-3" style={{ color: 'var(--statusbar-text)' }} />
        </button>

        <span
          className="text-[11px] w-[32px] text-right"
          style={{ color: 'var(--statusbar-text)' }}
        >
          {state.zoom}%
        </span>
      </div>
    </div>
  );
}
