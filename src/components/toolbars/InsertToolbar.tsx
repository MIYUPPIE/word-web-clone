import { useCallback } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import ToolbarGroup from '@/components/ToolbarGroup';
import ToolButton from '@/components/ToolButton';
import SplitButton from '@/components/SplitButton';
import {
  FilePlus,
  Table,
  Image,
  Shapes,
  Link,
  MessageSquare,
  Type,
  TextCursorInput,
  FunctionSquare,
  BookOpen,
  Signature,
  Calendar,
} from 'lucide-react';
interface InsertToolbarProps {
  pushHistory: () => void;
}

export default function InsertToolbar({ pushHistory }: InsertToolbarProps) {
  const { dispatch } = useEditor();

  const handleInsertPicture = useCallback(() => {
    dispatch({ type: 'OPEN_DIALOG', dialog: 'insert_picture' });
  }, [dispatch]);

  const handleInsertTable = useCallback(() => {
    pushHistory();
    const rows = parseInt(window.prompt('Number of rows:', '3') || '3');
    const cols = parseInt(window.prompt('Number of columns:', '3') || '3');

    let tableHTML = '<table style="border-collapse:collapse;width:100%;border:1px solid #000">';
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML +=
          '<td style="border:1px solid #000;padding:4px 8px;">&nbsp;</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table><p><br></p>';

    document.execCommand('insertHTML', false, tableHTML);
  }, [pushHistory]);

  const handleInsertLink = useCallback(() => {
    pushHistory();
    const url = window.prompt('Enter URL:', 'https://');
    if (url) {
      const text = window.prompt('Display text:', url);
      if (text) {
        document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" style="color:#2b579a;text-decoration:underline;">${text}</a>`);
      }
    }
  }, [pushHistory]);

  const handleInsertComment = useCallback(() => {
    pushHistory();
    const comment = window.prompt('Enter comment:');
    if (comment) {
      document.execCommand(
        'insertHTML',
        false,
        `<span style="background-color:#fff3cd;border-bottom:2px solid #ffc107;" title="Comment: ${comment}">`
      );
    }
  }, [pushHistory]);

  const handleInsertDateTime = useCallback(() => {
    pushHistory();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    document.execCommand('insertText', false, dateStr);
  }, [pushHistory]);

  const handleInsertPageBreak = useCallback(() => {
    pushHistory();
    document.execCommand(
      'insertHTML',
      false,
      '<div style="page-break-after:always;border-top:1px dashed #999;margin:10px 0;"><span style="color:#999;font-size:10px;">Page Break</span></div><p><br></p>'
    );
  }, [pushHistory]);

  const handleInsertEquation = useCallback(() => {
    pushHistory();
    document.execCommand(
      'insertHTML',
      false,
      '<span style="font-style:italic;">Equation placeholder</span>'
    );
  }, [pushHistory]);

  return (
    <div className="flex items-start px-2 py-1 h-[108px] overflow-hidden">
      {/* Pages */}
      <ToolbarGroup title="Pages">
        <div className="flex flex-col gap-1">
          <ToolButton
            icon={FilePlus}
            onClick={handleInsertPageBreak}
            tooltip="Page Break"
            size="md"
          />
        </div>
      </ToolbarGroup>

      {/* Tables */}
      <ToolbarGroup title="Tables">
        <div className="flex flex-col gap-1">
          <SplitButton
            icon={Table}
            label="Table"
            onClick={handleInsertTable}
          />
        </div>
      </ToolbarGroup>

      {/* Illustrations */}
      <ToolbarGroup title="Illustrations">
        <div className="flex gap-1 flex-wrap">
          <ToolButton
            icon={Image}
            onClick={handleInsertPicture}
            tooltip="Pictures"
            size="md"
          />
          <ToolButton
            icon={Shapes}
            onClick={() => {
              pushHistory();
              const shapes = ['Rectangle', 'Circle', 'Triangle', 'Arrow'];
              const shape = window.prompt(
                `Choose shape:\n${shapes.join('\n')}`
              );
              if (shape) {
                document.execCommand(
                  'insertHTML',
                  false,
                  `<div style="width:100px;height:60px;border:2px solid #333;margin:8px 0;display:inline-block;text-align:center;line-height:56px;font-size:11px;color:#666;">${shape}</div>`
                );
              }
            }}
            tooltip="Shapes"
            size="md"
          />
          <ToolButton
            icon={Signature}
            onClick={() => {
              pushHistory();
              const text = window.prompt('Enter signature text:', 'Signature');
              if (text) {
                document.execCommand(
                  'insertHTML',
                  false,
                  `<span style="font-family:'Brush Script MT',cursive;font-size:18px;color:#2b579a;">${text}</span>`
                );
              }
            }}
            tooltip="Signature Line"
            size="md"
          />
        </div>
      </ToolbarGroup>

      {/* Links */}
      <ToolbarGroup title="Links">
        <div className="flex flex-col gap-1">
          <ToolButton
            icon={Link}
            onClick={handleInsertLink}
            tooltip="Link"
            size="md"
          />
        </div>
      </ToolbarGroup>

      {/* Comments */}
      <ToolbarGroup title="Comments">
        <div className="flex flex-col gap-1">
          <ToolButton
            icon={MessageSquare}
            onClick={handleInsertComment}
            tooltip="Comment"
            size="md"
          />
        </div>
      </ToolbarGroup>

      {/* Header & Footer */}
      <ToolbarGroup title="Header & Footer">
        <div className="flex gap-1">
          <ToolButton
            icon={Type}
            onClick={() => {
              pushHistory();
              document.execCommand(
                'insertHTML',
                false,
                '<div style="border-bottom:1px solid #999;padding-bottom:4px;margin-bottom:8px;font-size:10px;color:#666;">Header</div>'
              );
            }}
            tooltip="Header"
            size="sm"
          />
          <ToolButton
            icon={TextCursorInput}
            onClick={() => {
              pushHistory();
              document.execCommand(
                'insertHTML',
                false,
                '<div style="border-top:1px solid #999;padding-top:4px;margin-top:8px;font-size:10px;color:#666;text-align:center;">Footer</div>'
              );
            }}
            tooltip="Footer"
            size="sm"
          />
          <ToolButton
            icon={Calendar}
            onClick={handleInsertDateTime}
            tooltip="Date & Time"
            size="sm"
          />
        </div>
      </ToolbarGroup>

      {/* Text */}
      <ToolbarGroup title="Text">
        <div className="flex gap-1 flex-wrap">
          <ToolButton
            icon={TextCursorInput}
            onClick={() => {
              pushHistory();
              document.execCommand(
                'insertHTML',
                false,
                '<span style="background:#f0f0f0;border:1px solid #ccc;padding:2px 6px;border-radius:3px;font-size:10px;">[Text Box]</span>'
              );
            }}
            tooltip="Text Box"
            size="sm"
          />
          <ToolButton
            icon={FunctionSquare}
            onClick={handleInsertEquation}
            tooltip="Equation"
            size="sm"
          />
          <ToolButton
            icon={BookOpen}
            onClick={() => {
              pushHistory();
              document.execCommand(
                'insertHTML',
                false,
                '<span style="color:#2b579a;text-decoration:none;font-variant:small-caps;">Bookmark</span>'
              );
            }}
            tooltip="Bookmark"
            size="sm"
          />
        </div>
      </ToolbarGroup>
    </div>
  );
}
