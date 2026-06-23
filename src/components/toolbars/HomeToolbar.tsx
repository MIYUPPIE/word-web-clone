import { useCallback, useState, useRef, useEffect } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import ToolbarGroup from '@/components/ToolbarGroup';
import ToolButton from '@/components/ToolButton';
import SplitButton from '@/components/SplitButton';
import FontSizeSpinner from '@/components/FontSizeSpinner';
import ColorPicker from '@/components/ColorPicker';
import {
  ClipboardPaste,
  Scissors,
  Copy,
  Paintbrush,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  CaseSensitive,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Outdent,
  Indent,
  ArrowUpDown,
  Pilcrow,
  Search,
  Replace,
  MousePointerClick,
} from 'lucide-react';
import {
  FONTS,
  DEFAULT_STYLES,
  LINE_SPACING_OPTIONS,
} from '@/utils/constants';
import { getPrimaryFontName } from '@/utils/fontUtils';
import { applyFontSize } from '@/services/formatting/fontSize';
import type { RefObject } from 'react';

interface HomeToolbarProps {
  editorRef: RefObject<HTMLDivElement | null>;
  pushHistory: () => void;
}

export default function HomeToolbar({ editorRef, pushHistory }: HomeToolbarProps) {
  const { state, dispatch } = useEditor();
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [spacingDropdownOpen, setSpacingDropdownOpen] = useState(false);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const spacingDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(e.target as Node)) {
        setFontDropdownOpen(false);
      }
      if (spacingDropdownRef.current && !spacingDropdownRef.current.contains(e.target as Node)) {
        setSpacingDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormatToggle = useCallback(
    (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'subscript' | 'superscript') => {
      pushHistory();
      const commands: Record<string, string> = {
        bold: 'bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'strikeThrough',
        subscript: 'subscript',
        superscript: 'superscript',
      };
      document.execCommand(commands[format], false);
      dispatch({ type: 'TOGGLE_FORMAT', format });
    },
    [dispatch, pushHistory]
  );

  const handleAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right' | 'justify') => {
      pushHistory();
      const commands = {
        left: 'justifyLeft',
        center: 'justifyCenter',
        right: 'justifyRight',
        justify: 'justifyFull',
      };
      document.execCommand(commands[alignment], false);
      dispatch({ type: 'SET_ALIGNMENT', alignment });
    },
    [dispatch, pushHistory]
  );

  const handleListToggle = useCallback(
    (listType: 'bullet' | 'number') => {
      pushHistory();
      if (listType === 'bullet') {
        document.execCommand('insertUnorderedList', false);
      } else {
        document.execCommand('insertOrderedList', false);
      }
      dispatch({ type: 'TOGGLE_LIST', listType });
    },
    [dispatch, pushHistory]
  );

  const handleIndent = useCallback(
    (direction: 'increase' | 'decrease') => {
      pushHistory();
      if (direction === 'increase') {
        document.execCommand('indent', false);
      } else {
        document.execCommand('outdent', false);
      }
      dispatch({ type: 'INDENT', direction });
    },
    [dispatch, pushHistory]
  );

  const handleClearFormatting = useCallback(() => {
    pushHistory();
    document.execCommand('removeFormat', false);
    dispatch({ type: 'CLEAR_FORMATTING' });
  }, [dispatch, pushHistory]);

  const handleLineSpacing = useCallback(
    (spacing: number) => {
      pushHistory();
      // Apply line spacing to selected paragraphs
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        let element: HTMLElement | null =
          container.nodeType === Node.TEXT_NODE
            ? container.parentElement
            : (container as HTMLElement);

        // Walk up to find paragraph-level element
        while (element && element !== editorRef.current) {
          if (element.tagName === 'P' || element.tagName === 'DIV' || element.tagName === 'LI') {
            element.style.lineHeight = String(spacing);
            break;
          }
          element = element.parentElement;
        }
      }
      dispatch({ type: 'SET_LINE_SPACING', spacing });
      setSpacingDropdownOpen(false);
    },
    [dispatch, pushHistory, editorRef]
  );

  const handleFontChange = useCallback(
    (font: string) => {
      document.execCommand('fontName', false, font);
      dispatch({ type: 'SET_FORMAT', format: { fontFamily: font } });
      setFontDropdownOpen(false);
    },
    [dispatch]
  );

  return (
    <div className="flex items-start px-2 py-1 h-[108px] overflow-hidden">
      {/* Clipboard */}
      <ToolbarGroup title="Clipboard">
        <SplitButton
          icon={ClipboardPaste}
          label="Paste"
          onClick={() => document.execCommand('paste')}
          size="lg"
        />
        <div className="flex flex-col gap-0.5">
          <ToolButton
            icon={Scissors}
            onClick={() => document.execCommand('cut')}
            tooltip="Cut (Ctrl+X)"
            size="sm"
          />
          <ToolButton
            icon={Copy}
            onClick={() => document.execCommand('copy')}
            tooltip="Copy (Ctrl+C)"
            size="sm"
          />
        </div>
      </ToolbarGroup>

      {/* Font */}
      <ToolbarGroup title="Font">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Font family dropdown */}
          <div className="relative" ref={fontDropdownRef}>
            <button
              onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
              className="flex items-center justify-between w-[130px] h-[22px] px-1.5 border border-[#d5d5d5] rounded text-[12px] hover:border-[#a0a0a0] transition-colors"
              style={{ color: '#323130' }}
            >
              <span
                style={{
                  fontFamily: state.activeFormatting.fontFamily,
                }}
              >
                {getPrimaryFontName(state.activeFormatting.fontFamily)}
              </span>
              <svg className="w-2 h-2" viewBox="0 0 8 4" fill="#605e5c">
                <path d="M0 0h8L4 4z" />
              </svg>
            </button>

            {fontDropdownOpen && (
              <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#d5d5d5] rounded shadow-lg z-50 max-h-[200px] overflow-auto w-[150px]">
                {FONTS.map((font) => (
                  <button
                    key={font}
                    onClick={() => handleFontChange(font)}
                    className="w-full text-left px-2 py-1 text-[12px] hover:bg-[#e5e5e5] transition-colors"
                    style={{ fontFamily: font, color: '#323130' }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font size spinner */}
          <FontSizeSpinner />

          {/* Grow/Shrink font */}
          <ToolButton
            icon={Type}
            onClick={() => {
              const newSize = Math.min(1638, state.activeFormatting.fontSize + 1);
              pushHistory();
              if (editorRef.current) applyFontSize(editorRef.current, newSize);
              dispatch({ type: 'SET_FORMAT', format: { fontSize: newSize } });
            }}
            tooltip="Grow Font"
            size="sm"
          />
          <ToolButton
            icon={Type}
            onClick={() => {
              const newSize = Math.max(1, state.activeFormatting.fontSize - 1);
              pushHistory();
              if (editorRef.current) applyFontSize(editorRef.current, newSize);
              dispatch({ type: 'SET_FORMAT', format: { fontSize: newSize } });
            }}
            tooltip="Shrink Font"
            size="sm"
          />

          {/* Clear formatting */}
          <ToolButton
            icon={Paintbrush}
            onClick={handleClearFormatting}
            tooltip="Clear All Formatting"
            size="sm"
          />

          {/* Formatting buttons */}
          <div className="flex gap-0.5">
            <ToolButton
              icon={Bold}
              onClick={() => handleFormatToggle('bold')}
              active={state.activeFormatting.bold}
              tooltip="Bold (Ctrl+B)"
              size="sm"
            />
            <ToolButton
              icon={Italic}
              onClick={() => handleFormatToggle('italic')}
              active={state.activeFormatting.italic}
              tooltip="Italic (Ctrl+I)"
              size="sm"
            />
            <ToolButton
              icon={Underline}
              onClick={() => handleFormatToggle('underline')}
              active={state.activeFormatting.underline}
              tooltip="Underline (Ctrl+U)"
              size="sm"
            />
            <ToolButton
              icon={Strikethrough}
              onClick={() => handleFormatToggle('strikethrough')}
              active={state.activeFormatting.strikethrough}
              tooltip="Strikethrough"
              size="sm"
            />
            <ToolButton
              icon={Subscript}
              onClick={() => handleFormatToggle('subscript')}
              tooltip="Subscript"
              size="sm"
            />
            <ToolButton
              icon={Superscript}
              onClick={() => handleFormatToggle('superscript')}
              tooltip="Superscript"
              size="sm"
            />
          </div>

          {/* Font color & highlight */}
          <div className="flex gap-0.5">
            <ColorPicker type="font" />
            <ColorPicker type="highlight" />
          </div>
        </div>
      </ToolbarGroup>

      {/* Paragraph */}
      <ToolbarGroup title="Paragraph">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Lists */}
          <div className="flex gap-0.5">
            <ToolButton
              icon={List}
              onClick={() => handleListToggle('bullet')}
              active={state.activeParagraphStyle.listType === 'bullet'}
              tooltip="Bullets"
              size="sm"
            />
            <ToolButton
              icon={ListOrdered}
              onClick={() => handleListToggle('number')}
              active={state.activeParagraphStyle.listType === 'number'}
              tooltip="Numbering"
              size="sm"
            />
          </div>

          {/* Indent */}
          <div className="flex gap-0.5">
            <ToolButton
              icon={Outdent}
              onClick={() => handleIndent('decrease')}
              tooltip="Decrease Indent"
              size="sm"
            />
            <ToolButton
              icon={Indent}
              onClick={() => handleIndent('increase')}
              tooltip="Increase Indent"
              size="sm"
            />
          </div>

          {/* Sort & Show formatting */}
          <div className="flex gap-0.5">
            <ToolButton
              icon={ArrowUpDown}
              onClick={() => {}}
              tooltip="Sort"
              size="sm"
            />
            <ToolButton
              icon={Pilcrow}
              onClick={() => {}}
              tooltip="Show/Hide Paragraph"
              size="sm"
            />
          </div>

          {/* Alignment */}
          <div className="flex gap-0.5">
            <ToolButton
              icon={AlignLeft}
              onClick={() => handleAlignment('left')}
              active={state.activeParagraphStyle.alignment === 'left'}
              tooltip="Align Left (Ctrl+L)"
              size="sm"
            />
            <ToolButton
              icon={AlignCenter}
              onClick={() => handleAlignment('center')}
              active={state.activeParagraphStyle.alignment === 'center'}
              tooltip="Center (Ctrl+E)"
              size="sm"
            />
            <ToolButton
              icon={AlignRight}
              onClick={() => handleAlignment('right')}
              active={state.activeParagraphStyle.alignment === 'right'}
              tooltip="Align Right (Ctrl+R)"
              size="sm"
            />
            <ToolButton
              icon={AlignJustify}
              onClick={() => handleAlignment('justify')}
              active={state.activeParagraphStyle.alignment === 'justify'}
              tooltip="Justify (Ctrl+J)"
              size="sm"
            />
          </div>

          {/* Line spacing dropdown */}
          <div className="relative" ref={spacingDropdownRef}>
            <button
              onClick={() => setSpacingDropdownOpen(!spacingDropdownOpen)}
              className="flex items-center gap-0.5 px-1.5 py-0.5 border border-[#d5d5d5] rounded text-[10px] hover:bg-[#e5e5e5] transition-colors"
              style={{ color: '#323130' }}
            >
              <span>Line Spacing</span>
              <svg className="w-2 h-2" viewBox="0 0 8 4" fill="#605e5c">
                <path d="M0 0h8L4 4z" />
              </svg>
            </button>

            {spacingDropdownOpen && (
              <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#d5d5d5] rounded shadow-lg z-50 py-1 w-[120px]">
                {LINE_SPACING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleLineSpacing(option.value)}
                    className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-[#e5e5e5] transition-colors ${
                      state.activeParagraphStyle.lineSpacing === option.value
                        ? 'bg-[#e5e5e5] font-medium'
                        : ''
                    }`}
                    style={{ color: '#323130' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shading & Borders */}
          <div className="flex gap-0.5">
            <ToolButton
              icon={Highlighter}
              onClick={() => {}}
              tooltip="Shading"
              size="sm"
            />
            <ToolButton
              icon={CaseSensitive}
              onClick={() => {}}
              tooltip="Borders"
              size="sm"
            />
          </div>
        </div>
      </ToolbarGroup>

      {/* Styles */}
      <ToolbarGroup title="Styles">
        <div className="flex flex-col gap-1">
          <div className="flex gap-0.5 overflow-x-auto max-w-[200px] pb-0.5">
            {DEFAULT_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  pushHistory();
                  dispatch({ type: 'APPLY_STYLE', styleId: style.id });
                  // Apply formatting via execCommand
                  if (style.formatting.bold) document.execCommand('bold', false);
                  if (style.formatting.italic) document.execCommand('italic', false);
                  if (style.paragraphStyle.alignment) {
                    const alignMap = {
                      left: 'justifyLeft',
                      center: 'justifyCenter',
                      right: 'justifyRight',
                      justify: 'justifyFull',
                    };
                    document.execCommand(alignMap[style.paragraphStyle.alignment], false);
                  }
                }}
                className="flex flex-col items-center min-w-[60px] px-1.5 py-1 rounded hover:bg-[#e5e5e5] transition-colors"
                title={style.name}
              >
                <span
                  className="text-[12px] truncate max-w-[56px]"
                  style={{
                    fontFamily: style.formatting.fontFamily || 'Calibri',
                    fontSize: style.formatting.fontSize
                      ? `${Math.min(style.formatting.fontSize, 14)}px`
                      : '11px',
                    fontWeight: style.formatting.bold ? 'bold' : 'normal',
                    fontStyle: style.formatting.italic ? 'italic' : 'normal',
                    color: style.formatting.fontColor || '#000000',
                  }}
                >
                  {style.preview}
                </span>
                <span className="text-[8px] mt-0.5 truncate max-w-[56px]" style={{ color: '#605e5c' }}>
                  {style.name}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-0.5">
            <button className="text-[10px] px-1.5 py-0.5 rounded hover:bg-[#e5e5e5] transition-colors" style={{ color: '#2b579a' }}>
              More
            </button>
            <button className="text-[10px] px-1.5 py-0.5 rounded hover:bg-[#e5e5e5] transition-colors" style={{ color: '#2b579a' }}>
              Change Styles
            </button>
          </div>
        </div>
      </ToolbarGroup>

      {/* Editing */}
      <ToolbarGroup title="Editing">
        <div className="flex flex-col gap-0.5">
          <ToolButton
            icon={Search}
            onClick={() => dispatch({ type: 'OPEN_FIND_REPLACE', mode: 'find' })}
            tooltip="Find (Ctrl+F)"
            size="sm"
          />
          <ToolButton
            icon={Replace}
            onClick={() => dispatch({ type: 'OPEN_FIND_REPLACE', mode: 'replace' })}
            tooltip="Replace (Ctrl+H)"
            size="sm"
          />
          <ToolButton
            icon={MousePointerClick}
            onClick={() => {
              const editor = editorRef.current;
              if (editor) {
                const range = document.createRange();
                range.selectNodeContents(editor);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
              }
            }}
            tooltip="Select All"
            size="sm"
          />
        </div>
      </ToolbarGroup>
    </div>
  );
}
