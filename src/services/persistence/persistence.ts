// Persistence service: durably store the open document in localStorage so a
// page refresh or accidental close never loses work.
//
// Contract (the only surface other code may depend on):
//   - loadDocument(): DocumentRecord | null
//   - saveDocument(html): SaveResult
//   - clearDocument(): void
//   - serialize / deserialize: pure (html, meta) <-> JSON string
//
// Everything is same-input-same-output and unit tested. The React layer only
// adds debouncing and lifecycle wiring on top of these primitives.

export const STORAGE_KEY = 'word-clone:document';
export const SCHEMA_VERSION = 1;

// Hard cap so a runaway document can never exceed the ~5MB localStorage quota
// and throw on every keystroke. 4MB of HTML is far beyond any realistic doc.
export const MAX_HTML_BYTES = 4 * 1024 * 1024;

export interface DocumentRecord {
  version: number;
  html: string;
  updatedAt: number;
}

export type SaveResult =
  | { ok: true; record: DocumentRecord }
  | { ok: false; reason: 'too-large' | 'quota' | 'unavailable'; bytes?: number };

function byteLength(str: string): number {
  // UTF-8 byte length without allocating a TextEncoder when unsupported.
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  return unescape(encodeURIComponent(str)).length;
}

/** Serialize a document record to the exact string stored in localStorage. */
export function serialize(html: string, updatedAt: number): string {
  const record: DocumentRecord = { version: SCHEMA_VERSION, html, updatedAt };
  return JSON.stringify(record);
}

/**
 * Parse a stored string back into a record. Returns null for anything that is
 * missing, malformed, or from an incompatible future schema version, so a
 * corrupt entry degrades to "empty document" rather than crashing the app.
 */
export function deserialize(raw: string | null): DocumentRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<DocumentRecord>;
    if (
      !parsed ||
      typeof parsed.html !== 'string' ||
      typeof parsed.version !== 'number' ||
      parsed.version > SCHEMA_VERSION
    ) {
      return null;
    }
    return {
      version: parsed.version,
      html: parsed.html,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0,
    };
  } catch {
    return null;
  }
}

function getStorage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    // Accessing localStorage can throw in sandboxed iframes / privacy modes.
    return null;
  }
}

/** Load the persisted document, or null if there is nothing valid saved. */
export function loadDocument(): DocumentRecord | null {
  const storage = getStorage();
  if (!storage) return null;
  return deserialize(storage.getItem(STORAGE_KEY));
}

/** Persist the document. Never throws; returns a typed failure instead. */
export function saveDocument(html: string, now: number = Date.now()): SaveResult {
  const storage = getStorage();
  if (!storage) return { ok: false, reason: 'unavailable' };

  const bytes = byteLength(html);
  if (bytes > MAX_HTML_BYTES) {
    return { ok: false, reason: 'too-large', bytes };
  }

  const record: DocumentRecord = {
    version: SCHEMA_VERSION,
    html,
    updatedAt: now,
  };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(record));
    return { ok: true, record };
  } catch {
    // QuotaExceededError or a disabled store.
    return { ok: false, reason: 'quota', bytes };
  }
}

/** Remove the persisted document (used by File > New). */
export function clearDocument(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do if the store is unavailable.
  }
}
