import { useEffect, useRef } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import {
  Scissors,
  Copy,
  ClipboardPaste,
  Bold,
  Italic,
  Underline,
  Type,
  AlignLeft,
  List,
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const { state } = useEditor();
  const menuRef = useRef<HTMLDivElement>(null);

  // Adjust position to keep menu on screen
  const menuX = Math.min(x, window.innerWidth - 220);
  const menuY = Math.min(y, window.innerHeight - 350);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  interface MenuAction {
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    action: () => void;
    disabled: boolean;
  }

  interface MenuDivider {
    divider: true;
  }

  type MenuItem = MenuAction | MenuDivider;

  const menuItems: MenuItem[] = [
    {
      icon: <Scissors className="w-4 h-4" />,
      label: 'Cut',
      shortcut: 'Ctrl+X',
      action: () => document.execCommand('cut'),
      disabled: state.selection?.collapsed ?? true,
    },
    {
      icon: <Copy className="w-4 h-4" />,
      label: 'Copy',
      shortcut: 'Ctrl+C',
      action: () => document.execCommand('copy'),
      disabled: state.selection?.collapsed ?? true,
    },
    {
      icon: <ClipboardPaste className="w-4 h-4" />,
      label: 'Paste',
      shortcut: 'Ctrl+V',
      action: () => document.execCommand('paste'),
      disabled: false,
    },
    { divider: true },
    {
      icon: <Bold className="w-4 h-4" />,
      label: 'Bold',
      shortcut: 'Ctrl+B',
      action: () => document.execCommand('bold'),
      disabled: false,
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: 'Italic',
      shortcut: 'Ctrl+I',
      action: () => document.execCommand('italic'),
      disabled: false,
    },
    {
      icon: <Underline className="w-4 h-4" />,
      label: 'Underline',
      shortcut: 'Ctrl+U',
      action: () => document.execCommand('underline'),
      disabled: false,
    },
    { divider: true },
    {
      icon: <Type className="w-4 h-4" />,
      label: 'Font...',
      action: () => {},
      disabled: true,
    },
    {
      icon: <AlignLeft className="w-4 h-4" />,
      label: 'Paragraph...',
      action: () => {},
      disabled: true,
    },
    {
      icon: <List className="w-4 h-4" />,
      label: 'Bullets',
      action: () => document.execCommand('insertUnorderedList'),
      disabled: false,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] bg-white border border-[#d5d5d5] rounded shadow-lg py-1 w-[200px]"
      style={{ left: menuX, top: menuY }}
    >
      {menuItems.map((item, index) => {
        if ('divider' in item) {
          return <div key={index} className="border-t border-[#e1dfdd] my-1" />;
        }
        const actionItem = item as MenuAction;
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              if (!actionItem.disabled) {
                actionItem.action();
                onClose();
              }
            }}
            disabled={actionItem.disabled}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-[12px] transition-colors ${
              actionItem.disabled
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-[#e5e5e5] cursor-pointer'
            }`}
          >
            <span style={{ color: '#605e5c' }}>{actionItem.icon}</span>
            <span className="flex-1" style={{ color: '#323130' }}>
              {actionItem.label}
            </span>
            {actionItem.shortcut && (
              <span className="text-[10px]" style={{ color: '#a0a0a0' }}>
                {actionItem.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
