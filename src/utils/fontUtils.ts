// Font utility functions

/**
 * Extract the primary font name from a font stack
 * e.g., "Calibri, Segoe UI, Arial, sans-serif" -> "Calibri"
 */
export function getPrimaryFontName(fontStack: string): string {
  if (!fontStack) return 'Calibri';
  // Split by comma and take the first one, removing quotes
  const first = fontStack.split(',')[0].trim();
  return first.replace(/^["']|["']$/g, '');
}

/**
 * Check if a font is in our supported list
 */
export function isKnownFont(fontName: string, fontList: string[]): boolean {
  const primary = getPrimaryFontName(fontName);
  return fontList.some(
    (f) => f.toLowerCase() === primary.toLowerCase()
  );
}
