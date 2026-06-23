import ToolbarGroup from '@/components/ToolbarGroup';
import ToolButton from '@/components/ToolButton';
import SplitButton from '@/components/SplitButton';
import { Palette, Paintbrush, Type, AlignVerticalSpaceAround, Droplets } from 'lucide-react';

export default function DesignToolbar() {
  return (
    <div className="flex items-start px-2 py-1 h-[108px] overflow-hidden">
      <ToolbarGroup title="Themes">
        <SplitButton icon={Palette} label="Themes" onClick={() => {}} />
      </ToolbarGroup>
      <ToolbarGroup title="Document Formatting">
        <SplitButton icon={Paintbrush} label="Colors" onClick={() => {}} />
        <SplitButton icon={Type} label="Fonts" onClick={() => {}} />
        <SplitButton icon={AlignVerticalSpaceAround} label="Paragraph Spacing" onClick={() => {}} />
      </ToolbarGroup>
      <ToolbarGroup title="Page Background">
        <div className="flex gap-1">
          <ToolButton icon={Droplets} onClick={() => {}} tooltip="Watermark" size="sm" />
          <ToolButton icon={Palette} onClick={() => {}} tooltip="Page Color" size="sm" />
        </div>
      </ToolbarGroup>
    </div>
  );
}
