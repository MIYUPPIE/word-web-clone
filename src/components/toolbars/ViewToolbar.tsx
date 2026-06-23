import { useEditor } from '@/contexts/EditorContext';
import ToolbarGroup from '@/components/ToolbarGroup';
import ToolButton from '@/components/ToolButton';
import {
  BookOpen,
  Layout,
  Monitor,
  Type,
  ZoomIn,
  ZoomOut,
  Maximize,
  Columns2,
  RectangleHorizontal,
} from 'lucide-react';

export default function ViewToolbar() {
  const { state, dispatch } = useEditor();

  return (
    <div className="flex items-start px-2 py-1 h-[108px] overflow-hidden">
      <ToolbarGroup title="Views">
        <div className="flex gap-1">
          <ToolButton
            icon={BookOpen}
            onClick={() => alert('Read Mode: distraction-free reading')}
            tooltip="Read Mode"
            size="md"
          />
          <ToolButton
            icon={Layout}
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', mode: 'print' })}
            active={state.viewMode === 'print'}
            tooltip="Print Layout"
            size="md"
          />
          <ToolButton
            icon={Monitor}
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', mode: 'web' })}
            active={state.viewMode === 'web'}
            tooltip="Web Layout"
            size="md"
          />
        </div>
      </ToolbarGroup>

      <ToolbarGroup title="Show">
        <div className="flex gap-1 flex-wrap">
          <ToolButton icon={RectangleHorizontal} onClick={() => {}} tooltip="Ruler" size="sm" />
          <ToolButton icon={Type} onClick={() => {}} tooltip="Gridlines" size="sm" />
          <ToolButton icon={Layout} onClick={() => {}} tooltip="Navigation Pane" size="sm" />
        </div>
      </ToolbarGroup>

      <ToolbarGroup title="Zoom">
        <div className="flex gap-1">
          <ToolButton
            icon={ZoomIn}
            onClick={() => dispatch({ type: 'SET_ZOOM', zoom: Math.min(500, state.zoom + 10) })}
            tooltip="Zoom In"
            size="sm"
          />
          <ToolButton
            icon={ZoomOut}
            onClick={() => dispatch({ type: 'SET_ZOOM', zoom: Math.max(10, state.zoom - 10) })}
            tooltip="Zoom Out"
            size="sm"
          />
          <ToolButton
            icon={Maximize}
            onClick={() => dispatch({ type: 'SET_ZOOM', zoom: 100 })}
            tooltip="100%"
            size="sm"
          />
          <ToolButton
            icon={Columns2}
            onClick={() => dispatch({ type: 'SET_ZOOM', zoom: state.zoom === 100 ? 150 : 100 })}
            tooltip="One Page / Multiple Pages"
            size="sm"
          />
        </div>
      </ToolbarGroup>

      <ToolbarGroup title="Window">
        <div className="flex gap-1">
          <ToolButton icon={Maximize} onClick={() => {}} tooltip="New Window" size="sm" />
          <ToolButton icon={RectangleHorizontal} onClick={() => {}} tooltip="Arrange All" size="sm" />
        </div>
      </ToolbarGroup>

      <ToolbarGroup title="Macros">
        <div className="flex gap-1">
          <ToolButton icon={Type} onClick={() => alert('Macros are not supported in the web version.')} tooltip="View Macros" size="sm" />
        </div>
      </ToolbarGroup>
    </div>
  );
}
