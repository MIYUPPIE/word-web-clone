// Formatting utility functions - wrappers around document.execCommand
import { applyFontSize } from '@/services/formatting/fontSize';

export function toggleBold() {
  document.execCommand('bold', false);
}

export function toggleItalic() {
  document.execCommand('italic', false);
}

export function toggleUnderline() {
  document.execCommand('underline', false);
}

export function toggleStrikethrough() {
  document.execCommand('strikeThrough', false);
}

export function toggleSubscript() {
  document.execCommand('subscript', false);
}

export function toggleSuperscript() {
  document.execCommand('superscript', false);
}

export function setFontFamily(fontName: string) {
  document.execCommand('fontName', false, fontName);
}

export function setFontSize(size: number) {
  // Delegate to the scoped, tested font-size service. Operates on the active
  // editor's selection only — no global DOM scans, no timers.
  const editor = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
  if (editor) applyFontSize(editor, size);
}

export function setFontColor(color: string) {
  document.execCommand('foreColor', false, color);
}

export function setHighlightColor(color: string | null) {
  if (color === null) {
    document.execCommand('hiliteColor', false, 'transparent');
  } else {
    document.execCommand('hiliteColor', false, color);
  }
}

export function setAlignment(alignment: 'left' | 'center' | 'right' | 'justify') {
  const commandMap = {
    left: 'justifyLeft',
    center: 'justifyCenter',
    right: 'justifyRight',
    justify: 'justifyFull',
  };
  document.execCommand(commandMap[alignment], false);
}

export function toggleBulletList() {
  document.execCommand('insertUnorderedList', false);
}

export function toggleNumberList() {
  document.execCommand('insertOrderedList', false);
}

export function increaseIndent() {
  document.execCommand('indent', false);
}

export function decreaseIndent() {
  document.execCommand('outdent', false);
}

export function clearFormatting() {
  document.execCommand('removeFormat', false);
}

export function insertImage(src: string) {
  document.execCommand('insertImage', false, src);
}

export function insertHTML(html: string) {
  document.execCommand('insertHTML', false, html);
}

export function queryCommandState(command: string): boolean {
  return document.queryCommandState(command);
}

export function queryCommandValue(command: string): string {
  return document.queryCommandValue(command);
}

// Get formatting at current selection
export function getSelectionFormatting() {
  return {
    bold: queryCommandState('bold'),
    italic: queryCommandState('italic'),
    underline: queryCommandState('underline'),
    strikethrough: queryCommandState('strikeThrough'),
    subscript: queryCommandState('subscript'),
    superscript: queryCommandState('superscript'),
    fontFamily: (queryCommandValue('fontName') || 'Calibri').replace(/"/g, ''),
    fontSize: parseInt(queryCommandValue('fontSize')) || 11,
    fontColor: rgbToHex(queryCommandValue('foreColor') || '#000000'),
    highlightColor: rgbToHex(queryCommandValue('hiliteColor') || 'transparent'),
  };
}

// Helper: convert RGB to hex
function rgbToHex(color: string): string {
  if (color.startsWith('#')) return color;
  if (color === 'transparent') return 'transparent';

  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#000000';
}

// Save document as HTML file
export function saveDocument(content: string) {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Document</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.15; margin: 1in; }
</style>
</head>
<body>
${content}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.html';
  a.click();
  URL.revokeObjectURL(url);
}
