import { describe, it, expect } from 'vitest';
import {
  serialize,
  deserialize,
  loadDocument,
  saveDocument,
  clearDocument,
  STORAGE_KEY,
  SCHEMA_VERSION,
  MAX_HTML_BYTES,
} from './persistence';

describe('serialize / deserialize', () => {
  it('round-trips an HTML document', () => {
    const raw = serialize('<p>hello <b>world</b></p>', 1700000000000);
    const record = deserialize(raw);
    expect(record).toEqual({
      version: SCHEMA_VERSION,
      html: '<p>hello <b>world</b></p>',
      updatedAt: 1700000000000,
    });
  });

  it('returns null for null / empty input', () => {
    expect(deserialize(null)).toBeNull();
    expect(deserialize('')).toBeNull();
  });

  it('returns null for malformed JSON instead of throwing', () => {
    expect(deserialize('{not json')).toBeNull();
  });

  it('returns null when html field is missing or wrong type', () => {
    expect(deserialize(JSON.stringify({ version: 1, updatedAt: 0 }))).toBeNull();
    expect(
      deserialize(JSON.stringify({ version: 1, html: 42, updatedAt: 0 }))
    ).toBeNull();
  });

  it('rejects a newer schema version it cannot understand', () => {
    const future = JSON.stringify({
      version: SCHEMA_VERSION + 1,
      html: '<p>x</p>',
      updatedAt: 0,
    });
    expect(deserialize(future)).toBeNull();
  });

  it('defaults a missing timestamp to 0', () => {
    const record = deserialize(
      JSON.stringify({ version: SCHEMA_VERSION, html: '<p>x</p>' })
    );
    expect(record?.updatedAt).toBe(0);
  });
});

describe('saveDocument / loadDocument', () => {
  it('persists and reloads a document', () => {
    const result = saveDocument('<p>draft</p>', 12345);
    expect(result.ok).toBe(true);
    const loaded = loadDocument();
    expect(loaded?.html).toBe('<p>draft</p>');
    expect(loaded?.updatedAt).toBe(12345);
  });

  it('overwrites the previous save (last write wins)', () => {
    saveDocument('<p>v1</p>', 1);
    saveDocument('<p>v2</p>', 2);
    expect(loadDocument()?.html).toBe('<p>v2</p>');
  });

  it('writes under the documented storage key', () => {
    saveDocument('<p>keyed</p>', 1);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it('returns null when nothing has been saved', () => {
    expect(loadDocument()).toBeNull();
  });

  it('rejects documents over the byte cap without writing', () => {
    const huge = 'a'.repeat(MAX_HTML_BYTES + 1);
    const result = saveDocument(huge, 1);
    expect(result).toMatchObject({ ok: false, reason: 'too-large' });
    expect(loadDocument()).toBeNull();
  });

  it('survives a corrupt stored value by loading null', () => {
    localStorage.setItem(STORAGE_KEY, 'garbage{');
    expect(loadDocument()).toBeNull();
  });
});

describe('clearDocument', () => {
  it('removes a persisted document', () => {
    saveDocument('<p>bye</p>', 1);
    clearDocument();
    expect(loadDocument()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('is a no-op when nothing is stored', () => {
    expect(() => clearDocument()).not.toThrow();
  });
});
