import { useCallback, useEffect, useRef } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import TitleBar from '@/components/TitleBar';
import Ribbon from '@/components/Ribbon';
import EditorCanvas from '@/components/EditorCanvas';
import StatusBar from '@/components/StatusBar';
import ContextMenu from '@/components/ContextMenu';
import InsertPictureDialog from '@/components/dialogs/InsertPictureDialog';
import FindReplaceDialog from '@/components/dialogs/FindReplaceDialog';
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
} from '@/utils/formatting';
import { useDocumentPersistence } from '@/services/persistence/usePersistence';
import { useDocumentHistory } from '@/services/history/useHistory';
import type { EditorSelection } from '@/types/editor';

export default function WordEditor() {
  const { state, dispatch } = useEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  const persistence = useDocumentPersistence(editorRef);
  const history = useDocumentHistory(editorRef);

  // Selection change handler
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || !editorRef.current) return;

      // Check if selection is within our editor
      let node = selection.anchorNode;
      let inEditor = false;
      while (node) {
        if (node === editorRef.current) {
          inEditor = true;
          break;
        }
        node = node.parentNode;
      }

      if (!inEditor) return;

      const sel: EditorSelection = {
        start: selection.anchorOffset,
        end: selection.focusOffset,
        collapsed: selection.isCollapsed,
      };

      dispatch({ type: 'SET_SELECTION', selection: sel });

      // Sync formatting state
      try {
        const bold = document.queryCommandState('bold');
        const italic = document.queryCommandState('italic');
        const underline = document.queryCommandState('underline');
        const strikethrough = document.queryCommandState('strikeThrough');
        const fontName = (document.queryCommandValue('fontName') || 'Calibri')
          .toString()
          .replace(/["']/g, '');

        dispatch({
          type: 'SET_ACTIVE_FORMATTING',
          formatting: {
            bold,
            italic,
            underline,
            strikethrough,
            fontFamily: fontName || 'Calibri',
          },
        });
      } catch {
        // Ignore query errors
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', handleSelectionChange);
  }, [dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          toggleBold();
          dispatch({ type: 'TOGGLE_FORMAT', format: 'bold' });
          break;
        case 'i':
          e.preventDefault();
          toggleItalic();
          dispatch({ type: 'TOGGLE_FORMAT', format: 'italic' });
          break;
        case 'u':
          e.preventDefault();
          toggleUnderline();
          dispatch({ type: 'TOGGLE_FORMAT', format: 'underline' });
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            history.redo();
          } else {
            history.undo();
          }
          break;
        case 'y':
          e.preventDefault();
          history.redo();
          break;
        case 's':
          e.preventDefault();
          persistence.saveNow();
          break;
        case 'p':
          e.preventDefault();
          window.print();
          break;
        case 'f':
          e.preventDefault();
          dispatch({ type: 'OPEN_FIND_REPLACE', mode: 'find' });
          break;
        case 'h':
          e.preventDefault();
          dispatch({ type: 'OPEN_FIND_REPLACE', mode: 'replace' });
          break;
        case 'l':
          e.preventDefault();
          document.execCommand('justifyLeft', false);
          dispatch({ type: 'SET_ALIGNMENT', alignment: 'left' });
          break;
        case 'e':
          e.preventDefault();
          document.execCommand('justifyCenter', false);
          dispatch({ type: 'SET_ALIGNMENT', alignment: 'center' });
          break;
        case 'r':
          e.preventDefault();
          document.execCommand('justifyRight', false);
          dispatch({ type: 'SET_ALIGNMENT', alignment: 'right' });
          break;
        case 'j':
          e.preventDefault();
          document.execCommand('justifyFull', false);
          dispatch({ type: 'SET_ALIGNMENT', alignment: 'justify' });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, persistence, history]);

  // Context menu handler
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch({ type: 'SHOW_CONTEXT_MENU', x: e.clientX, y: e.clientY });
    },
    [dispatch]
  );

  // Hide context menu on click
  const handleClick = useCallback(() => {
    if (state.contextMenu) {
      dispatch({ type: 'HIDE_CONTEXT_MENU' });
    }
    if (state.showFileMenu && state.activeRibbonTab !== 'file') {
      dispatch({ type: 'HIDE_FILE_MENU' });
    }
  }, [state.contextMenu, state.showFileMenu, state.activeRibbonTab, dispatch]);

  // Snapshot the document before a formatting change so it can be undone.
  const pushHistory = history.capture;

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden select-none"
      onClick={handleClick}
    >
      <TitleBar onUndo={history.undo} onRedo={history.redo} />
      <Ribbon editorRef={editorRef} pushHistory={pushHistory} />

      <div className="flex-1 flex flex-col min-h-0 relative">
        <FindReplaceDialog editorRef={editorRef} />
        <EditorCanvas
          ref={editorRef}
          onContextMenu={handleContextMenu}
          zoom={state.zoom}
        />
        <StatusBar
          editorRef={editorRef}
          saveStatus={persistence.status}
          lastSavedAt={persistence.lastSavedAt}
        />
      </div>

      {/* Context Menu */}
      {state.contextMenu && (
        <ContextMenu
          x={state.contextMenu.x}
          y={state.contextMenu.y}
          onClose={() => dispatch({ type: 'HIDE_CONTEXT_MENU' })}
        />
      )}

      {/* Dialogs */}
      <InsertPictureDialog
        open={state.activeDialog === 'insert_picture'}
        onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}
        onInsert={(src) => {
          document.execCommand('insertImage', false, src);
          dispatch({ type: 'CLOSE_DIALOG' });
        }}
      />
    </div>
  );
}
