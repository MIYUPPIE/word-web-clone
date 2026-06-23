import { useState, useCallback, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import { FONT_SIZES } from '@/utils/constants';
import { applyFontSize } from '@/services/formatting/fontSize';

interface FontSizeSpinnerProps {
  onChange?: (size: number) => void;
}

export default function FontSizeSpinner({ onChange }: FontSizeSpinnerProps) {
  const { state, dispatch } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(state.activeFormatting.fontSize));

  useEffect(() => {
    setEditValue(String(state.activeFormatting.fontSize));
  }, [state.activeFormatting.fontSize]);

  const handleSizeChange = useCallback(
    (newSize: number) => {
      const clamped = Math.max(1, Math.min(1638, newSize));
      dispatch({ type: 'SET_FORMAT', format: { fontSize: clamped } });
      const editor = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
      if (editor) applyFontSize(editor, clamped);
      onChange?.(clamped);
    },
    [dispatch, onChange]
  );

  const handleIncrement = useCallback(() => {
    const currentIdx = FONT_SIZES.indexOf(state.activeFormatting.fontSize);
    if (currentIdx >= 0 && currentIdx < FONT_SIZES.length - 1) {
      handleSizeChange(FONT_SIZES[currentIdx + 1]);
    } else {
      handleSizeChange(state.activeFormatting.fontSize + 1);
    }
  }, [state.activeFormatting.fontSize, handleSizeChange]);

  const handleDecrement = useCallback(() => {
    const currentIdx = FONT_SIZES.indexOf(state.activeFormatting.fontSize);
    if (currentIdx > 0) {
      handleSizeChange(FONT_SIZES[currentIdx - 1]);
    } else {
      handleSizeChange(Math.max(1, state.activeFormatting.fontSize - 1));
    }
  }, [state.activeFormatting.fontSize, handleSizeChange]);

  const handleSubmit = useCallback(() => {
    const val = parseInt(editValue);
    if (!isNaN(val)) {
      handleSizeChange(val);
    }
    setIsEditing(false);
  }, [editValue, handleSizeChange]);

  return (
    <div className="flex items-center h-[28px] border border-[#d5d5d5] rounded overflow-hidden">
      <div className="flex-1 min-w-[40px]">
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') {
                setEditValue(String(state.activeFormatting.fontSize));
                setIsEditing(false);
              }
            }}
            className="w-full px-1.5 py-0.5 text-[12px] outline-none text-center"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-1.5 py-0.5 text-[12px] text-center hover:bg-[#f0f0f0] transition-colors"
          >
            {state.activeFormatting.fontSize}
          </button>
        )}
      </div>
      <div className="flex flex-col border-l border-[#d5d5d5]">
        <button
          onClick={handleIncrement}
          className="flex items-center justify-center w-[16px] h-[13px] hover:bg-[#e5e5e5] transition-colors"
        >
          <ChevronUp className="w-2.5 h-2.5" style={{ color: '#605e5c' }} />
        </button>
        <button
          onClick={handleDecrement}
          className="flex items-center justify-center w-[16px] h-[13px] hover:bg-[#e5e5e5] transition-colors border-t border-[#d5d5d5]"
        >
          <ChevronDown className="w-2.5 h-2.5" style={{ color: '#605e5c' }} />
        </button>
      </div>
    </div>
  );
}
