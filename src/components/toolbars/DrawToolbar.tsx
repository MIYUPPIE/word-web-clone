import ToolbarGroup from '@/components/ToolbarGroup';
import ToolButton from '@/components/ToolButton';
import { Pencil, Eraser, Circle, Square, Minus, Paintbrush, Palette } from 'lucide-react';

export default function DrawToolbar() {
  return (
    <div className="flex items-start px-2 py-1 h-[108px] overflow-hidden">
      <ToolbarGroup title="Drawing Tools">
        <div className="flex gap-1 flex-wrap">
          <ToolButton icon={Pencil} onClick={() => {}} tooltip="Pen" size="md" />
          <ToolButton icon={Eraser} onClick={() => {}} tooltip="Eraser" size="md" />
          <ToolButton icon={Paintbrush} onClick={() => {}} tooltip="Highlighter" size="md" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Shapes">
        <div className="flex gap-1 flex-wrap">
          <ToolButton icon={Square} onClick={() => {}} tooltip="Rectangle" size="sm" />
          <ToolButton icon={Circle} onClick={() => {}} tooltip="Ellipse" size="sm" />
          <ToolButton icon={Minus} onClick={() => {}} tooltip="Line" size="sm" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Options">
        <div className="flex gap-1 flex-wrap">
          <ToolButton icon={Palette} onClick={() => {}} tooltip="Ink Color" size="sm" />
        </div>
      </ToolbarGroup>
    </div>
  );
}
