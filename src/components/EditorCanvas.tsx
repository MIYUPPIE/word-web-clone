import { forwardRef } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { PAGE_WIDTH, PAGE_HEIGHT, PAGE_MARGIN } from '@/utils/constants';

interface EditorCanvasProps {
  onContextMenu: (e: React.MouseEvent) => void;
  zoom: number;
}

const EditorCanvas = forwardRef<HTMLDivElement, EditorCanvasProps>(
  ({ onContextMenu, zoom }, ref) => {
    const { state } = useEditor();

    const pageWidth = PAGE_WIDTH;
    const pageHeight = PAGE_HEIGHT;
    const margin = PAGE_MARGIN;
    const zoomDecimal = zoom / 100;

    return (
      <div
        className="flex-1 overflow-auto editor-scroll relative flex flex-col items-center py-6"
        style={{ backgroundColor: 'var(--editor-bg)' }}
      >
        {/* Page 1 */}
        <div
          className="relative bg-white flex-shrink-0"
          style={{
            width: pageWidth,
            minHeight: pageHeight,
            boxShadow: '0 0 12px rgba(0,0,0,0.15)',
            zoom: zoomDecimal,
            marginBottom: zoomDecimal !== 1 ? `${24 * zoomDecimal}px` : '24px',
          }}
        >
          {/* Margin guides (visual only) */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: margin,
              left: margin,
              right: margin,
              bottom: margin,
              border: '1px dashed #e8e8e8',
            }}
          />

          {/* Content editable area */}
          <div
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            className="editor-content relative"
            style={{
              padding: `${margin}px`,
              minHeight: pageHeight - margin * 2,
              outline: 'none',
            }}
            onContextMenu={onContextMenu}
            spellCheck={false}
          >
            <p>
              <br />
            </p>
          </div>
        </div>

        {/* Additional pages */}
        {state.totalPages > 1 && (
          <>
            {Array.from({ length: state.totalPages - 1 }, (_, i) => (
              <div
                key={i + 2}
                className="relative bg-white flex-shrink-0"
                style={{
                  width: pageWidth,
                  minHeight: pageHeight,
                  boxShadow: '0 0 12px rgba(0,0,0,0.15)',
                  zoom: zoomDecimal,
                  marginBottom: zoomDecimal !== 1 ? `${24 * zoomDecimal}px` : '24px',
                }}
              >
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: margin,
                    left: margin,
                    right: margin,
                    bottom: margin,
                    border: '1px dashed #e8e8e8',
                  }}
                />
                <div
                  className="editor-content relative"
                  style={{
                    padding: `${margin}px`,
                    minHeight: pageHeight - margin * 2,
                    outline: 'none',
                  }}
                >
                  <p>
                    <br />
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
);

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;
