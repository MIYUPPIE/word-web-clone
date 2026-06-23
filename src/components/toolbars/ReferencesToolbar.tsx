import ToolbarGroup from '@/components/ToolbarGroup';
import ToolButton from '@/components/ToolButton';
import SplitButton from '@/components/SplitButton';
import { BookOpen, BookMarked, Quote, MessageSquare, ListOrdered, TableOfContents, Footprints } from 'lucide-react';

export default function ReferencesToolbar() {
  return (
    <div className="flex items-start px-2 py-1 h-[108px] overflow-hidden">
      <ToolbarGroup title="Table of Contents">
        <SplitButton icon={TableOfContents} label="Table of Contents" onClick={() => {}} />
      </ToolbarGroup>
      <ToolbarGroup title="Footnotes">
        <div className="flex gap-1">
          <ToolButton icon={Footprints} onClick={() => {
            const note = prompt('Enter footnote:');
            if (note) {
              document.execCommand('insertHTML', false, `<sup style="color:#2b579a;">[1]</sup>`);
            }
          }} tooltip="Insert Footnote" size="md" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Citations & Bibliography">
        <SplitButton icon={Quote} label="Insert Citation" onClick={() => {}} />
        <ToolButton icon={BookMarked} onClick={() => {}} tooltip="Bibliography" size="sm" />
      </ToolbarGroup>
      <ToolbarGroup title="Captions">
        <div className="flex gap-1">
          <ToolButton icon={MessageSquare} onClick={() => {}} tooltip="Insert Caption" size="sm" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Index">
        <div className="flex gap-1">
          <ToolButton icon={ListOrdered} onClick={() => {}} tooltip="Mark Entry" size="sm" />
          <ToolButton icon={BookOpen} onClick={() => {}} tooltip="Insert Index" size="sm" />
        </div>
      </ToolbarGroup>
    </div>
  );
}
