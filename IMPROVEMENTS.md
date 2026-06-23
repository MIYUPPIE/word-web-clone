# Improvements

This round turned the Word clone from a UI mockup into an editor you can
actually trust with your work. Each change is a self-contained service under
`src/services/` with its own gate tests.

Run the tests: `npm test` (79 deterministic tests, jsdom, no network).
Build: `npm run build`.

## 1. Document persistence (the headline fix)
`src/services/persistence/`

Before: a page refresh wiped the entire document. There was no save except a
manual "download as .html".

Now:
- The document autosaves to `localStorage` (debounced 800ms) on every edit.
- It is restored on load, so a refresh or accidental close keeps your work.
- The status bar shows `Saving… / Saved <time> / Save failed`.
- `Ctrl+S` flushes an immediate save (no more forced file download).
- `File > New` clears storage; `File > Open` persists the opened document.
- Storage is schema-versioned and capped (4MB); corrupt or future data
  degrades to "empty" instead of crashing.

## 2. Working undo / redo
`src/services/history/`

Before: the undo/redo stack was pushed but never restored — `UNDO`/`REDO`
only shuffled a dead array. It half-relied on `execCommand('undo')`, which
can't see direct DOM edits (font sizing, find/replace).

Now: a self-contained history snapshots the editor HTML + caret offset on every
`input`, so `Ctrl+Z` / `Ctrl+Y` / `Ctrl+Shift+Z` and the title-bar buttons undo
*every* kind of change uniformly. Caret is restored by absolute character
offset (`caret.ts`). The old reducer history was removed.

## 3. Safe Find & Replace
`src/services/find-replace/` + `components/dialogs/FindReplaceDialog.tsx`

Before: `editor.innerHTML.replaceAll(find, replace)` — searching "p" rewrote
every `<p>` tag and any HTML in the replacement was injected raw. Driven by
`window.prompt`.

Now: a real non-modal panel (`Ctrl+F` find, `Ctrl+H` replace) with match
case / whole word, live `n/total` counter, next/prev navigation, Replace and
Replace All. Replacement only touches text nodes, so markup is never corrupted
and replacement text is inserted literally.

## 4. Correct font sizing
`src/services/formatting/fontSize.ts`

Before: grow/shrink/spinner ran `execCommand('fontSize','7')` then, on a
`setTimeout`, did `document.querySelectorAll('font[size="7"]')` — a **global**
scan that rewrote matching `<font>` tags anywhere on the page, racing the timer.

Now: the selected range is wrapped in a `<span style="font-size: Npx">`, scoped
to the editor, with nested sizes stripped so the new size wins. No timers, no
global scans.

## 5. Live word + character count
`src/services/text-stats/`

The status bar now shows a live word count; click it to toggle to character
count. Counting is a pure, tested function.

## Testing setup
`vitest` + `jsdom` were added. Logic lives in pure/DOM functions with unit
tests; the persistence and history hooks have integration tests; `WordEditor`
has a full-mount smoke test. Gate tests are deterministic and free
(`npm test`).
