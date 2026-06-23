import { useCallback } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import ToolbarGroup from '@/components/ToolbarGroup';
import ToolButton from '@/components/ToolButton';
import SplitButton from '@/components/SplitButton';
import {
  Maximize,
  RotateCcw,
  Columns3,
  Scissors,
  Outdent,
  Indent,
  ArrowUpDown,
  WrapText,
  Layers,
} from 'lucide-react';

export default function LayoutToolbar() {
  const { dispatch } = useEditor();

  const handlePageSetup = useCallback(
    (property: string) => {
      if (property === 'orientation') {
        alert('Orientation: Switch between Portrait and Landscape');
      } else if (property === 'margins') {
        const margin = prompt('Enter margin in inches:', '1');
        if (margin) {
          const pxMargin = parseFloat(margin) * 96;
          const pages = document.querySelectorAll('.editor-content');
          pages.forEach((page) => {
            (page as HTMLElement).style.padding = `${pxMargin}px`;
          });
        }
      }
    },
    []
  );

  return (
    <div className="flex items-start px-2 py-1 h-[108px] overflow-hidden">
      <ToolbarGroup title="Margins">
        <SplitButton icon={Maximize} label="Margins" onClick={() => handlePageSetup('margins')} />
      </ToolbarGroup>
      <ToolbarGroup title="Page Setup">
        <div className="flex gap-1 flex-wrap">
          <ToolButton icon={RotateCcw} onClick={() => handlePageSetup('orientation')} tooltip="Orientation" size="sm" />
          <SplitButton icon={Maximize} label="Size" onClick={() => {}} />
          <SplitButton icon={Columns3} label="Columns" onClick={() => {}} />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Breaks">
        <div className="flex gap-1">
          <ToolButton icon={Scissors} onClick={() => {
            document.execCommand('insertHTML', false, '<div style="page-break-after:always;"></div>');
          }} tooltip="Page Break" size="sm" />
          <ToolButton icon={Columns3} onClick={() => {}} tooltip="Column Break" size="sm" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Indent">
        <div className="flex gap-1">
          <ToolButton icon={Outdent} onClick={() => {
            document.execCommand('outdent', false);
            dispatch({ type: 'INDENT', direction: 'decrease' });
          }} tooltip="Decrease Indent" size="sm" />
          <ToolButton icon={Indent} onClick={() => {
            document.execCommand('indent', false);
            dispatch({ type: 'INDENT', direction: 'increase' });
          }} tooltip="Increase Indent" size="sm" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Spacing">
        <div className="flex gap-1">
          <ToolButton icon={ArrowUpDown} onClick={() => {}} tooltip="Line Spacing" size="sm" />
          <ToolButton icon={WrapText} onClick={() => {}} tooltip="Paragraph Spacing" size="sm" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Arrange">
        <div className="flex gap-1">
          <ToolButton icon={Layers} onClick={() => {}} tooltip="Arrange" size="sm" />
        </div>
      </ToolbarGroup>
    </div>
  );
}
