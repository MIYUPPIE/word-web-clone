// Constants for Microsoft Word Web Clone

export const FONTS = [
  'Calibri',
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS',
  'Segoe UI',
  'Palatino Linotype',
  'Garamond',
  'Bookman Old Style',
  'Candara',
  'Consolas',
];

export const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

export const DEFAULT_FONT_FAMILY = 'Calibri';
export const DEFAULT_FONT_SIZE = 11;
export const DEFAULT_FONT_COLOR = '#000000';

// Theme colors (10 columns × 6 rows)
export const THEME_COLORS = [
  // Row 1: Lightest
  ['#FFFFFF', '#F2F2F2', '#E6E6E6', '#D9D9D9', '#CDCDCD', '#C0C0C0', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C'],
  // Row 2
  ['#E7E6E6', '#D0CECE', '#BFBFBF', '#A5A5A5', '#7F7F7F', '#595959', '#3F3F3F', '#262626', '#0C0C0C', '#000000'],
  // Row 3: Accents
  ['#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'],
  // Row 4
  ['#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'],
  // Row 5
  ['#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'],
  // Row 6: Darkest
  ['#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'],
];

// Standard colors
export const STANDARD_COLORS = [
  '#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050',
  '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0',
];

// Highlight colors
export const HIGHLIGHT_COLORS = [
  '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#0000FF',
  '#FF0000', '#000080', '#800080', '#008000', '#808000',
];

export const LINE_SPACING_OPTIONS = [
  { label: '1.0', value: 1.0 },
  { label: '1.15', value: 1.15 },
  { label: '1.5', value: 1.5 },
  { label: '2.0', value: 2.0 },
  { label: '2.5', value: 2.5 },
  { label: '3.0', value: 3.0 },
];

export const DEFAULT_STYLES = [
  {
    id: 'normal',
    name: 'Normal',
    formatting: { fontFamily: 'Calibri', fontSize: 11 },
    paragraphStyle: { alignment: 'left' as const, lineSpacing: 1.15 },
    preview: 'AaBbCcDd',
  },
  {
    id: 'heading1',
    name: 'Heading 1',
    formatting: { fontFamily: 'Calibri', fontSize: 16, bold: true, fontColor: '#2E74B5' },
    paragraphStyle: { alignment: 'left' as const, lineSpacing: 1.15, spaceBefore: 12, spaceAfter: 6 },
    preview: 'Heading 1',
  },
  {
    id: 'heading2',
    name: 'Heading 2',
    formatting: { fontFamily: 'Calibri', fontSize: 13, bold: true, fontColor: '#2E74B5' },
    paragraphStyle: { alignment: 'left' as const, lineSpacing: 1.15, spaceBefore: 8, spaceAfter: 4 },
    preview: 'Heading 2',
  },
  {
    id: 'title',
    name: 'Title',
    formatting: { fontFamily: 'Calibri', fontSize: 28, bold: false, fontColor: '#000000' },
    paragraphStyle: { alignment: 'center' as const, lineSpacing: 1.0, spaceAfter: 12 },
    preview: 'Title',
  },
  {
    id: 'subtitle',
    name: 'Subtitle',
    formatting: { fontFamily: 'Calibri', fontSize: 12, italic: true, fontColor: '#404040' },
    paragraphStyle: { alignment: 'center' as const, lineSpacing: 1.15, spaceAfter: 18 },
    preview: 'Subtitle',
  },
  {
    id: 'quote',
    name: 'Quote',
    formatting: { fontFamily: 'Calibri', fontSize: 11, italic: true, fontColor: '#404040' },
    paragraphStyle: { alignment: 'left' as const, lineSpacing: 1.15, indentLeft: 0.5 },
    preview: 'Quote',
  },
  {
    id: 'intense-quote',
    name: 'Intense Quote',
    formatting: { fontFamily: 'Calibri', fontSize: 11, italic: true, bold: true, fontColor: '#2E74B5' },
    paragraphStyle: { alignment: 'center' as const, lineSpacing: 1.15, indentLeft: 0.5, indentRight: 0.5 },
    preview: 'Intense Quote',
  },
  {
    id: 'list-paragraph',
    name: 'List Paragraph',
    formatting: { fontFamily: 'Calibri', fontSize: 11 },
    paragraphStyle: { alignment: 'left' as const, lineSpacing: 1.15, listType: 'bullet' as const },
    preview: 'List Paragraph',
  },
  {
    id: 'no-spacing',
    name: 'No Spacing',
    formatting: { fontFamily: 'Calibri', fontSize: 11 },
    paragraphStyle: { alignment: 'left' as const, lineSpacing: 1.0 },
    preview: 'No Spacing',
  },
];

export const PAGE_WIDTH = 794; // px (A4 at 96 DPI)
export const PAGE_HEIGHT = 1123; // px (A4 at 96 DPI)
export const PAGE_MARGIN = 96; // px (1 inch)
export const MAX_HISTORY_SIZE = 50;

export const RIBBON_TABS: { id: string; label: string; tab: string }[] = [
  { id: 'file', label: 'File', tab: 'file' },
  { id: 'home', label: 'Home', tab: 'home' },
  { id: 'insert', label: 'Insert', tab: 'insert' },
  { id: 'draw', label: 'Draw', tab: 'draw' },
  { id: 'design', label: 'Design', tab: 'design' },
  { id: 'layout', label: 'Layout', tab: 'layout' },
  { id: 'references', label: 'References', tab: 'references' },
  { id: 'review', label: 'Review', tab: 'review' },
  { id: 'view', label: 'View', tab: 'view' },
  { id: 'help', label: 'Help', tab: 'help' },
  { id: 'editor', label: 'Editor', tab: 'editor' },
  { id: 'copilot', label: 'Copilot', tab: 'copilot' },
];
