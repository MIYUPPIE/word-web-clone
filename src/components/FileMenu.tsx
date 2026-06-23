import { useCallback } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { clearDocument } from '@/services/persistence/persistence';
import {
  FileText,
  FolderOpen,
  Save,
  Printer,
  Share,
  Mail,
  Monitor,
  User,
  Settings,
  Pin,
} from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  action: () => void;
  divider?: boolean;
}

export default function FileMenu() {
  const { dispatch } = useEditor();

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
    dispatch({ type: 'HIDE_FILE_MENU' });
  }, [dispatch]);

  const handlePrint = useCallback(() => {
    window.print();
    dispatch({ type: 'HIDE_FILE_MENU' });
  }, [dispatch]);

  const menuItems: MenuItem[] = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'New',
      shortcut: 'Ctrl+N',
      action: () => {
        const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editor) {
          editor.innerHTML = '<p><br></p>';
          // Wipe the persisted copy so a refresh starts blank too.
          clearDocument();
          editor.dispatchEvent(new Event('input', { bubbles: true }));
        }
        dispatch({ type: 'HIDE_FILE_MENU' });
      },
    },
    {
      icon: <FolderOpen className="w-5 h-5" />,
      label: 'Open',
      shortcut: 'Ctrl+O',
      action: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.htm,.txt';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
              if (editor && ev.target?.result) {
                const html = ev.target.result as string;
                // Try to extract body content
                const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                editor.innerHTML = bodyMatch ? bodyMatch[1] : html;
                // Persist the freshly opened document.
                editor.dispatchEvent(new Event('input', { bubbles: true }));
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
        dispatch({ type: 'HIDE_FILE_MENU' });
      },
    },
    {
      icon: <Save className="w-5 h-5" />,
      label: 'Save',
      shortcut: 'Ctrl+S',
      action: handleSave,
    },
    { icon: <Save className="w-5 h-5" />, label: 'Save As', shortcut: 'F12', action: handleSave },
    { icon: <Printer className="w-5 h-5" />, label: 'Print', shortcut: 'Ctrl+P', action: handlePrint, divider: true },
    { icon: <Share className="w-5 h-5" />, label: 'Share', action: () => dispatch({ type: 'HIDE_FILE_MENU' }) },
    { icon: <Mail className="w-5 h-5" />, label: 'Send in Email', action: () => dispatch({ type: 'HIDE_FILE_MENU' }), divider: true },
    { icon: <Monitor className="w-5 h-5" />, label: 'Export', action: () => dispatch({ type: 'HIDE_FILE_MENU' }) },
    { icon: <User className="w-5 h-5" />, label: 'Account', action: () => dispatch({ type: 'HIDE_FILE_MENU' }), divider: true },
    { icon: <Settings className="w-5 h-5" />, label: 'Options', action: () => dispatch({ type: 'HIDE_FILE_MENU' }) },
  ];

  return (
    <div
      className="absolute left-0 top-[32px] z-50 flex"
      style={{ height: 'calc(100vh - 32px)' }}
    >
      {/* Left sidebar with app name */}
      <div
        className="w-[220px] flex flex-col justify-between py-6 px-4"
        style={{ backgroundColor: 'var(--word-green)' }}
      >
        <div>
          <h2 className="text-white text-2xl font-light mb-1">Word</h2>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-white/80 text-sm">User</div>
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <h3 className="text-white/70 text-xs uppercase tracking-wider mb-3">Recent</h3>
          <div className="space-y-2">
            {['Document1', 'Resume Draft', 'Meeting Notes', 'Project Plan'].map((doc) => (
              <div key={doc} className="flex items-center gap-2 text-white/80 text-sm hover:text-white cursor-pointer transition-colors">
                <Pin className="w-3 h-3 text-white/50" />
                {doc}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right menu items */}
      <div className="w-[280px] py-2" style={{ backgroundColor: '#fff' }}>
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.divider && index > 0 && (
              <div className="border-t border-[#e1dfdd] my-1" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                item.action();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors file-menu-item"
            >
              <span className="text-[#605e5c]">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className="text-[#a0a0a0] text-xs">{item.shortcut}</span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
