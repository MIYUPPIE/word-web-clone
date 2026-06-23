import { useCallback } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import {
  Save,
  Undo2,
  Redo2,
  Printer,
  Minus,
  Square,
  X,
  ChevronDown,
} from 'lucide-react';

interface TitleBarProps {
  onUndo: () => void;
  onRedo: () => void;
}

export default function TitleBar({ onUndo, onRedo }: TitleBarProps) {
  const { state, dispatch } = useEditor();

  const handleUndo = useCallback(() => onUndo(), [onUndo]);
  const handleRedo = useCallback(() => onRedo(), [onRedo]);

  const handleSave = useCallback(() => {
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (editor) {
      const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Document</title>
<style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.15;margin:1in;}</style>
</head><body>${editor.innerHTML}</body></html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div
      className="h-[32px] flex items-center justify-between select-none"
      style={{ backgroundColor: 'var(--word-green)' }}
    >
      {/* Left: Quick Access Toolbar */}
      <div className="flex items-center gap-0.5 pl-1">
        {/* File Tab */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: 'TOGGLE_FILE_MENU' });
          }}
          className="flex items-center gap-1 px-3 py-1 text-sm font-medium transition-colors"
          style={{
            backgroundColor: state.showFileMenu ? '#fff' : 'transparent',
            color: state.showFileMenu ? 'var(--word-green)' : '#fff',
          }}
        >
          File
          <ChevronDown className="w-3 h-3" />
        </button>

        <div className="w-px h-5 bg-white/30 mx-1" />

        {/* Quick Access Buttons */}
        <button
          onClick={handleSave}
          className="p-1 rounded hover:bg-white/20 transition-colors"
          title="Save (Ctrl+S)"
        >
          <Save className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={handleUndo}
          className="p-1 rounded hover:bg-white/20 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={handleRedo}
          className="p-1 rounded hover:bg-white/20 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={handlePrint}
          className="p-1 rounded hover:bg-white/20 transition-colors"
          title="Print (Ctrl+P)"
        >
          <Printer className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Center: Title */}
      <div className="absolute left-1/2 -translate-x-1/2 text-white text-sm">
        Document1 - Word
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center">
        <button
          className="w-[46px] h-[32px] flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          title="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          className="w-[46px] h-[32px] flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          title="Maximize"
        >
          <Square className="w-3.5 h-3.5" />
        </button>
        <button
          className="w-[46px] h-[32px] flex items-center justify-center text-white hover:bg-[#e81123] transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
