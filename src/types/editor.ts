// Core editor types for Microsoft Word Web Clone

export interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  subscript: boolean;
  superscript: boolean;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  highlightColor: string | null;
}

export interface ParagraphStyle {
  alignment: 'left' | 'center' | 'right' | 'justify';
  lineSpacing: number;
  spaceBefore: number;
  spaceAfter: number;
  indentLeft: number;
  indentRight: number;
  indentFirstLine: number;
  listType: 'none' | 'bullet' | 'number';
  listLevel: number;
}

export interface DocumentStyle {
  id: string;
  name: string;
  formatting: Partial<TextFormatting>;
  paragraphStyle: Partial<ParagraphStyle>;
  preview: string;
}

export type RibbonTab =
  | 'file'
  | 'home'
  | 'insert'
  | 'draw'
  | 'design'
  | 'layout'
  | 'references'
  | 'review'
  | 'view'
  | 'help';

export type DialogType = 'insert_picture' | 'font_dialog' | 'paragraph_dialog';

export type ViewMode = 'print' | 'web';

export interface EditorSelection {
  start: number;
  end: number;
  collapsed: boolean;
}

export interface EditorState {
  currentPage: number;
  totalPages: number;
  selection: EditorSelection | null;
  activeFormatting: TextFormatting;
  activeParagraphStyle: ParagraphStyle;
  activeRibbonTab: RibbonTab;
  activeDialog: DialogType | null;
  contextMenu: { x: number; y: number } | null;
  zoom: number;
  viewMode: ViewMode;
  showFileMenu: boolean;
  findReplace: { mode: 'find' | 'replace' } | null;
}

export type EditorAction =
  | { type: 'SET_RIBBON_TAB'; tab: RibbonTab }
  | { type: 'TOGGLE_FORMAT'; format: keyof TextFormatting }
  | { type: 'SET_FORMAT'; format: Partial<TextFormatting> }
  | { type: 'SET_ALIGNMENT'; alignment: ParagraphStyle['alignment'] }
  | { type: 'SET_LINE_SPACING'; spacing: number }
  | { type: 'TOGGLE_LIST'; listType: 'bullet' | 'number' }
  | { type: 'INDENT'; direction: 'increase' | 'decrease' }
  | { type: 'SET_SELECTION'; selection: EditorSelection | null }
  | { type: 'OPEN_DIALOG'; dialog: DialogType }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'SHOW_CONTEXT_MENU'; x: number; y: number }
  | { type: 'HIDE_CONTEXT_MENU' }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_VIEW_MODE'; mode: ViewMode }
  | { type: 'CLEAR_FORMATTING' }
  | { type: 'APPLY_STYLE'; styleId: string }
  | { type: 'TOGGLE_FILE_MENU' }
  | { type: 'HIDE_FILE_MENU' }
  | { type: 'SET_ACTIVE_FORMATTING'; formatting: Partial<TextFormatting> }
  | { type: 'SET_PARAGRAPH_STYLE'; style: Partial<ParagraphStyle> }
  | { type: 'OPEN_FIND_REPLACE'; mode: 'find' | 'replace' }
  | { type: 'CLOSE_FIND_REPLACE' };
