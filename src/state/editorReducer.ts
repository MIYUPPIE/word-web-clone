import type { EditorState, EditorAction } from '@/types/editor';
import { initialState } from './initialState';
import { DEFAULT_STYLES } from '@/utils/constants';

export function editorReducer(
  state: EditorState = initialState,
  action: EditorAction
): EditorState {
  switch (action.type) {
    case 'SET_RIBBON_TAB':
      return {
        ...state,
        activeRibbonTab: action.tab as EditorState['activeRibbonTab'],
        showFileMenu: action.tab === 'file',
      };

    case 'TOGGLE_FORMAT': {
      const key = action.format as keyof typeof state.activeFormatting;
      const current = state.activeFormatting[key];
      return {
        ...state,
        activeFormatting: {
          ...state.activeFormatting,
          [key]: typeof current === 'boolean' ? !current : current,
        },
      };
    }

    case 'SET_FORMAT':
      return {
        ...state,
        activeFormatting: {
          ...state.activeFormatting,
          ...action.format,
        },
      };

    case 'SET_ALIGNMENT':
      return {
        ...state,
        activeParagraphStyle: {
          ...state.activeParagraphStyle,
          alignment: action.alignment,
        },
      };

    case 'SET_LINE_SPACING':
      return {
        ...state,
        activeParagraphStyle: {
          ...state.activeParagraphStyle,
          lineSpacing: action.spacing,
        },
      };

    case 'TOGGLE_LIST': {
      const currentList = state.activeParagraphStyle.listType;
      const newListType =
        currentList === action.listType ? 'none' : action.listType;
      return {
        ...state,
        activeParagraphStyle: {
          ...state.activeParagraphStyle,
          listType: newListType,
        },
      };
    }

    case 'INDENT': {
      const currentIndent = state.activeParagraphStyle.indentLeft;
      const change = action.direction === 'increase' ? 0.5 : -0.5;
      return {
        ...state,
        activeParagraphStyle: {
          ...state.activeParagraphStyle,
          indentLeft: Math.max(0, currentIndent + change),
        },
      };
    }

    case 'SET_SELECTION':
      return {
        ...state,
        selection: action.selection,
      };

    case 'OPEN_DIALOG':
      return {
        ...state,
        activeDialog: action.dialog,
      };

    case 'CLOSE_DIALOG':
      return {
        ...state,
        activeDialog: null,
      };

    case 'SHOW_CONTEXT_MENU':
      return {
        ...state,
        contextMenu: { x: action.x, y: action.y },
      };

    case 'HIDE_CONTEXT_MENU':
      return {
        ...state,
        contextMenu: null,
      };

    case 'SET_ZOOM':
      return {
        ...state,
        zoom: Math.max(10, Math.min(500, action.zoom)),
      };

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.mode,
      };

    case 'CLEAR_FORMATTING':
      return {
        ...state,
        activeFormatting: {
          ...state.activeFormatting,
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          subscript: false,
          superscript: false,
          fontColor: '#000000',
          highlightColor: null,
        },
      };

    case 'APPLY_STYLE': {
      const style = DEFAULT_STYLES.find((s) => s.id === action.styleId);
      if (!style) return state;
      return {
        ...state,
        activeFormatting: {
          ...state.activeFormatting,
          ...style.formatting,
        },
        activeParagraphStyle: {
          ...state.activeParagraphStyle,
          ...style.paragraphStyle,
        },
      };
    }

    case 'TOGGLE_FILE_MENU':
      return {
        ...state,
        showFileMenu: !state.showFileMenu,
        activeRibbonTab: state.showFileMenu ? 'home' : 'file',
      };

    case 'HIDE_FILE_MENU':
      return {
        ...state,
        showFileMenu: false,
        activeRibbonTab: 'home',
      };

    case 'SET_ACTIVE_FORMATTING':
      return {
        ...state,
        activeFormatting: {
          ...state.activeFormatting,
          ...action.formatting,
        },
      };

    case 'SET_PARAGRAPH_STYLE':
      return {
        ...state,
        activeParagraphStyle: {
          ...state.activeParagraphStyle,
          ...action.style,
        },
      };

    case 'OPEN_FIND_REPLACE':
      return {
        ...state,
        findReplace: { mode: action.mode },
      };

    case 'CLOSE_FIND_REPLACE':
      return {
        ...state,
        findReplace: null,
      };

    default:
      return state;
  }
}
