// A small, generic undo/redo stack. Pure and snapshot-agnostic so it can be
// unit tested without any DOM, then driven by the editor history hook.

export interface HistoryState<T> {
  past: T[];
  present: T | null;
  future: T[];
}

export function createHistory<T>(present: T | null = null): HistoryState<T> {
  return { past: [], present, future: [] };
}

/**
 * Record a new snapshot as the present, pushing the old present onto the undo
 * stack and clearing the redo stack. A no-op if the snapshot equals the
 * current present (compared via `equals`) so idle "input" events don't bloat
 * history. `limit` caps the undo depth.
 */
export function record<T>(
  state: HistoryState<T>,
  snapshot: T,
  options: { limit?: number; equals?: (a: T, b: T) => boolean } = {}
): HistoryState<T> {
  const { limit = 100, equals } = options;
  if (state.present !== null && equals?.(state.present, snapshot)) {
    return state;
  }
  const past =
    state.present === null ? state.past : [...state.past, state.present];
  return {
    past: past.slice(-limit),
    present: snapshot,
    future: [],
  };
}

export function canUndo<T>(state: HistoryState<T>): boolean {
  return state.past.length > 0;
}

export function canRedo<T>(state: HistoryState<T>): boolean {
  return state.future.length > 0;
}

/** Move one step back. Returns the same state when there is nothing to undo. */
export function undo<T>(state: HistoryState<T>): HistoryState<T> {
  if (state.past.length === 0) return state;
  const past = [...state.past];
  const previous = past.pop() as T;
  return {
    past,
    present: previous,
    future: state.present === null ? state.future : [state.present, ...state.future],
  };
}

/** Move one step forward. Returns the same state when there is nothing to redo. */
export function redo<T>(state: HistoryState<T>): HistoryState<T> {
  if (state.future.length === 0) return state;
  const [next, ...future] = state.future;
  return {
    past: state.present === null ? state.past : [...state.past, state.present],
    present: next,
    future,
  };
}
