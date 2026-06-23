import { useEditor } from '@/contexts/EditorContext';
import { RIBBON_TABS } from '@/utils/constants';
import HomeToolbar from '@/components/toolbars/HomeToolbar';
import InsertToolbar from '@/components/toolbars/InsertToolbar';
import DrawToolbar from '@/components/toolbars/DrawToolbar';
import DesignToolbar from '@/components/toolbars/DesignToolbar';
import LayoutToolbar from '@/components/toolbars/LayoutToolbar';
import ReferencesToolbar from '@/components/toolbars/ReferencesToolbar';
import ReviewToolbar from '@/components/toolbars/ReviewToolbar';
import ViewToolbar from '@/components/toolbars/ViewToolbar';
import FileMenu from '@/components/FileMenu';
import type { RefObject } from 'react';

interface RibbonProps {
  editorRef: RefObject<HTMLDivElement | null>;
  pushHistory: () => void;
}

export default function Ribbon({ editorRef, pushHistory }: RibbonProps) {
  const { state, dispatch } = useEditor();

  const renderToolbar = () => {
    switch (state.activeRibbonTab) {
      case 'home':
        return <HomeToolbar editorRef={editorRef} pushHistory={pushHistory} />;
      case 'insert':
        return <InsertToolbar pushHistory={pushHistory} />;
      case 'draw':
        return <DrawToolbar />;
      case 'design':
        return <DesignToolbar />;
      case 'layout':
        return <LayoutToolbar />;
      case 'references':
        return <ReferencesToolbar />;
      case 'review':
        return <ReviewToolbar />;
      case 'view':
        return <ViewToolbar />;
      default:
        return <HomeToolbar editorRef={editorRef} pushHistory={pushHistory} />;
    }
  };

  return (
    <div className="flex flex-col" style={{ backgroundColor: 'var(--ribbon-bg)' }}>
      {/* File Menu Overlay */}
      {state.showFileMenu && <FileMenu />}

      {/* Ribbon Tab Bar */}
      <div className="flex items-end px-1 h-[28px]">
        {RIBBON_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.stopPropagation();
              if (tab.tab === 'file') {
                dispatch({ type: 'TOGGLE_FILE_MENU' });
              } else {
                if (state.showFileMenu) {
                  dispatch({ type: 'HIDE_FILE_MENU' });
                }
                dispatch({ type: 'SET_RIBBON_TAB', tab: tab.tab as typeof state.activeRibbonTab });
              }
            }}
            className="px-3 py-1 text-[13px] font-medium transition-colors relative"
            style={{
              backgroundColor:
                (tab.tab === 'file' && state.showFileMenu) ||
                (tab.tab !== 'file' && state.activeRibbonTab === tab.tab && !state.showFileMenu)
                  ? 'var(--toolbar-bg)'
                  : 'transparent',
              color:
                tab.id === 'copilot' || tab.id === 'editor'
                  ? '#2b579a'
                  : tab.tab === 'file' && state.showFileMenu
                    ? 'var(--word-green)'
                    : '#323130',
            }}
            onMouseEnter={(e) => {
              if (
                !(
                  (tab.tab === 'file' && state.showFileMenu) ||
                  (tab.tab !== 'file' && state.activeRibbonTab === tab.tab && !state.showFileMenu)
                )
              ) {
                (e.target as HTMLElement).style.backgroundColor = 'var(--ribbon-tab-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (
                !(
                  (tab.tab === 'file' && state.showFileMenu) ||
                  (tab.tab !== 'file' && state.activeRibbonTab === tab.tab && !state.showFileMenu)
                )
              ) {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar Area */}
      {!state.showFileMenu && (
        <div
          className="border-b border-[#d5d5d5]"
          style={{ backgroundColor: 'var(--toolbar-bg)' }}
        >
          {renderToolbar()}
        </div>
      )}
    </div>
  );
}
