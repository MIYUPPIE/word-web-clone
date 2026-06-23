import type { EditorState } from '@/types/editor';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
} from '@/utils/constants';

export const initialState: EditorState = {
  currentPage: 1,
  totalPages: 1,
  selection: null,
  activeFormatting: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    subscript: false,
    superscript: false,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
    fontColor: DEFAULT_FONT_COLOR,
    highlightColor: null,
  },
  activeParagraphStyle: {
    alignment: 'left',
    lineSpacing: 1.15,
    spaceBefore: 0,
    spaceAfter: 0,
    indentLeft: 0,
    indentRight: 0,
    indentFirstLine: 0,
    listType: 'none',
    listLevel: 0,
  },
  activeRibbonTab: 'home',
  activeDialog: null,
  contextMenu: null,
  zoom: 100,
  viewMode: 'print',
  showFileMenu: false,
  findReplace: null,
};
