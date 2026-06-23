import { describe, it, expect } from 'vitest';
import {
  createHistory,
  record,
  undo,
  redo,
  canUndo,
  canRedo,
} from './historyStack';

describe('history stack', () => {
  it('starts empty with the given present', () => {
    const h = createHistory('a');
    expect(h.present).toBe('a');
    expect(canUndo(h)).toBe(false);
    expect(canRedo(h)).toBe(false);
  });

  it('records snapshots and supports undo back to earlier states', () => {
    let h = createHistory('a');
    h = record(h, 'b');
    h = record(h, 'c');
    expect(h.present).toBe('c');
    expect(canUndo(h)).toBe(true);

    h = undo(h);
    expect(h.present).toBe('b');
    h = undo(h);
    expect(h.present).toBe('a');
    expect(canUndo(h)).toBe(false);
  });

  it('redoes after undo', () => {
    let h = createHistory('a');
    h = record(h, 'b');
    h = undo(h);
    expect(h.present).toBe('a');
    h = redo(h);
    expect(h.present).toBe('b');
    expect(canRedo(h)).toBe(false);
  });

  it('clears the redo stack when a new snapshot is recorded', () => {
    let h = createHistory('a');
    h = record(h, 'b');
    h = undo(h); // present a, future [b]
    h = record(h, 'x'); // diverge
    expect(h.present).toBe('x');
    expect(canRedo(h)).toBe(false);
  });

  it('ignores a snapshot identical to the present via equals', () => {
    let h = createHistory('a');
    h = record(h, 'a', { equals: (x, y) => x === y });
    expect(canUndo(h)).toBe(false);
    expect(h.present).toBe('a');
  });

  it('caps undo depth at the limit', () => {
    let h = createHistory('0');
    for (let i = 1; i <= 10; i++) h = record(h, String(i), { limit: 3 });
    // present = "10", past holds at most 3 entries.
    expect(h.past.length).toBeLessThanOrEqual(3);
    expect(h.present).toBe('10');
  });

  it('undo / redo are no-ops at the boundaries', () => {
    let h = createHistory('a');
    expect(undo(h)).toBe(h);
    h = record(h, 'b');
    h = undo(h);
    expect(undo(h)).toBe(h); // already at oldest
    h = redo(h);
    expect(redo(h)).toBe(h); // already at newest
  });
});
