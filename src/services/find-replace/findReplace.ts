// Find & Replace service.
//
// The previous implementation did `editor.innerHTML.replaceAll(find, replace)`,
// which corrupts the document: searching for "p" rewrites every <p> tag,
// searching for "span" mangles markup, and any HTML in the replacement is
// injected raw. This service operates only on text nodes, so tag names,
// attributes, and structure are never touched — exactly how a word processor
// behaves.

export interface MatchOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
}

export interface TextMatch {
  node: Text;
  /** Start offset of the match within the text node. */
  start: number;
  /** End offset (exclusive) of the match within the text node. */
  end: number;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Build the search regex once, shared by counting / replacing / locating. */
export function buildPattern(find: string, options: MatchOptions = {}): RegExp | null {
  if (!find) return null;
  const body = escapeRegExp(find);
  const pattern = options.wholeWord ? `\\b${body}\\b` : body;
  const flags = options.caseSensitive ? 'g' : 'gi';
  return new RegExp(pattern, flags);
}

/** Count occurrences of `find` inside a plain string. */
export function countInString(
  text: string,
  find: string,
  options: MatchOptions = {}
): number {
  const re = buildPattern(find, options);
  if (!re) return 0;
  const matches = text.match(re);
  return matches ? matches.length : 0;
}

/**
 * Replace every occurrence in a string. Returns the new string and how many
 * replacements happened. The replacement is inserted as literal text (no `$1`
 * style interpretation) so user input is never treated as a regex template.
 */
export function replaceInString(
  text: string,
  find: string,
  replaceWith: string,
  options: MatchOptions = {}
): { result: string; count: number } {
  const re = buildPattern(find, options);
  if (!re) return { result: text, count: 0 };
  let count = 0;
  const result = text.replace(re, () => {
    count += 1;
    return replaceWith;
  });
  return { result, count };
}

function* textNodes(root: Node): Generator<Text> {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    yield node as Text;
    node = walker.nextNode();
  }
}

/** Count matches across every text node under `root`. */
export function countMatches(
  root: Node,
  find: string,
  options: MatchOptions = {}
): number {
  if (!find) return 0;
  let total = 0;
  for (const node of textNodes(root)) {
    total += countInString(node.nodeValue ?? '', find, options);
  }
  return total;
}

/**
 * Replace every match under `root` in place. Only text-node values change, so
 * the surrounding HTML is structurally identical. Returns the replacement
 * count.
 */
export function replaceAll(
  root: Node,
  find: string,
  replaceWith: string,
  options: MatchOptions = {}
): number {
  if (!find) return 0;
  let total = 0;
  // Materialize first: replacing while walking can disturb the walker.
  const nodes = Array.from(textNodes(root));
  for (const node of nodes) {
    const { result, count } = replaceInString(
      node.nodeValue ?? '',
      find,
      replaceWith,
      options
    );
    if (count > 0) {
      node.nodeValue = result;
      total += count;
    }
  }
  return total;
}

/** Replace a single located match in place (used by the "Replace" button). */
export function replaceMatch(match: TextMatch, replaceWith: string): void {
  const value = match.node.nodeValue ?? '';
  match.node.nodeValue =
    value.slice(0, match.start) + replaceWith + value.slice(match.end);
}

/**
 * Locate every match as a (text node, start, end) range. Used by the UI to
 * select and scroll to "Find Next" without mutating the document.
 */
export function findMatches(
  root: Node,
  find: string,
  options: MatchOptions = {}
): TextMatch[] {
  const re = buildPattern(find, options);
  if (!re) return [];
  const matches: TextMatch[] = [];
  for (const node of textNodes(root)) {
    const value = node.nodeValue ?? '';
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(value)) !== null) {
      matches.push({ node, start: m.index, end: m.index + m[0].length });
      // Guard against zero-length matches looping forever.
      if (m.index === re.lastIndex) re.lastIndex += 1;
    }
  }
  return matches;
}
