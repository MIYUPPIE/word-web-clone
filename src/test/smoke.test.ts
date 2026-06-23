import { describe, it, expect } from 'vitest';

describe('test runner', () => {
  it('runs in jsdom with a working DOM', () => {
    const el = document.createElement('div');
    el.textContent = 'hello';
    expect(el.textContent).toBe('hello');
    expect(typeof localStorage).toBe('object');
  });
});
