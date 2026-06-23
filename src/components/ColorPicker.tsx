import { useState, useRef, useEffect } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { THEME_COLORS, STANDARD_COLORS } from '@/utils/constants';
import { ChevronDown } from 'lucide-react';

interface ColorPickerProps {
  type: 'font' | 'highlight';
  onChange?: (color: string) => void;
}

export default function ColorPicker({ type, onChange }: ColorPickerProps) {
  const { state, dispatch } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentColor =
    type === 'font'
      ? state.activeFormatting.fontColor
      : state.activeFormatting.highlightColor;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleColorSelect = (color: string) => {
    if (type === 'font') {
      document.execCommand('foreColor', false, color);
      dispatch({ type: 'SET_FORMAT', format: { fontColor: color } });
    } else {
      if (color === 'transparent') {
        document.execCommand('hiliteColor', false, 'transparent');
        dispatch({ type: 'SET_FORMAT', format: { highlightColor: null } });
      } else {
        document.execCommand('hiliteColor', false, color);
        dispatch({ type: 'SET_FORMAT', format: { highlightColor: color } });
      }
    }
    onChange?.(color);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-col items-center">
        <button
          onClick={() => {
            if (type === 'font') {
              document.execCommand('foreColor', false, currentColor || '#000000');
            } else {
              if (currentColor) {
                document.execCommand('hiliteColor', false, currentColor);
              }
            }
          }}
          className="tool-btn p-0.5 rounded"
          title={type === 'font' ? 'Font Color' : 'Text Highlight Color'}
        >
          {/* A with underline */}
          <div className="flex flex-col items-center">
            <span
              className="text-[14px] font-bold leading-none"
              style={{
                color: type === 'font' ? currentColor || '#000000' : '#000000',
              }}
            >
              A
            </span>
            <div
              className="w-4 h-[3px] mt-px rounded-sm"
              style={{
                backgroundColor:
                  type === 'highlight' ? currentColor || 'transparent' : currentColor || '#000000',
              }}
            />
          </div>
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="tool-btn p-0 rounded"
        >
          <ChevronDown className="w-3 h-3" style={{ color: '#605e5c' }} />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white border border-[#d5d5d5] rounded shadow-lg z-50 p-3 w-[220px]"
        >
          <div className="text-[11px] font-medium mb-2" style={{ color: '#323130' }}>
            Theme Colors
          </div>
          <div className="grid gap-0.5 mb-3" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
            {THEME_COLORS.flat().map((color, i) => (
              <button
                key={`theme-${i}`}
                onClick={() => handleColorSelect(color)}
                className="w-4 h-4 border border-[#d5d5d5] hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <div className="text-[11px] font-medium mb-2" style={{ color: '#323130' }}>
            Standard Colors
          </div>
          <div className="flex gap-0.5 flex-wrap mb-3">
            {STANDARD_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className="w-4 h-4 border border-[#d5d5d5] hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {type === 'highlight' && (
            <button
              onClick={() => handleColorSelect('transparent')}
              className="w-full text-left text-[11px] py-1 px-2 rounded hover:bg-[#f0f0f0] transition-colors"
              style={{ color: '#323130' }}
            >
              No Color
            </button>
          )}
        </div>
      )}
    </div>
  );
}
