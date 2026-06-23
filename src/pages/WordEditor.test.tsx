import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { EditorProvider } from '@/contexts/EditorContext';
import WordEditor from './WordEditor';
import { saveDocument } from '@/services/persistence/persistence';

function renderEditor() {
  return render(
    <EditorProvider>
      <WordEditor />
    </EditorProvider>
  );
}

function getEditor(container: HTMLElement): HTMLElement {
  return container.querySelector('[contenteditable="true"]') as HTMLElement;
}

describe('WordEditor (full mount)', () => {
  it('mounts the whole editor without throwing', () => {
    renderEditor();
    expect(screen.getByText('Document1 - Word')).toBeInTheDocument();
    // Status bar pieces are present.
    expect(screen.getByText(/Page \d+ of \d+/)).toBeInTheDocument();
    expect(screen.getByText(/words?$/)).toBeInTheDocument();
  });

  it('restores a persisted document into the editor on mount', () => {
    saveDocument('<p>persisted hello world</p>', 999);
    const { container } = renderEditor();
    const editor = getEditor(container);
    expect(editor.innerHTML).toBe('<p>persisted hello world</p>');
  });

  it('shows live word count for the document', async () => {
    saveDocument('<p>one two three four</p>', 1);
    renderEditor();
    // The MutationObserver recomputes the count after the document restores.
    expect(await screen.findByText('4 words')).toBeInTheDocument();
  });

  it('opens the Find & Replace panel from the ribbon', () => {
    renderEditor();
    // The Find tool button carries an accessible title.
    const findButton = screen.getByTitle(/Find \(Ctrl\+F\)/i);
    fireEvent.click(findButton);
    expect(screen.getByPlaceholderText('Find')).toBeInTheDocument();
  });

  it('toggles the status-bar counter between words and characters', async () => {
    saveDocument('<p>ab cd</p>', 1);
    renderEditor();
    const counter = await screen.findByText('2 words');
    fireEvent.click(counter);
    expect(screen.getByText('5 characters')).toBeInTheDocument();
  });

  it('renders a save-status indicator', () => {
    saveDocument('<p>x</p>', 1);
    renderEditor();
    // After restore, the indicator reflects a saved state.
    const status = within(document.body).getByText(/Saved/);
    expect(status).toBeInTheDocument();
  });
});
